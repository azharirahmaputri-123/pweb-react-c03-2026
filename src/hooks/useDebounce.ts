// [ORANG 1] Custom Hook wajib #2. Dipakai: useDebounce(keyword, 400).
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // ketik lagi sebelum jeda habis -> timer lama dibatalkan
  }, [value, delay]);

  return debounced;
}
