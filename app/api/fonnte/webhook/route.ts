import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseWAMessage, formatRupiah } from "@/lib/parse-wa-message";
import { sendWhatsApp } from "@/lib/fonnte";

// Service-role client for webhook (bypasses RLS)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// In-memory draft state (production: use DB)
// Stores pending confirmations per sender phone number
const pendingDrafts = new Map<string, {
  householdId: string;
  userId: string;
  type: string;
  amount: number;
  description: string;
  category: string | null;
  createdAt: number;
}>();

// Expire drafts after 10 minutes
function cleanExpiredDrafts() {
  const now = Date.now();
  for (const [key, draft] of pendingDrafts) {
    if (now - draft.createdAt > 10 * 60 * 1000) {
      pendingDrafts.delete(key);
    }
  }
}

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "62" + cleaned.substring(1);
  if (!cleaned.startsWith("62")) cleaned = "62" + cleaned;
  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sender: string | undefined = body.sender;
    const message: string | undefined = body.message;
    const name: string | undefined = body.name;
    const inboxid: number | undefined = body.inboxid;

    if (!sender || !message) {
      return NextResponse.json({ status: "ignored", reason: "no sender or message" });
    }

    const admin = getAdminClient();
    const phone = normalizePhone(sender);
    const text = message.trim();

    // 1. Find household member by phone number
    const { data: member } = await admin
      .from("household_members")
      .select("id, household_id, user_id, full_name")
      .eq("phone_number", phone)
      .single();

    if (!member) {
      await sendWhatsApp(sender, "Nomor Anda belum terdaftar di Keluarga Kaya. Silakan daftar melalui aplikasi.", { inboxid });
      return NextResponse.json({ status: "ignored", reason: "unknown number" });
    }

    // 2. Check if this is a confirmation reply (SIMPAN / BATAL)
    const upperText = text.toUpperCase().trim();

    if (upperText === "SIMPAN" || upperText === "SIMPAN.") {
      cleanExpiredDrafts();
      const draft = pendingDrafts.get(phone);

      if (!draft) {
        await sendWhatsApp(sender, "Tidak ada transaksi yang perlu dikonfirmasi. Silakan kirim transaksi baru.", { inboxid });
        return NextResponse.json({ status: "ok" });
      }

      // Insert confirmed transaction
      const { error } = await admin.from("transactions").insert({
        household_id: draft.householdId,
        family_id: draft.householdId,
        user_id: draft.userId,
        type: draft.type,
        amount: draft.amount,
        description: draft.description,
        category: draft.category,
        source: "whatsapp",
        status: "confirmed",
      });

      if (error) {
        await sendWhatsApp(sender, "Gagal menyimpan transaksi. Silakan coba lagi.", { inboxid });
        return NextResponse.json({ status: "error", reason: error.message });
      }

      pendingDrafts.delete(phone);

      // Create notification for partner
      const { data: allMembers } = await admin
        .from("household_members")
        .select("user_id")
        .eq("household_id", draft.householdId)
        .neq("user_id", draft.userId);

      if (allMembers) {
        for (const m of allMembers) {
          await admin.from("notifications").insert({
            household_id: draft.householdId,
            family_id: draft.householdId,
            user_id: m.user_id,
            type: "transaction",
            title: `${member.full_name} mencatat ${draft.type === "income" ? "pemasukan" : "pengeluaran"}`,
            body: `${draft.description} — ${formatRupiah(draft.amount)}`,
          });
        }
      }

      await sendWhatsApp(sender, "Transaksi berhasil dicatat. ✅", { inboxid });
      return NextResponse.json({ status: "ok" });
    }

    if (upperText === "BATAL" || upperText === "BATAL.") {
      cleanExpiredDrafts();
      pendingDrafts.delete(phone);
      await sendWhatsApp(sender, "Transaksi dibatalkan. ❌", { inboxid });
      return NextResponse.json({ status: "ok" });
    }

    // 3. Parse new transaction message
    const parsed = parseWAMessage(text);

    if (!parsed.valid) {
      await sendWhatsApp(sender, `⚠️ ${parsed.error}\n\nFormat: [nominal] [catatan]\nContoh: keluar 85000 makan siang`, { inboxid });
      return NextResponse.json({ status: "ok" });
    }

    // Store draft for confirmation
    pendingDrafts.set(phone, {
      householdId: member.household_id,
      userId: member.user_id,
      type: parsed.type,
      amount: parsed.amount,
      description: parsed.description,
      category: parsed.categoryHint,
      createdAt: Date.now(),
    });

    const typeLabel = parsed.type === "income" ? "Pemasukan" : "Pengeluaran";
    const categoryLine = parsed.categoryHint ? `Kategori: ${parsed.categoryHint}` : "Kategori: (otomatis)";

    const confirmationMsg = [
      `📋 *Konfirmasi Transaksi*`,
      ``,
      `${typeLabel}: ${formatRupiah(parsed.amount)}`,
      `Catatan: ${parsed.description}`,
      categoryLine,
      ``,
      `Balas *SIMPAN* atau *BATAL*`,
    ].join("\n");

    await sendWhatsApp(sender, confirmationMsg, { inboxid });

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ status: "error", reason: "internal" }, { status: 500 });
  }
}