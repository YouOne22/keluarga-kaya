import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { redirect } = await import("next/navigation");
    redirect("/dashboard");
  }

  return <main className="landing-page">
    <nav className="landing-nav">
      <Link href="/" className="landing-brand">
        <img src="/images/logo-landing.png" alt="" />
        <span>Keluarga <b>Kaya</b></span>
      </Link>
      <Link href="/login" className="landing-login">Masuk</Link>
    </nav>
    <section className="landing-hero">
      <div className="landing-copy">
        <div className="landing-logo-lockup"><img src="/images/logo-landing.png" alt="" /></div>
        <span className="landing-kicker">Kelola Keuangan Keluarga</span>
        <h1>Bersama, wujudkan<br /><span>keluarga yang lebih sejahtera</span></h1>
        <p>Catat, rencanakan, dan kelola keuangan keluarga dengan lebih mudah.</p>
      </div>
      <div className="landing-visual">
        <img src="/images/family.png" alt="Keluarga mengelola keuangan bersama" />
      </div>
      <div className="landing-cta-panel">
        <Link href="/register" className="landing-cta button button-primary">Mulai Sekarang <ArrowRight size={19} /></Link>
        <p className="landing-note-text">Kelola keuangan keluarga menuju masa depan yang lebih baik</p>
      </div>
    </section>
  </main>;
}