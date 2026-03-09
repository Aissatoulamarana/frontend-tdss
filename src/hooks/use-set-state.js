import { useMemo, useState, useEffect, useCallback, useRef } from 'react';

import dayjs from 'src/utils/format-time';
import { isEqual } from 'src/utils/helper';
import { usePathname } from 'src/routes/hooks';

// ----------------------------------------------------------------------

const STORAGE_PREFIX = 'tdss:set-state';
const DAYJS_MARKER = '__DAYJS__';
const DATE_KEY_PATTERN = /(date|_at|before|after|start|end)/i;

function createStorageKey({ storageKey, persistByPath, pathname }) {
  if (storageKey) return `${STORAGE_PREFIX}:${storageKey}`;
  if (!persistByPath) return null;

  const safePath = (pathname || '/').replace(/[^\w/-]/g, '_');

  return `${STORAGE_PREFIX}:${safePath}`;
}

function encodeState(state) {
  const payload = {};

  Object.entries(state || {}).forEach(([key, value]) => {
    if (value === undefined) return;

    // Keep DatePicker values stable across reloads (dayjs -> ISO marker).
    if (value && DATE_KEY_PATTERN.test(key)) {
      const parsed = dayjs(value);
      if (parsed.isValid()) {
        payload[key] = `${DAYJS_MARKER}${parsed.toISOString()}`;
        return;
      }
    }

    payload[key] = value;
  });

  return JSON.stringify(payload);
}

function decodeState(rawValue) {
  const parsed = JSON.parse(rawValue);

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return null;
  }

  const restored = { ...parsed };

  Object.entries(restored).forEach(([key, value]) => {
    if (typeof value !== 'string') return;

    if (value.startsWith(DAYJS_MARKER) && DATE_KEY_PATTERN.test(key)) {
      const parsedDate = dayjs(value.replace(DAYJS_MARKER, ''));
      restored[key] = parsedDate.isValid() ? parsedDate : null;
    }
  });

  return restored;
}

export function useSetState(initialState, options = {}) {
  const { persistByPath = false, storageKey } = options;
  const pathname = usePathname();
  const initialStateRef = useRef(initialState);
  const [state, set] = useState(initialStateRef.current);
  const [isHydrated, setIsHydrated] = useState(false);

  const persistKey = useMemo(
    () =>
      createStorageKey({
        storageKey,
        persistByPath,
        pathname,
      }),
    [storageKey, persistByPath, pathname]
  );

  useEffect(() => {
    if (!persistKey) {
      setIsHydrated(true);
      return;
    }

    try {
      const saved = window.localStorage.getItem(persistKey);

      if (saved) {
        const restored = decodeState(saved);
        if (restored) {
          set((prevValue) => ({ ...prevValue, ...restored }));
        }
      }
    } catch (error) {
      console.error('Error while restoring persisted state:', error);
    } finally {
      setIsHydrated(true);
    }
  }, [persistKey]);

  useEffect(() => {
    if (!persistKey || !isHydrated) return;

    try {
      if (isEqual(state, initialStateRef.current)) {
        window.localStorage.removeItem(persistKey);
        return;
      }

      window.localStorage.setItem(persistKey, encodeState(state));
    } catch (error) {
      console.error('Error while persisting state:', error);
    }
  }, [persistKey, state, isHydrated]);

  const canReset = !isEqual(state, initialStateRef.current);

  const setState = useCallback((updateState) => {
    set((prevValue) => {
      const partialUpdate =
        typeof updateState === 'function' ? updateState(prevValue) : updateState;

      if (!partialUpdate || typeof partialUpdate !== 'object') {
        return prevValue;
      }

      return { ...prevValue, ...partialUpdate };
    });
  }, []);

  const setField = useCallback(
    (name, updateValue) => {
      setState({
        [name]: updateValue,
      });
    },
    [setState]
  );

  const onResetState = useCallback(() => {
    set(initialStateRef.current);

    if (!persistKey) return;

    try {
      window.localStorage.removeItem(persistKey);
    } catch (error) {
      console.error('Error while clearing persisted state:', error);
    }
  }, [persistKey]);

  const memoizedValue = useMemo(
    () => ({
      state,
      setState,
      setField,
      onResetState,
      canReset,
    }),
    [canReset, onResetState, setField, setState, state]
  );

  return memoizedValue;
}
