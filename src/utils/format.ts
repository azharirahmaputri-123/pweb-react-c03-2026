// [SHARED] Helper kecil umum.
export function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function parseSalaryString(s: string): number {
  if (!s) return 0;
  // Menghapus karakter non-digit: "Rp 4.500.000" -> 4500000
  const clean = s.replace(/\D/g, "");
  return clean ? parseInt(clean, 10) : 0;
}

export function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
