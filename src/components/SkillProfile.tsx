// [ORANG 1] Profil skill Kapten
import { useState, type FormEvent } from "react";

export interface SkillProfileProps {
  skills: string[];
  onAdd: (skill: string) => string | null; // return pesan error jika duplikat/kosong
  onRemove: (skill: string) => void;
}

export default function SkillProfile({ skills, onAdd, onRemove }: SkillProfileProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const err = onAdd(value);
    setError(err);
    if (err === null) setValue("");
  }

  return (
    <section className="card">
      <h3>Profil Skill Kapten</h3>
      <form onSubmit={handleSubmit} className="row">
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Tambah skill…" aria-label="Tambah skill" />
        <button type="submit">Tambah</button>
      </form>
      {error !== null && <p className="error">{error}</p>}
      <ul className="chips">
        {skills.map((s) => (
          <li key={s} className="chip">
            {s}
            <button type="button" aria-label={`Hapus ${s}`} onClick={() => onRemove(s)}>×</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
