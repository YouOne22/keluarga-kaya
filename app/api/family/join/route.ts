import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function redirectToDashboard(request: NextRequest, error?: string) {
  const url = new URL("/dashboard", request.url);
  if (error) url.searchParams.set("setup_error", error);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  }

  const formData = await request.formData();
  const phone = String(formData.get("phone") || "").trim();

  if (!phone) {
    return redirectToDashboard(request, "Nomor WhatsApp wajib diisi.");
  }

  const { error } = await supabase.rpc("join_family_by_phone", { p_phone: phone });

  if (error) {
    console.error("join_family_by_phone failed", error);
    let msg = "Gagal bergabung dengan keluarga.";
    if (error.message) {
      msg = error.message;
    }
    return redirectToDashboard(request, msg);
  }

  return redirectToDashboard(request);
}