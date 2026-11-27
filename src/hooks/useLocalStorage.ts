// [ORANG 3] Custom Hook wajib #1. Dipakai untuk applications & kaptenSkills.
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Abaikan error kuota/private mode agar aplikasi tetap berjalan
    }
  }, [key, value]);

  return [value, setValue];
}
