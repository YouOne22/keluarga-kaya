"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AppHeader } from "@/components/app/navigation";
import { Button, Card, Input, Modal, Select } from "@/components/ui";
import { amountValue, formatInput, formatRupiah, type Bill, type BillPayment } from "@/lib/financial";
import { CalendarClock, Check, Plus, Trash2 } from "lucide-react";

function currentMonth() { return new Date().toISOString().slice(0, 7); }

export default function TagihanPage() {
  const s = createClient();
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<BillPayment[]>([]);
  const [familyId, setFamilyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [payBill, setPayBill] = useState<Bill | null>(null);

  async function load() {
    const { data: m } = await s.from("family_members").select("family_id").limit(1).maybeSingle();
    if (!m) { setLoading(false); return; }
    setFamilyId(m.family_id);
    const { data: b } = await s.from("bills").select("*").eq("family_id", m.family_id).order("due_day");
    setBills((b || []) as Bill[]);
    const month = currentMonth();
    const { data: p } = await s.from("bill_payments").select("*").eq("family_id", m.family_id).eq("month", month);
    setPayments((p || []) as BillPayment[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  const paidBillIds = new Set(payments.map(p => p.bill_id));
  const activeBills = bills.filter(b => b.is_active);
  const unpaidBills = activeBills.filter(b => !paidBillIds.has(b.id));
  const paidBills = activeBills.filter(b => paidBillIds.has(b.id));
  const totalDue = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

  return (<>
    <AppHeader title="Tagihan Bulanan" subtitle="Kelola tagihan rutin keluarga" action={<Button onClick={() => setOpenAdd(true)}><Plus size={16}/> Tambah</Button>} />
    {loading ? <div className="skeleton-page"><div className="skeleton-card"><div className="skeleton-line" style={{ width: 160, height: 14 }} /></div></div> : activeBills.length === 0 ? (
      <div className="card" style={{ padding: 32 }}><span className="quick-icon" style={{ background: "#eef6ff", color: "#2886e8" }}><CalendarClock /></span><h2>Belum ada tagihan</h2><p>Tambahkan tagihan rutin seperti Wifi, Listrik, Air, dll.</p><Button onClick={() => setOpenAdd(true)}><Plus size={16}/> Tambah Tagihan</Button></div>
    ) : (<>
      {totalDue > 0 && <Card className="card" style={{ background: "linear-gradient(135deg, #fff3e6, #fff8f0)", borderLeft: "4px solid #f59a27", marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 12, color: "var(--muted)" }}>Belum dibayar ({unpaidBills.length})</p>
        <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 800, color: "#f59a27" }}>{formatRupiah(totalDue)}</p>
      </Card>}
      {unpaidBills.length > 0 && <><div className="section-title" style={{ marginTop: 4 }}><h2>Belum dibayar</h2></div><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{unpaidBills.map(b => <BillRow key={b.id} bill={b} paid={false} onPay={() => setPayBill(b)} onRemove={async () => { if (!confirm("Hapus?")) return; await s.from("bills").delete().eq("id", b.id); load(); }} />)}</div></>}
      {paidBills.length > 0 && <><div className="section-title" style={{ marginTop: 20 }}><h2>Sudah dibayar</h2></div><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{paidBills.map(b => <BillRow key={b.id} bill={b} paid={true} onRemove={async () => { if (!confirm("Hapus?")) return; await s.from("bills").delete().eq("id", b.id); load(); }} />)}</div></>}
    </>)}
    <AddBillModal open={openAdd} close={() => setOpenAdd(false)} done={() => { setOpenAdd(false); load(); }} s={s} familyId={familyId} />
    {payBill && <PayModal open bill={payBill} close={() => setPayBill(null)} done={() => { setPayBill(null); load(); }} s={s} familyId={familyId} />}
  </>);
}

function BillRow({ bill, paid, onPay, onRemove }: { bill: Bill; paid: boolean; onPay?: () => void; onRemove?: () => void }) {
  return <Card className="card" style={{ opacity: paid ? 0.6 : 1 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {paid && <span style={{ background: "var(--green)", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}><Check size={12} style={{ verticalAlign: "middle" }} /> Lunas</span>}
          <h3 style={{ margin: 0, fontSize: 15 }}>{bill.name}</h3>
        </div>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)" }}>Jatuh tempo: tanggal {bill.due_day}{bill.notes ? ` · ${bill.notes}` : ""}</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{formatRupiah(bill.amount)}</p>
        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", marginTop: 4 }}>
          {!paid && onPay && <Button variant="secondary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={onPay}>Bayar</Button>}
          <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  </Card>;
}

function AddBillModal({ open, close, done, s, familyId }: { open: boolean; close: () => void; done: () => void; s: any; familyId: string }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("1");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const { data: { user } } = await s.auth.getUser();
    const { error: e2 } = await s.from("bills").insert({ family_id: familyId, name: name.trim(), amount: amountValue(amount), due_day: Number(dueDay), notes: notes.trim(), is_active: true, created_by: user?.id });
    if (e2) setError(e2.message); else done();
    setSaving(false);
  }
  return <Modal open={open} title="Tambah tagihan bulanan" onClose={close}>
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="field form-full"><label>Nama tagihan</label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Wifi, Listrik, Air" required /></div>
        <div className="field"><label>Nominal</label><Input inputMode="numeric" value={amount} onChange={e => setAmount(formatInput(e.target.value))} placeholder="Rp 350.000" required /></div>
        <div className="field"><label>Tgl jatuh tempo</label><Select value={dueDay} onChange={e => setDueDay(e.target.value)}>{Array.from({ length: 28 }, (_, i) => i + 1).map(d => <option key={d} value={d}>Tgl {d}</option>)}</Select></div>
        <div className="field form-full"><label>Catatan</label><Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Opsional" /></div>
      </div>
      {error && <div className="notice error" style={{ marginTop: 12 }}>{error}</div>}
      <div className="form-actions"><Button type="button" variant="secondary" onClick={close}>Batal</Button><Button disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button></div>
    </form>
  </Modal>;
}

function PayModal({ open, bill, close, done, s, familyId }: { open: boolean; bill: Bill; close: () => void; done: () => void; s: any; familyId: string }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit() {
    setSaving(true); setError("");
    const { data: { user } } = await s.auth.getUser();
    const { error: e2 } = await s.from("bill_payments").insert({ bill_id: bill.id, family_id: familyId, month: currentMonth(), amount: bill.amount, created_by: user?.id });
    if (e2) setError(e2.message); else done();
    setSaving(false);
  }
  return <Modal open={open} title={`Bayar: ${bill.name}`} onClose={close}>
    <div style={{ padding: "12px 14px", background: "#f7faf8", borderRadius: 12, fontSize: 13, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>Nominal</span><strong>{formatRupiah(bill.amount)}</strong></div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}><span style={{ color: "var(--muted)" }}>Periode</span><strong>{new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</strong></div>
    </div>
    {error && <div className="notice error" style={{ marginBottom: 12 }}>{error}</div>}
    <div className="form-actions"><Button variant="secondary" onClick={close}>Batal</Button><Button onClick={submit} disabled={saving}>{saving ? "Memproses..." : "Bayar Sekarang"}</Button></div>
  </Modal>;
}