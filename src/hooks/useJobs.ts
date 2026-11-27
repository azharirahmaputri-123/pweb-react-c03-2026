// [ORANG 1] Fetch lowongan (useEffect + fetch + AbortController).
import { useCallback, useEffect, useState } from "react";
import type { DataSource, FetchState, JobListing } from "../types";
import { fetchLocalJobs, fetchRemotiveJobs } from "../services/jobService";

export interface UseJobsResult {
  jobs: JobListing[];
  state: FetchState;
  errorMessage: string | null;
  source: DataSource;
  setSource: (s: DataSource) => void;
  retry: () => void;
  switchToLocal: () => void; // (di kerangka bernama useFallback; diganti agar tidak bentrok aturan eslint hooks)
}

export function useJobs(): UseJobsResult {
  const [source, setSource] = useState<DataSource>("live");
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [state, setState] = useState<FetchState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    setErrorMessage(null);

    const load = source === "live" ? fetchRemotiveJobs : fetchLocalJobs;
    load(controller.signal)
      .then((data) => {
        setJobs(data);
        setState("success");
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return; // dibatalkan, abaikan
        setJobs([]);
        setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan tak dikenal.");
        setState("error");
      });

    return () => controller.abort(); // cleanup: batalkan fetch saat source berubah / unmount
  }, [source, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);
  const switchToLocal = useCallback(() => setSource("local"), []);

  return { jobs, state, errorMessage, source, setSource, retry, switchToLocal };
}
