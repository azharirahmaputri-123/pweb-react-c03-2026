// [SHARED] Helper kecil umum.
const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatRupiah(n: number): string {
  if (!Number.isFinite(n)) return "Rp 0";
  return rupiahFormatter.format(n);
}

export function parseSalaryString(s: string): number {
  const digits = s.replace(/\D/g, "");
  if (digits === "") return 0;
  const parsed = Number.parseInt(digits, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatDateTime(iso: string): string {
  const timestamp = Date.parse(iso);
  if (Number.isNaN(timestamp)) return iso;
  return dateTimeFormatter.format(new Date(timestamp));
}
