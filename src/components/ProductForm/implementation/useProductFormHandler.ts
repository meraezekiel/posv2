import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import type { Product } from '@/domain/catalog';
import { usePosStore } from '@/store/pos-store';

type FormValues = {
  name: string;
  price: string;
  stock: string;
  barcode: string;
  unit: string;
  low: string;
  photo: string;
};

/**
 * Backs both jobs the form does: editing an existing product, and the
 * quick-add that follows an unknown barcode (which then goes to the cart).
 */
export function useProductFormHandler() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; barcode?: string; addToCart?: string }>();
  const { products, saveProduct, addProductToCart, isBarcodeTaken, showToast } = usePosStore();

  const editing = useMemo(
    () => (params.id ? products.find((p) => p.id === params.id) : undefined),
    [params.id, products],
  );
  const addToCart = params.addToCart === '1';

  const [values, setValues] = useState<FormValues>(() => ({
    name: editing?.name ?? '',
    price: editing ? String(editing.price) : '',
    stock: editing ? String(editing.stock) : '',
    barcode: editing?.barcode ?? params.barcode ?? '',
    unit: editing?.unit ?? 'pc',
    low: editing ? String(editing.low) : '5',
    photo: editing?.photo ?? '',
  }));

  const setField = useCallback((key: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const generateBarcode = useCallback(() => {
    setField('barcode', `LOCAL-${Math.floor(100000 + Math.random() * 899999)}`);
  }, [setField]);

  const canSave = !!values.name.trim() && !!values.price.trim();

  const save = useCallback(() => {
    if (!canSave) return;
    const record: Product = {
      id: editing?.id ?? `n${Date.now()}`,
      name: values.name.trim(),
      price: Number(values.price) || 0,
      stock: Number(values.stock) || 0,
      low: Number(values.low) || 0,
      unit: values.unit || 'pc',
      barcode: values.barcode.trim(),
      quick: !values.barcode.trim(),
      photo: values.photo || undefined,
    };
    saveProduct(record);

    if (addToCart) {
      addProductToCart(record, 'Saved · +1 ');
      // Quick-add sits in the Sell stack, so going back lands on the cart.
      router.back();
      return;
    }
    showToast(editing ? 'Saved' : 'Product added');
    router.back();
  }, [addProductToCart, addToCart, canSave, editing, router, saveProduct, showToast, values]);

  const cancel = useCallback(() => router.back(), [router]);

  return {
    title: editing ? 'Edit product' : 'New product',
    cancel,
    values,
    setField,
    generateBarcode,
    warning: isBarcodeTaken(values.barcode.trim(), editing?.id ?? null)
      ? 'That barcode is already on another product. Scanning it will always pick the first one.'
      : null,
    canSave,
    saveLabel: addToCart ? 'Save and add to cart' : editing ? 'Save changes' : 'Save product',
    save,
    // Names the stored file; new products don't have an id until they're saved.
    photoName: editing?.id ?? 'product-new',
  };
}
