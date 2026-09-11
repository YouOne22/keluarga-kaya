export type Account = { id: string; name: string; account_type: string; color: string; opening_balance: number; is_archived?: boolean };
export type Category = { id: string; name: string; kind: "income" | "expense"; icon: string; color: string };
export type FinancialTransaction = { id: string; type: "income" | "expense"; amount: number; description: string; transaction_date: string; source: string; category?: { name: string; icon: string; color: string } | null; account?: { name: string; color: string } | null; };
export function formatRupiah(value: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0); }
export function formatDate(value: string) { return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`)); }
export function today() { return new Date().toISOString().slice(0, 10); }
export function initials(name: string) { return name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase(); }
export function errorMessage(error: unknown) { return error instanceof Error ? error.message : "Terjadi kesalahan. Coba lagi."; }
export const accountTypes: Record<string, string> = { cash: "Kas", bank: "Bank", ewallet: "E-wallet", investment: "Investasi", other: "Lainnya" };
export const iconNames = ["circle", "wallet", "utensils", "car", "zap", "shopping-cart", "heart-pulse", "graduation-cap", "gamepad-2"];
export const iconEmoji: Record<string, string> = { wallet: "▣", utensils: "♨", car: "⌁", zap: "ϟ", "shopping-cart": "□", "heart-pulse": "+", "graduation-cap": "◇", "gamepad-2": "◆", circle: "•" };
export const categoryColors = ["#008d51", "#f39a2e", "#2886e8", "#e8498b", "#8a5bd7", "#ef5550"];
export function moneyInput(value: string) { return value.replace(/\D/g, ""); }
export function amountValue(value: string) { return Number(moneyInput(value)); }
export function formatInput(value: string) { const clean = moneyInput(value); return clean ? new Intl.NumberFormat("id-ID").format(Number(clean)) : ""; }

export const txSelect = "id,type,amount,description,transaction_date,source,category:categories(name,icon,color),account:accounts(name,color)";

export type SavingGoal = { id: string; family_id: string; name: string; category: string; icon: string; color: string; target_amount: number; current_amount: number; deadline: string | null; status: string; created_at: string; };
export type SavingGoalDeposit = { id: string; goal_id: string; amount: number; note: string; created_by: string | null; created_at: string; };

export const goalCategories = ["Pendidikan", "Rumah", "Kendaraan", "Liburan", "Pernikahan", "Dana Darurat", "Modal Usaha", "Lainnya"] as const;
export const goalColors: Record<string, string> = { Pendidikan: "#2886e8", Rumah: "#008d51", Kendaraan: "#f59a27", Liburan: "#e8498b", Pernikahan: "#8a5bd7", "Dana Darurat": "#ef5550", "Modal Usaha": "#f39a2e", Lainnya: "#6b8580" };
