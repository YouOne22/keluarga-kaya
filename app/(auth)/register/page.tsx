"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Save phone number to profiles (upsert so create_family can merge later)
    if (phone.trim()) {
      const uid = authData.user?.id;
      if (uid) {
        await supabase.from("profiles").upsert({
          id: uid,
          full_name: fullName,
          phone_number: phone.trim(),
        }, { onConflict: "id" });
      }
    }

    router.push("/dashboard");
    router.refresh();
  }

  return <div className="auth-page"><div className="auth-hero"><div className="auth-brand"><img src="/images/logo-landing.png" alt=""/>Keluarga <b>Kaya</b></div><div className="auth-copy"><h1>Mulai dari satu catatan.</h1><p>Bangun kebiasaan finansial sehat bersama orang yang paling penting.</p></div></div><div className="auth-form-wrap"><div className="auth-form"><h2>Buat akun</h2><p>Daftar gratis dan buat keluarga pertama Anda.</p><form onSubmit={handleRegister}><div className="field"><label>Nama lengkap</label><input className="input" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nama Anda" required /></div><div className="field"><label>Email</label><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" required /></div><div className="field"><label>Nomor WhatsApp</label><input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08123456789" /></div><div className="field"><label>Password</label><input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 6 karakter" minLength={6} required /></div>{error && <div className="notice error">{error}</div>}<button className="button button-primary" disabled={loading}>{loading ? "Mendaftar..." : "Buat akun"}</button></form><p className="auth-footer">Sudah punya akun? <Link href="/login">Masuk</Link></p></div></div></div>;
}