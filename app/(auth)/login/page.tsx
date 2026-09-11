"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email atau password salah"
          : authError.message
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return <div className="auth-page"><div className="auth-hero"><div className="auth-brand"><img src="/images/logo-landing.png" alt=""/>Keluarga <b>Kaya</b></div><div className="auth-copy"><h1>Keuangan keluarga, lebih tenang.</h1><p>Satu ruang untuk mencatat, merencanakan, dan bertumbuh bersama.</p></div></div><div className="auth-form-wrap"><div className="auth-form"><h2>Selamat datang</h2><p>Masuk untuk melihat kondisi keuangan keluarga.</p><form onSubmit={handleLogin}><div className="field"><label>Email</label><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" required /></div><div className="field"><label>Password</label><input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required /></div>{error && <div className="notice error">{error}</div>}<button className="button button-primary" disabled={loading}>{loading ? "Masuk..." : "Masuk ke akun"}</button></form><p className="auth-footer">Belum punya akun? <Link href="/register">Daftar sekarang</Link></p></div></div></div>;
}