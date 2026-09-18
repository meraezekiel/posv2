import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

import { forgetImage, keepImage } from '@/domain/images';
import { usePosStore } from '@/store/pos-store';

type Args = {
  uri?: string;
  name: string;
  onChange: (uri: string | undefined) => void;
};

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: 'images',
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.6,
};

export function useImageFieldHandler({ uri, name, onChange }: Args) {
  const { showGlobalToast } = usePosStore();
  const [isOpen, setIsOpen] = useState(false);

  /** Saves the picked image into app storage and hands back its lasting uri. */
  const accept = useCallback(
    (result: ImagePicker.ImagePickerResult) => {
      setIsOpen(false);
      if (result.canceled || !result.assets?.length) return;
      try {
        const saved = keepImage(result.assets[0].uri, `${name}-${Date.now()}`);
        forgetImage(uri);
        onChange(saved);
      } catch {
        showGlobalToast("Couldn't save that photo — try another one");
      }
    },
    [name, onChange, showGlobalToast, uri],
  );

  const takePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setIsOpen(false);
      showGlobalToast('Camera access is off — allow it in phone settings');
      return;
    }
    accept(await ImagePicker.launchCameraAsync(PICKER_OPTIONS));
  }, [accept, showGlobalToast]);

  const pickFromGallery = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setIsOpen(false);
      showGlobalToast('Photo access is off — allow it in phone settings');
      return;
    }
    accept(await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS));
  }, [accept, showGlobalToast]);

  const remove = useCallback(() => {
    setIsOpen(false);
    forgetImage(uri);
    onChange(undefined);
  }, [onChange, uri]);

  return {
    isOpen,
    open: useCallback(() => setIsOpen(true), []),
    close: useCallback(() => setIsOpen(false), []),
    takePhoto,
    pickFromGallery,
    remove,
  };
}
