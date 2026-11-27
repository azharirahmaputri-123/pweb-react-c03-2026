// [ORANG 1] Ubah JobListing -> input lamaran baru (status WISHLIST).
import type { JobListing, WorkMode } from "../types";
import type { NewApplicationInput } from "../hooks/useApplications";

export function guessWorkMode(location: string): WorkMode {
  const l = location.toLowerCase();
  if (l.includes("hybrid")) return "Hybrid";
  if (l.includes("onsite") || l.includes("on-site")) return "Onsite";
  return "Remote";
}

export function jobToNewApplication(job: JobListing): NewApplicationInput {
  return {
    company: job.company_name,
    role: job.title,
    workMode: guessWorkMode(job.candidate_required_location),
    status: "WISHLIST",
    requiredSkills: job.tags,
  };
}
