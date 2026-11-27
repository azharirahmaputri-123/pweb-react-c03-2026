// [ORANG 1] Service fetch lowongan.
import type { JobListing } from "../types";

export const REMOTIVE_URL = "https://remotive.com/api/remote-jobs?category=software-dev&limit=30";
export const FALLBACK_URL = "/magang-fallback.json";

async function getJson(url: string, signal: AbortSignal): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, { signal });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new Error("Gagal terhubung ke server. Periksa koneksi internet kamu.");
  }
  if (!res.ok) throw new Error(`Server membalas dengan status ${res.status}.`);
  return (await res.json()) as unknown;
}

function extractJobs(data: unknown): JobListing[] {
  let raw: unknown[] | null = null;
  if (Array.isArray(data)) {
    raw = data;
  } else if (typeof data === "object" && data !== null && "jobs" in data) {
    const jobs = (data as { jobs: unknown }).jobs;
    if (Array.isArray(jobs)) raw = jobs;
  }
  if (raw === null) throw new Error("Format data lowongan tidak dikenali.");
  return (raw as JobListing[]).map((j) => ({ ...j, tags: Array.isArray(j.tags) ? j.tags : [] }));
}

export async function fetchRemotiveJobs(signal: AbortSignal): Promise<JobListing[]> {
  return extractJobs(await getJson(REMOTIVE_URL, signal));
}

export async function fetchLocalJobs(signal: AbortSignal): Promise<JobListing[]> {
  return extractJobs(await getJson(FALLBACK_URL, signal));
}
