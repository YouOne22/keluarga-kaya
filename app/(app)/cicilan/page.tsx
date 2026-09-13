"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AppHeader } from "@/components/app/navigation";
import { Button, Card, Input, Modal } from "@/components/ui";
import { amountValue, formatInput, formatRupiah, type Installment } from "@/lib/financial";
import { CreditCard, Plus, Trash2 } from "lucide-react";

export default function CicilanPage() {
  const s = createClient();
  const [items, setItems] = useState<Installment[]>([]);
  const [familyId, setFamilyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [payInst, setPayInst] = useState<Installment | null>(null);

  async function load() {
    const { data: m } = await s.from("family_members").select("family_id").limit(1).maybeSingle();
    if (!m) { setLoading(false); return; }
    setFamilyId(m.family_id);
    const { data } = await s.from("installments").select("*").eq("family_id", m.family_id).order("created_at", { ascending: false });
    setItems((data || []) as Installment[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  const active = items.filter(i => i.status === "active");
  const done = items.filter(i => i.status !== "active");

  return (<>
    <AppHeader title="Cicilan & Angsuran" subtitle="Pantau cicilan keluarga" action={<Button onClick={() => setOpenAdd(true)}><Plus size={16}/> Tambah</Button>} />
    {loading ? <div className="skeleton-page"><div className="skeleton-card"><div className="skeleton-line" style={{ width: 160, height: 14 }} /></div></div> : active.length === 0 && done.length === 0 ? (
      <div className="card" style={{ padding: 32 }}><span className="quick-icon" style={{ background: "#f0e8ff", color: "#8a5bd7" }}><CreditCard /></span><h2>Belum ada cicilan</h2><p>Catat cicilan motor, KPR, atau pinjaman lainnya.</p><Button onClick={() => setOpenAdd(true)}><Plus size={16}/> Tambah Cicilan</Button></div>
    ) : (<>
      {active.length > 0 && <><div className="section-title" style={{ marginTop: 4 }}><h2>Aktif</h2><span style={{ color: "var(--muted)", fontSize: 12 }}>{active.length}</span></div><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{active.map(inst => <InstCard key={inst.id} inst={inst} onPay={() => setPayInst(inst)} onRemove={async () => { if (!confirm("Hapus?")) return; await s.from("installments").delete().eq("id", inst.id); load(); }} />)}</div></>}
      {done.length > 0 && <><div className="section-title" style={{ marginTop: 28 }}><h2>Riwayat</h2></div><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{done.map(inst => <InstCard key={inst.id} inst={inst} onRemove={async () => { if (!confirm("Hapus?")) return; await s.from("installments").delete().eq("id", inst.id); load(); }} />)}</div></>}
    </>)}
    <AddModal open={openAdd} close={() => setOpenAdd(false)} done={() => { setOpenAdd(false); load(); }} s={s} familyId={familyId} />
    {payInst && <PayModal open inst={payInst} close={() => setPayInst(null)} done={() => { setPayInst(null); load(); }} s={s} familyId={familyId} />}
  </>);
}

function InstCard({ inst, onPay, onRemove }: { inst: Installment; onPay?: () => void; onRemove?: () => void }) {
  const completed = inst.status === "completed";
  const pct = inst.tenor_total > 0 ? Math.round((inst.tenor_paid / inst.tenor_total) * 100) : 0;
  const remaining = Math.max(inst.total_amount - inst.tenor_paid * inst.monthly_amount, 0);
  return <Card className="card">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {completed && <span style={{ background: "var(--green)", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>Lunas</span>}
          <h3 style={{ margin: 0, fontSize: 15 }}>{inst.name}</h3>
        </div>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)" }}>{formatRupiah(inst.monthly_amount)}/bln · Mulai {new Date(inst.start_date).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}</p>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {!completed && onPay && <Button variant="secondary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={onPay}>Bayar</Button>}
        <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}><Trash2 size={14} /></button>
      </div>
    </div>
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
        <span style={{ color: completed ? "var(--green)" : "var(--muted)" }}>{completed ? "Selesai" : `${inst.tenor_paid}/${inst.tenor_total} bln`}</span>
        <span style={{ fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ background: "#eee", borderRadius: 8, height: 6, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: completed ? "var(--green)" : "#8a5bd7", borderRadius: 8 }} />
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 13 }}>
      <span style={{ color: "var(--muted)" }}>Sisa pokok</span>
      <span style={{ fontWeight: 700 }}>{formatRupiah(remaining)}</span>
    </div>
  </Card>;
}

function AddModal({ open, close, done, s, familyId }: { open: boolean; close: () => void; done: () => void; s: any; familyId: string }) {
  const [name, setName] = useState("");
  const [total, setTotal] = useState("");
  const [monthly, setMonthly] = useState("");
  const [tenor, setTenor] = useState("12");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const { data: { user } } = await s.auth.getUser();
    const { error: e2 } = await s.from("installments").insert({ family_id: familyId, name: name.trim(), total_amount: amountValue(total), monthly_amount: amountValue(monthly), tenor_total: Number(tenor), tenor_paid: 0, start_date: startDate, notes: notes.trim(), status: "active", created_by: user?.id });
    if (e2) setError(e2.message); else done();
    setSaving(false);
  }
  return <Modal open={open} title="Tambah cicilan" onClose={close}>
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="field form-full"><label>Nama cicilan</label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Motor, KPR, Laptop" required /></div>
        <div className="field"><label>Total pokok</label><Input inputMode="numeric" value={total} onChange={e => setTotal(formatInput(e.target.value))} placeholder="Rp 20.000.000" required /></div>
        <div className="field"><label>Cicilan/bulan</label><Input inputMode="numeric" value={monthly} onChange={e => setMonthly(formatInput(e.target.value))} placeholder="Rp 1.500.000" required /></div>
        <div className="field"><label>Tenor (bulan)</label><Input inputMode="numeric" value={tenor} onChange={e => setTenor(e.target.value)} min="1" required /></div>
        <div className="field"><label>Mulai</label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required /></div>
        <div className="field form-full"><label>Catatan</label><Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Opsional" /></div>
      </div>
      {error && <div className="notice error" style={{ marginTop: 12 }}>{error}</div>}
      <div className="form-actions"><Button type="button" variant="secondary" onClick={close}>Batal</Button><Button disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button></div>
    </form>
  </Modal>;
}

function PayModal({ open, inst, close, done, s, familyId }: { open: boolean; inst: Installment; close: () => void; done: () => void; s: any; familyId: string }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const next = inst.tenor_paid + 1;
  async function submit() {
    setSaving(true); setError("");
    const { data: { user } } = await s.auth.getUser();
    const { error: e2 } = await s.from("installment_payments").insert({ installment_id: inst.id, family_id: familyId, tenor_number: next, amount: inst.monthly_amount, created_by: user?.id });
    if (e2) setError(e2.message); else done();
    setSaving(false);
  }
  return <Modal open={open} title={`Bayar: ${inst.name}`} onClose={close}>
    <div style={{ padding: "12px 14px", background: "#f7faf8", borderRadius: 12, fontSize: 13, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>Cicilan ke</span><strong>{next} / {inst.tenor_total}</strong></div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}><span style={{ color: "var(--muted)" }}>Nominal</span><strong>{formatRupiah(inst.monthly_amount)}</strong></div>
    </div>
    {error && <div className="notice error" style={{ marginBottom: 12 }}>{error}</div>}
    <div className="form-actions"><Button variant="secondary" onClick={close}>Batal</Button><Button onClick={submit} disabled={saving}>{saving ? "Memproses..." : "Bayar"}</Button></div>
  </Modal>;
}
