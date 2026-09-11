import Link from "next/link";
import { ArrowRight, CircleDollarSign } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app/navigation";
import { formatRupiah, iconEmoji } from "@/lib/financial";
export const dynamic = "force-dynamic";

export default async function AnggaranPage() {
  const supabase = await createClient();
  const { data: member } = await supabase.from("family_members").select("family_id").limit(1).maybeSingle();
  if (!member) return <EmptyBudget />;
  const start = new Date(); start.setDate(1);
  const [{ data: categories }, { data: transactions }] = await Promise.all([
    supabase.from("categories").select("id,name,icon,color").eq("family_id", member.family_id).eq("kind", "expense").eq("is_archived", false).limit(8),
    supabase.from("transactions").select("category_id,amount").eq("family_id", member.family_id).eq("type", "expense").eq("status", "confirmed").gte("transaction_date", start.toISOString().slice(0, 10)),
  ]);
  const spent = (transactions || []).reduce((sum, tx) => sum + Number(tx.amount), 0);
  const items = (categories || []).map((category, index) => {
    const total = (transactions || []).filter(tx => tx.category_id === category.id).reduce((sum, tx) => sum + Number(tx.amount), 0);
    const limit = Math.max(total * 1.35, 500000);
    return { ...category, total, limit, percent: Math.min(Math.round((total / limit) * 100), 100), color: category.color || ["#f39a2e", "#378bdd", "#e85d99", "#087d4d"][index % 4] };
  });
  return <><AppHeader title="Anggaran" subtitle="Beri arah untuk setiap rupiah" action={<Link href="/transaksi?add=1" className="button button-primary">+ Catat</Link>}/><section className="budget-hero"><span className="eyebrow">Pengeluaran bulan ini</span><h2>{formatRupiah(spent)}</h2><p>Anggaran membantu keluarga melihat ritme pengeluaran. Tetapkan batas resmi setelah modul anggaran aktif.</p></section><div className="section-title" style={{marginTop:28}}><h2>Per kategori</h2><span style={{color:"var(--muted)",fontSize:12}}>Bulan ini</span></div>{items.length ? <div className="budget-grid">{items.map(item => <div className="budget-card" key={item.id}><div className="budget-card-head"><span style={{background:item.color}}>{iconEmoji[item.icon] || "•"}</span><div><strong>{item.name}</strong><div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>{item.percent}% dari batas rekomendasi</div></div></div><div className="budget-meter"><span style={{width:`${item.percent}%`,background:item.color}}/></div><div className="budget-meta"><span>{formatRupiah(item.total)}</span><span>{formatRupiah(item.limit)}</span></div></div>)}</div> : <div className="card empty"><CircleDollarSign size={28}/><strong>Belum ada kategori</strong>Tambahkan transaksi atau kategori untuk mulai membaca pola pengeluaran.</div>}<div className="card side-panel" style={{marginTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",gap:15}}><div><strong>Ingin melihat detail?</strong><div style={{color:"var(--muted)",fontSize:12,marginTop:4}}>Bandingkan semua arus kas di laporan keluarga.</div></div><Link href="/laporan" className="button button-secondary">Laporan <ArrowRight size={14} style={{verticalAlign:"middle"}}/></Link></div></>;
}
function EmptyBudget(){return <><AppHeader title="Anggaran" subtitle="Beri arah untuk setiap rupiah"/><div className="card target-empty" style={{padding:30}}><span className="quick-icon"><CircleDollarSign/></span><h2>Siapkan ruang keluarga</h2><p>Buat keluarga terlebih dahulu untuk membaca pengeluaran dan menyusun anggaran.</p><Link href="/dashboard" className="button button-primary">Ke beranda</Link></div></>}
