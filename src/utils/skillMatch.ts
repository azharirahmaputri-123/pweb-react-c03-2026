// [ORANG 1] Skill Match (fungsi murni, case-insensitive).
const norm = (s: string): string => s.trim().toLowerCase();

/** Math.round((jumlahCocok / totalRequired) * 100). Total 0 -> 0 (hindari NaN). */
export function calcSkillMatch(kaptenSkills: string[], requiredSkills: string[]): number {
  if (requiredSkills.length === 0) return 0;
  const matched = getMatchedSkills(kaptenSkills, requiredSkills).length;
  return Math.round((matched / requiredSkills.length) * 100);
}

export function getMatchedSkills(kaptenSkills: string[], requiredSkills: string[]): string[] {
  const owned = new Set(kaptenSkills.map(norm));
  return requiredSkills.filter((s) => owned.has(norm(s)));
}

export function getMissingSkills(kaptenSkills: string[], requiredSkills: string[]): string[] {
  const owned = new Set(kaptenSkills.map(norm));
  return requiredSkills.filter((s) => !owned.has(norm(s)));
}

/** green >= 70, yellow 40-69, red < 40 */
export function getMatchColor(score: number): "green" | "yellow" | "red" {
  if (score >= 70) return "green";
  if (score >= 40) return "yellow";
  return "red";
}

/** Validasi tambah skill di Profil Kapten. Return pesan error, atau null jika valid. */
export function validateNewSkill(existing: string[], input: string): string | null {
  const value = input.trim();
  if (value === "") return "Skill tidak boleh kosong.";
  if (existing.some((s) => norm(s) === norm(value))) return `Skill "${value}" sudah ada.`;
  return null;
}
