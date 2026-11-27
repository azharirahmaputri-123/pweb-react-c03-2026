// [ORANG 3] Custom Hook wajib #1. Dipakai untuk applications & kaptenSkills.
import type { Dispatch, SetStateAction } from "react";

export function useLocalStorage<T>(
  _key: string,
  _initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  // TODO: useState lazy init baca localStorage (try/catch JSON.parse),
  //       useEffect simpan tiap value berubah. Dukung functional update.
  throw new Error("TODO: useLocalStorage");
}
