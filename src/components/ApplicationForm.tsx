// [ORANG 1] Form tambah lamaran manual
import { useRef, useState, type FormEvent, type RefObject } from "react";
import type { Application, WorkMode } from "../types";
import type { NewApplicationInput } from "../hooks/useApplications";
import { isDuplicateApplication } from "../utils/duplicate";

export interface ApplicationFormProps {
  applications: Application[];
  onSubmit: (input: NewApplicationInput) => void;
  onCancel: () => void;
}

type FieldKey = "company" | "role" | "cvVersion" | "appliedDate";
type Errors = Partial<Record<FieldKey, string>>;

function parseSkills(raw: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const part of raw.split(",")) {
    const s = part.trim();
    if (s !== "" && !seen.has(s.toLowerCase())) {
      seen.add(s.toLowerCase());
      result.push(s);
    }
  }
  return result;
}

export default function ApplicationForm({ applications, onSubmit, onCancel }: ApplicationFormProps) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [workMode, setWorkMode] = useState<WorkMode>("Remote");
  const [status, setStatus] = useState<"WISHLIST" | "APPLIED">("WISHLIST");
  const [skillsRaw, setSkillsRaw] = useState("");
  const [cvVersion, setCvVersion] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const companyRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const refs: Record<FieldKey, RefObject<HTMLInputElement | null>> = {
    company: companyRef,
    role: roleRef,
    cvVersion: cvRef,
    appliedDate: dateRef,
  };
  const order: FieldKey[] = ["company", "role", "cvVersion", "appliedDate"];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (company.trim() === "") next.company = "Perusahaan wajib diisi.";
    if (role.trim() === "") next.role = "Posisi wajib diisi.";
    if (!next.company && !next.role && isDuplicateApplication(applications, company, role)) {
      next.company = "Lamaran dengan perusahaan + posisi ini sudah ada.";
    }
    if (status === "APPLIED") {
      if (cvVersion.trim() === "") next.cvVersion = "Versi CV wajib diisi.";
      if (appliedDate === "") next.appliedDate = "Tanggal melamar wajib diisi.";
    }

    setErrors(next);
    const firstError = order.find((k) => next[k] !== undefined);
    if (firstError) {
      refs[firstError].current?.focus(); // auto-focus input error pertama
      return;
    }

    onSubmit({
      company: company.trim(),
      role: role.trim(),
      workMode,
      status,
      requiredSkills: parseSkills(skillsRaw),
      ...(status === "APPLIED" ? { cvVersion: cvVersion.trim(), appliedDate } : {}),
    });
  }

  const cls = (k: FieldKey) => (errors[k] ? "invalid" : undefined);

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit} noValidate>
        <h3>Catat Lamaran</h3>

        <label className="field">Perusahaan
          <input ref={companyRef} className={cls("company")} value={company} onChange={(e) => setCompany(e.target.value)} />
          {errors.company && <span className="error">{errors.company}</span>}
        </label>

        <label className="field">Posisi / Role
          <input ref={roleRef} className={cls("role")} value={role} onChange={(e) => setRole(e.target.value)} />
          {errors.role && <span className="error">{errors.role}</span>}
        </label>

        <label className="field">Mode Kerja
          <select value={workMode} onChange={(e) => setWorkMode(e.target.value as WorkMode)}>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </label>

        <label className="field">Status Awal
          <select value={status} onChange={(e) => setStatus(e.target.value as "WISHLIST" | "APPLIED")}>
            <option value="WISHLIST">WISHLIST</option>
            <option value="APPLIED">APPLIED</option>
          </select>
        </label>

        <label className="field">Required Skills (pisahkan dengan koma)
          <input value={skillsRaw} onChange={(e) => setSkillsRaw(e.target.value)} placeholder="React, TypeScript, Docker" />
        </label>

        {status === "APPLIED" && (
          <>
            <label className="field">Versi CV
              <input ref={cvRef} className={cls("cvVersion")} value={cvVersion} onChange={(e) => setCvVersion(e.target.value)} placeholder="Kapten-CV-v2.pdf" />
              {errors.cvVersion && <span className="error">{errors.cvVersion}</span>}
            </label>
            <label className="field">Tanggal Melamar
              <input ref={dateRef} className={cls("appliedDate")} type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} />
              {errors.appliedDate && <span className="error">{errors.appliedDate}</span>}
            </label>
          </>
        )}

        <div className="row">
          <button type="submit">Simpan</button>
          <button type="button" onClick={onCancel}>Batal</button>
        </div>
      </form>
    </div>
  );
}
