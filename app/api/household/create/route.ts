import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function redirectToDashboard(request: NextRequest, error?: string) {
  const url = new URL("/dashboard", request.url);
  if (error) url.searchParams.set("setup_error", error);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    return redirectToDashboard(request, "Nama rumah tangga wajib diisi.");
  }

  const { error } = await supabase.rpc("create_family", { p_name: name });

  if (error) {
    console.error("create_household failed", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    let userMessage = "Keluarga gagal dibuat.";
    if (error.code === "42883" || error.message?.includes("function") || error.message?.includes("does not exist")) {
      userMessage += " Fungsi create_family belum ada. Pastikan migration 003_phase1_financial_schema.sql sudah dijalankan di Supabase SQL Editor.";
    } else if (error.code === "23505") {
      userMessage += " Anda sudah memiliki keluarga. Silakan hubungi admin jika perlu membuat baru.";
    } else if (error.code === "42501") {
      userMessage += " Tidak memiliki izin. Pastikan RLS policy sudah benar.";
    } else {
      userMessage += ` Detail: ${error.message}`;
    }

    return redirectToDashboard(request, userMessage);
  }

  return redirectToDashboard(request);
}