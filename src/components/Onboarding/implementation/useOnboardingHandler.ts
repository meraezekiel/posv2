import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Linking } from 'react-native';

import { usePosStore } from '@/store/pos-store';

import { useOnboardingPinHandler } from './handler/useOnboardingPinHandler';

type CameraChoice = 'ask' | 'granted' | 'denied';

const STEP_COUNT = 6;

export function useOnboardingHandler() {
  const router = useRouter();
  const { store, setStore, setVatEnabled, vatEnabled, finishOnboarding, setOwnerPin, showGlobalToast } =
    usePosStore();

  const [step, setStep] = useState(0);
  const [camera, setCamera] = useState<CameraChoice>('ask');
  const pin = useOnboardingPinHandler({
    onConfirmed: (value) => {
      setOwnerPin(value);
      setStep(4);
    },
  });

  const done = useCallback(() => {
    finishOnboarding();
    router.replace('/login');
  }, [finishOnboarding, router]);

  /** Per-step copy and gating, straight from the prototype. */
  const steps = [
    {
      title: 'A till in your pocket',
      body: 'Scan, charge and keep stock straight — all on this phone, with no internet needed. Setup takes about two minutes.',
      canNext: true,
      nextLabel: 'Get started',
    },
    {
      title: 'Tell us about the store',
      body: 'This is what prints at the top of every receipt. You can change it later.',
      canNext: !!store.name.trim(),
      nextLabel: store.name.trim() ? 'Continue' : 'Enter a store name',
    },
    {
      title: 'Money and tax',
      body: 'Prices, receipts and reports all follow this.',
      canNext: true,
      nextLabel: 'Continue',
    },
    {
      title: pin.firstEntry ? 'Type it again' : 'Create the owner PIN',
      body: pin.firstEntry
        ? "Confirm the four digits so we know it wasn't a slip."
        : "Four digits. It guards voids, refunds, profit and settings — the things a cashier shouldn't reach.",
      canNext: false,
      nextLabel: 'Enter the PIN above',
    },
    {
      title: 'The camera is your scanner',
      body: 'We only use it to read barcodes at the counter. Nothing is recorded or uploaded.',
      canNext: camera !== 'ask',
      nextLabel: camera === 'denied' ? 'Continue without the camera' : 'Continue',
    },
    {
      title: 'Add your first products',
      body: 'Three or four bestsellers is enough to start. The rest can build up as you scan.',
      canNext: true,
      nextLabel: 'Finish setup',
    },
  ];
  const current = steps[step] ?? steps[0];

  const next = useCallback(() => {
    if (!current.canNext) return;
    if (step === STEP_COUNT - 1) {
      showGlobalToast("Setup done — you're ready to sell");
      done();
      return;
    }
    setStep((s) => s + 1);
  }, [current.canNext, done, showGlobalToast, step]);

  return {
    dots: [0, 1, 2, 3, 4, 5].map((i) => i <= step),
    kicker: `Setup · step ${step + 1} of ${STEP_COUNT}`,
    title: current.title,
    body: current.body,
    step,
    store,
    setStoreField: (key: 'name' | 'address' | 'phone' | 'logo', value: string | undefined) =>
      setStore({ [key]: value }),
    vatOptions: [
      { key: 'yes', label: 'Yes · VAT inclusive' },
      { key: 'no', label: 'No VAT' },
    ],
    vat: vatEnabled,
    setVat: (key: string) => setVatEnabled(key === 'yes'),
    vatNote: vatEnabled
      ? 'Prices you type already include 12% VAT — receipts show the VAT portion as a line.'
      : 'No tax line on receipts. You can switch this later in Settings.',
    pinFilled: pin.filled,
    pinError: pin.error,
    pressPin: pin.press,
    cameraDenied: camera === 'denied',
    allowCamera: useCallback(() => {
      setCamera('granted');
      setStep(5);
      showGlobalToast('Camera ready');
    }, [showGlobalToast]),
    denyCamera: useCallback(() => setCamera('denied'), []),
    openSettings: useCallback(() => void Linking.openSettings(), []),
    scanFirst: useCallback(() => {
      finishOnboarding();
      showGlobalToast('Scan a barcode — unknown codes offer a quick add');
      router.replace('/login');
    }, [finishOnboarding, router, showGlobalToast]),
    addFirst: useCallback(() => {
      finishOnboarding();
      router.replace('/login');
    }, [finishOnboarding, router]),
    canBack: step > 0,
    back: useCallback(() => setStep((s) => Math.max(0, s - 1)), []),
    canNext: current.canNext,
    nextLabel: current.nextLabel,
    next,
  };
}
