import { useSyncExternalStore } from 'react';

// Prerendered pages always contain the default state (no filters). While React hydrates, every
// component must render exactly that; URL-driven state (filters, selections) applies right after.
// Components mounted later by client navigation read the URL on their first render.
let hydrated = false;
const listeners = new Set<() => void>();

export function markHydrated() {
  if (hydrated) return;
  hydrated = true;
  for (const l of listeners) l();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => hydrated,
    () => false,
  );
}
