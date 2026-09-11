export type ParsedTransaction = {
  type: "expense" | "income";
  amount: number;
  description: string;
  categoryHint: string | null;
  valid: boolean;
  error?: string;
};

const CATEGORY_MAP: Record<string, string> = {
  makan: "Makanan",
  makanan: "Makanan",
  nasi: "Makanan",
  kopi: "Makanan",
  minum: "Makanan",
  belanja: "Belanja",
  groceries: "Belanja",
  beli: "Belanja",
  transport: "Transportasi",
  transportasi: "Transportasi",
  ojol: "Transportasi",
  gojek: "Transportasi",
  grab: "Transportasi",
  bensin: "Transportasi",
  listrik: "Tagihan",
  air: "Tagihan",
  internet: "Tagihan",
  wifi: "Tagihan",
  pdam: "Tagihan",
  pulsa: "Tagihan",
  kpr: "Tagihan",
  sewa: "Tagihan",
  cicilan: "Cicilan",
  kredit: "Cicilan",
  obat: "Kesehatan",
  dokter: "Kesehatan",
  rumahsakit: "Kesehatan",
  sekolah: "Pendidikan",
  spp: "Pendidikan",
  buku: "Pendidikan",
  main: "Hiburan",
  hiburan: "Hiburan",
  film: "Hiburan",
  game: "Hiburan",
  tabung: "Tabungan",
  tabungan: "Tabungan",
  gaji: "Pemasukan",
  bonus: "Pemasukan",
  income: "Pemasukan",
  Masuk: "Pemasukan",
  masuk: "Pemasukan",
};

function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function guessCategory(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(keyword)) return category;
  }
  return null;
}

function inferType(text: string): "expense" | "income" {
  const lower = text.toLowerCase();
  if (
    lower.startsWith("masuk ") ||
    lower.startsWith("income ") ||
    lower.startsWith("gaji ") ||
    lower.startsWith("bonus ")
  ) {
    return "income";
  }
  return "expense";
}

export function parseWAMessage(raw: string): ParsedTransaction {
  const text = raw.trim();
  const type = inferType(text);

  // Strip prefix
  const prefixes = [
    "keluar",
    "masuk",
    "bayar",
    "beli",
    "spend",
    "income",
    "output",
    "input",
  ];
  let clean = text;
  for (const p of prefixes) {
    if (clean.toLowerCase().startsWith(p + " ")) {
      clean = clean.substring(p.length + 1).trim();
      break;
    }
  }

  // Match: <number> <description>
  // Number can be: 85000, 85.000, 85rb, 85k, Rp85.000
  const match = clean.match(
    /^(?:rp\.?\s*)?([\d.,]+)\s*(?:rb|k|ribu|juta|m)?\s*(.*)/i
  );

  if (!match) {
    return {
      type,
      amount: 0,
      description: text,
      categoryHint: null,
      valid: false,
      error: "Format tidak dikenali. Gunakan: [nominal] [catatan]",
    };
  }

  let rawNum = match[1].replace(/\./g, "").replace(/,/g, "");
  let amount = parseInt(rawNum, 10);

  const suffix = clean.toLowerCase();
  if (suffix.includes("rb") || suffix.includes("k") || suffix.includes("ribu")) {
    // If original match was small like "85" + "rb" in original
    const suffixMatch = clean.match(
      /^[\s\S]*?([\d.,]+)\s*(rb|k|ribu)/i
    );
    if (suffixMatch) {
      amount = parseInt(suffixMatch[1].replace(/[.,]/g, ""), 10);
      if (suffixMatch[2].toLowerCase() === "rb" || suffixMatch[2].toLowerCase() === "k") {
        amount *= 1000;
      } else {
        amount *= 1000;
      }
    }
  }

  if (suffix.includes("juta") || suffix.includes("jt") || suffix.includes("m")) {
    const suffixMatch = clean.match(
      /^[\s\S]*?([\d.,]+)\s*(juta|jt|m)/i
    );
    if (suffixMatch) {
      amount = parseInt(suffixMatch[1].replace(/[.,]/g, ""), 10);
      amount *= 1_000_000;
    }
  }

  if (isNaN(amount) || amount <= 0) {
    return {
      type,
      amount: 0,
      description: text,
      categoryHint: null,
      valid: false,
      error: "Nominal tidak valid.",
    };
  }

  const description = match[2]?.trim() || "";
  const categoryHint = guessCategory(description || text);

  return {
    type,
    amount,
    description: description || (type === "income" ? "Pemasukan" : "Pengeluaran"),
    categoryHint,
    valid: true,
  };
}

export { formatRupiah };