import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseWAMessage, formatRupiah } from "@/lib/parse-wa-message";
import { sendWhatsApp } from "@/lib/fonnte";

function getAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}
function normalizePhone(p: string) {
  let c = p.replace(/\D/g, "");
  if (c.startsWith("0")) c = "62" + c.substring(1);
  if (!c.startsWith("62")) c = "62" + c;
  return c;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sender: string | undefined = body.sender;
    const message: string | undefined = body.message;
    const inboxid: number | undefined = body.inboxid;

    if (!sender || !message) {
      return NextResponse.json({ status: "ignored", reason: "no sender or message" });
    }

    const admin = getAdminClient();
    const phone = normalizePhone(sender);
    const text = message.trim();

    const { data: profile } = await admin
      .from("profiles").select("id, full_name").eq("phone_number", phone).single();
    if (!profile) return NextResponse.json({ status: "ignored", reason: "unknown number" });

    const { data: fm } = await admin
      .from("family_members").select("family_id").eq("user_id", profile.id).single();
    if (!fm) return NextResponse.json({ status: "ignored", reason: "no family" });

    const userId = profile.id;
    const fullName = profile.full_name;
    const familyId = fm.family_id;
    const upperText = text.toUpperCase().trim();

    if (upperText === "SIMPAN" || upperText === "SIMPAN.") {
      const { data: draft, error: dErr } = await admin
        .from("transactions")
        .select("id, type, amount, description")
        .eq("user_id", userId)
        .eq("family_id", familyId)
        .eq("status", "draft")
        .eq("source", "whatsapp")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (dErr || !draft) {
        console.error("WA draft lookup failed:", dErr?.message, "user:", userId);
        await sendWhatsApp(sender, "Tidak ada transaksi yang perlu dikonfirmasi. Silakan kirim transaksi baru.", { inboxid });
        return NextResponse.json({ status: "ok" });
      }

      const { error: uErr } = await admin
        .from("transactions").update({ status: "confirmed" }).eq("id", draft.id);

      if (uErr) {
        console.error("WA confirm failed:", uErr.message);
        await sendWhatsApp(sender, "Gagal menyimpan transaksi. Silakan coba lagi.", { inboxid });
        return NextResponse.json({ status: "error", reason: uErr.message });
      }

      const { data: partners } = await admin
        .from("family_members").select("user_id")
        .eq("family_id", familyId).neq("user_id", userId);

      if (partners?.length) {
        await admin.from("notifications").insert(partners.map(m => ({
          family_id: familyId, user_id: m.user_id, type: "transaction",
          title: `${fullName} mencatat ${draft.type === "income" ? "pemasukan" : "pengeluaran"}`,
          body: `${draft.description} — ${formatRupiah(draft.amount)}`,
        })));
      }

      await sendWhatsApp(sender, "Transaksi berhasil dicatat. ✅", { inboxid });
      return NextResponse.json({ status: "ok" });
    }

    if (upperText === "BATAL" || upperText === "BATAL.") {
      const { data: draft } = await admin
        .from("transactions").select("id")
        .eq("user_id", userId).eq("family_id", familyId)
        .eq("status", "draft").eq("source", "whatsapp")
        .order("created_at", { ascending: false })
        .limit(1).maybeSingle();

      if (draft) await admin.from("transactions").delete().eq("id", draft.id);

      await sendWhatsApp(sender, "Transaksi dibatalkan. ❌", { inboxid });
      return NextResponse.json({ status: "ok" });
    }

    // 3. Parse new transaction message
    const parsed = parseWAMessage(text);

    if (!parsed.valid) {
      await sendWhatsApp(sender, `⚠️ ${parsed.error}\n\nFormat: [nominal] [catatan]\nContoh: keluar 85000 makan siang`, { inboxid });
      return NextResponse.json({ status: "ok" });
    }

    let categoryId: string | null = null;
    if (parsed.categoryHint) {
      const { data: cat } = await admin
        .from("categories").select("id")
        .eq("family_id", familyId).ilike("name", parsed.categoryHint)
        .limit(1).maybeSingle();
      categoryId = cat?.id ?? null;
    }

    const { error: iErr } = await admin.from("transactions").insert({
      family_id: familyId,
      user_id: userId,
      type: parsed.type,
      amount: parsed.amount,
      description: parsed.description,
      category_id: categoryId,
      transaction_date: new Date().toISOString().slice(0, 10),
      source: "whatsapp",
      status: "draft",
    });

    if (iErr) {
      console.error("WA draft insert failed:", iErr.message, { familyId, userId });
      await sendWhatsApp(sender, "Gagal memproses transaksi. Silakan coba lagi.", { inboxid });
      return NextResponse.json({ status: "error", reason: iErr.message });
    }

    const typeLabel = parsed.type === "income" ? "Pemasukan" : "Pengeluaran";
    const catLabel = parsed.categoryHint ? `Kategori: ${parsed.categoryHint}` : "Kategori: (otomatis)";

    const confirmationMsg = [
      `📋 *Konfirmasi Transaksi*`,
      ``,
      `${typeLabel}: ${formatRupiah(parsed.amount)}`,
      `Catatan: ${parsed.description}`,
      catLabel,
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