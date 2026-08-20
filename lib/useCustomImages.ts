'use client';

import { useSyncExternalStore, useMemo } from 'react';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('tmc_images_updated', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('tmc_images_updated', callback);
    window.removeEventListener('storage', callback);
  };
}

export function useCustomStoreImages(storageKey: string): { [key: string]: string } {
  const jsonString = useSyncExternalStore(
    subscribe,
    () => {
      if (typeof window === 'undefined') return '{}';
      try {
        return localStorage.getItem(storageKey) || '{}';
      } catch {
        return '{}';
      }
    },
    () => '{}'
  );

  return useMemo(() => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return {};
    }
  }, [jsonString]);
}
