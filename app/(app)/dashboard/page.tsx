import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, CircleDollarSign, Landmark, Plus, ShoppingBag, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app/navigation";
import { formatDate, formatRupiah, iconEmoji } from "@/lib/financial";
import { BalanceCard } from "@/components/app/balance-card";
export const dynamic = "force-dynamic";
export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ setup_error?: string }> }) {
  const params = await searchParams; const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <Onboarding/>;
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
  const userName = profile?.full_name || user.user_metadata?.full_name || "Keluarga";
  const { data: member } = await supabase.from("family_members").select("family_id, families(name)").eq("user_id", user.id).limit(1).maybeSingle();
  if (!member) return <Onboarding error={params.setup_error}/>; const familyId = member.family_id as string;
  const family = member.families as unknown as {name?:string}|{name?:string}[]|null; const familyName = (Array.isArray(family)?family[0]?.name:family?.name)||"Keluarga";
  const start = new Date(); start.setDate(1); const startDate=start.toISOString().slice(0,10);
  const [{data:monthTx},{data:recentTx},{data:accounts}] = await Promise.all([
    supabase.from("transactions").select("type,amount").eq("family_id",familyId).eq("status","confirmed").gte("transaction_date",startDate),
    supabase.from("transactions").select("id,type,amount,description,transaction_date,source,category:categories(name,icon,color),account:accounts(name,color)").eq("family_id",familyId).eq("status","confirmed").order("transaction_date",{ascending:false}).limit(6),
    supabase.from("accounts").select("id,name,opening_balance").eq("family_id",familyId).eq("is_archived",false)
  ]);
  const income=(monthTx||[]).filter((t:any)=>t.type==="income").reduce((s:number,t:any)=>s+Number(t.amount),0); const expense=(monthTx||[]).filter((t:any)=>t.type==="expense").reduce((s:number,t:any)=>s+Number(t.amount),0); const balance=(accounts||[]).reduce((s:number,a:any)=>s+Number(a.opening_balance),0)+income-expense;
  return <><AppHeader title={`Halo, ${userName}`} subtitle="Semoga hari ini penuh berkah!"/><BalanceCard eyebrow="Total saldo keluarga" value={formatRupiah(balance)} income={formatRupiah(income)} expense={formatRupiah(expense)} incomeLabel={<><ArrowDownLeft size={12}/> Pemasukan bulan ini</>} expenseLabel={<><ArrowUpRight size={12}/> Pengeluaran bulan ini</>}/><div className="quick-grid"><Link href="/transaksi?add=1" className="quick-action"><span className="quick-icon"><Plus/></span><span>Catatan<br/>Keuangan</span></Link><Link href="/anggaran" className="quick-action"><span className="quick-icon orange"><CircleDollarSign/></span><span>Atur<br/>Anggaran</span></Link><Link href="/target" className="quick-action"><span className="quick-icon blue"><Target/></span><span>Target<br/>Tabungan</span></Link><Link href="/laporan" className="quick-action"><span className="quick-icon pink"><Landmark/></span><span>Laporan</span></Link></div><div className="page-grid"><div><div className="section-title"><h2>Transaksi terakhir</h2><Link href="/transaksi">Lihat semua</Link></div><div className="card transaction-list">{recentTx?.length?recentTx.map((tx:any)=><TransactionRow key={tx.id} tx={tx}/>):<div className="empty"><ShoppingBag size={28}/><strong>Belum ada transaksi</strong>Mulai catat keuangan keluarga hari ini.</div>}</div></div><div className="card side-panel"><h3>Ringkasan bulan ini</h3><div className="mini-stat"><span>Pemasukan</span><b className="income">{formatRupiah(income)}</b></div><div className="mini-stat"><span>Pengeluaran</span><b className="expense">{formatRupiah(expense)}</b></div><div className="mini-stat"><span>Arus kas</span><b>{formatRupiah(income-expense)}</b></div><Link href="/laporan" className="button button-secondary" style={{display:"block",textAlign:"center",marginTop:14}}>Detail laporan</Link></div></div></>;
}
function TransactionRow({tx}:{tx:any}) { const cat=Array.isArray(tx.category)?tx.category[0]:tx.category; const account=Array.isArray(tx.account)?tx.account[0]:tx.account; return <div className="transaction-row"><span className="category-icon" style={{background:cat?.color||(tx.type==="income"?"#008d51":"#ef5550")}}>{iconEmoji[cat?.icon]||"•"}</span><div className="tx-main"><strong>{tx.description}</strong><span>{cat?.name||"Lainnya"} · {account?.name||"Kas utama"} · {formatDate(tx.transaction_date)}</span></div><span className={`tx-value ${tx.type}`}>{tx.type==="income"?"+":"−"}{formatRupiah(Number(tx.amount))}</span></div> }
function Onboarding({error}:{error?:string}) {
  return (
    <div style={{ maxWidth: 520, margin: "50px auto", padding: "0 16px" }}>
      <div className="card" style={{ padding: 28, textAlign: "center", marginBottom: 20 }}>
        <span className="quick-icon" style={{ marginBottom: 16 }}><Landmark/></span>
        <h1>Mulai keluarga Anda</h1>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>
          Pilih salah satu cara untuk masuk ke ruang keuangan keluarga.
        </p>
        {error && <div className="notice error" style={{ marginBottom: 16 }}>{error}</div>}

        <div style={{ display: "grid", gap: 24, textAlign: "left" }}>
          {/* Option 1: Create */}
          <div style={{ padding: 20, border: "1px solid var(--border)", borderRadius: 12, background: "var(--card-bg, #fff)" }}>
            <h3 style={{ fontSize: 16, marginBottom: 6 }}>🏠 Buat keluarga baru</h3>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 14 }}>
              Untuk kepala keluarga atau yang pertama kali membuat ruang keuangan.
            </p>
            <form action="/api/household/create" method="POST" className="form-grid">
              <div className="field form-full">
                <label>Nama keluarga</label>
                <input className="input" name="name" placeholder="Contoh: Keluarga Wijaya" required/>
              </div>
              <div className="form-full">
                <button className="button button-primary" style={{ width: "100%" }}>Buat keluarga</button>
              </div>
            </form>
          </div>

          <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, fontWeight: 500 }}>
            ── ATAU ──
          </div>

          {/* Option 2: Join */}
          <div style={{ padding: 20, border: "1px solid var(--border)", borderRadius: 12, background: "var(--card-bg, #fff)" }}>
            <h3 style={{ fontSize: 16, marginBottom: 6 }}>👨‍👩‍👧 Gabung ke keluarga</h3>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 14 }}>
              Untuk pasangan / anggota keluarga. Masukkan nomor WhatsApp pemilik (suami/istri) yang sudah terdaftar.
            </p>
            <form action="/api/family/join" method="POST" className="form-grid">
              <div className="field form-full">
                <label>Nomor WhatsApp Pemilik</label>
                <input className="input" name="phone" placeholder="08123456789" required/>
              </div>
              <div className="form-full">
                <button className="button button-secondary" style={{ width: "100%" }}>Gabung keluarga</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
