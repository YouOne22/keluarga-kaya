"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AppHeader } from "@/components/app/navigation";
import { Button, Card, Input, Modal } from "@/components/ui";
import { amountValue, formatInput, formatRupiah, type Debt } from "@/lib/financial";
import { HandCoins, Plus, Trash2 } from "lucide-react";

export default function HutangPage() {
  const s = createClient();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [familyId, setFamilyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [tab, setTab] = useState<"debt" | "receivable">("debt");
  const [payDebt, setPayDebt] = useState<Debt | null>(null);

  async function load() {
    const { data: m } = await s.from("family_members").select("family_id").limit(1).maybeSingle();
    if (!m) { setLoading(false); return; }
    setFamilyId(m.family_id);
    const { data } = await s.from("debts").select("*").eq("family_id", m.family_id).order("created_at", { ascending: false });
    setDebts((data || []) as Debt[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  const filtered = debts.filter(d => d.type === tab);
  const active = filtered.filter(d => d.status === "unpaid");
  const done = filtered.filter(d => d.status === "paid");
  const totalActive = active.reduce((sum, d) => sum + (d.amount - d.paid_amount), 0);

  return (<>
    <AppHeader title="Hutang & Piutang" subtitle="Catat pinjaman keluarga" action={<Button onClick={() => setOpenAdd(true)}><Plus size={16}/> Tambah</Button>} />
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <Button variant={tab === "debt" ? "primary" : "secondary"} onClick={() => setTab("debt")}>Hutang</Button>
      <Button variant={tab === "receivable" ? "primary" : "secondary"} onClick={() => setTab("receivable")}>Piutang</Button>
    </div>
    {loading ? <div className="skeleton-page"><div className="skeleton-card"><div className="skeleton-line" style={{ width: 160, height: 14 }} /></div></div> : filtered.length === 0 ? (
      <div className="card" style={{ padding: 32 }}><span className="quick-icon" style={{ background: "#fff0e8", color: "#f59a27" }}><HandCoins /></span><h2>Belum ada {tab === "debt" ? "hutang" : "piutang"}</h2><p>{tab === "debt" ? "Catat hutang yang harus dibayar." : "Catat pinjaman dari orang lain."}</p><Button onClick={() => setOpenAdd(true)}><Plus size={16}/> Tambah</Button></div>
    ) : (<>
      {totalActive > 0 && <Card className="card" style={{ background: "linear-gradient(135deg, #fff3e6, #fff8f0)", borderLeft: `4px solid ${tab === "debt" ? "#ef5550" : "#008d51"}`, marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 12, color: "var(--muted)" }}>Sisa {tab === "debt" ? "hutang" : "piutang"}</p>
        <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 800, color: tab === "debt" ? "#ef5550" : "#008d51" }}>{formatRupiah(totalActive)}</p>
      </Card>}
      {active.length > 0 && <><div className="section-title" style={{ marginTop: 4 }}><h2>Belum lunas</h2></div><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{active.map(d => <DebtRow key={d.id} debt={d} onPay={tab === "receivable" ? undefined : () => setPayDebt(d)} onRemove={async () => { if (!confirm("Hapus?")) return; await s.from("debts").delete().eq("id", d.id); load(); }} />)}</div></>}
      {done.length > 0 && <><div className="section-title" style={{ marginTop: 20 }}><h2>Sudah lunas</h2></div><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{done.map(d => <DebtRow key={d.id} debt={d} onRemove={async () => { if (!confirm("Hapus?")) return; await s.from("debts").delete().eq("id", d.id); load(); }} />)}</div></>}
    </>)}
    <AddModal open={openAdd} close={() => setOpenAdd(false)} done={() => { setOpenAdd(false); load(); }} s={s} familyId={familyId} defaultType={tab} />
    {payDebt && <PayModal open debt={payDebt} close={() => setPayDebt(null)} done={() => { setPayDebt(null); load(); }} s={s} familyId={familyId} />}
  </>);
}

function DebtRow({ debt, onPay, onRemove }: { debt: Debt; onPay?: () => void; onRemove?: () => void }) {
  const completed = debt.status === "paid";
  const pct = debt.amount > 0 ? Math.round((debt.paid_amount / debt.amount) * 100) : 0;
  const remaining = Math.max(debt.amount - debt.paid_amount, 0);
  const daysLeft = debt.due_date ? Math.ceil((new Date(debt.due_date).getTime() - Date.now()) / 86400000) : null;
  return <Card className="card" style={{ opacity: completed ? 0.6 : 1 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {completed && <span style={{ background: "var(--green)", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>Lunas</span>}
          <h3 style={{ margin: 0, fontSize: 15 }}>{debt.person_name}</h3>
        </div>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)" }}>
          Total {formatRupiah(debt.amount)}{debt.due_date ? ` · Jatuh tempo ${new Date(debt.due_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}` : ""}{debt.notes ? " · " + debt.notes : ""}
        </p>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {!completed && onPay && <Button variant="secondary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={onPay}>Bayar</Button>}
        <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}><Trash2 size={14} /></button>
      </div>
    </div>
    {!completed && <>
      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: "var(--muted)" }}>{formatRupiah(debt.paid_amount)} / {formatRupiah(debt.amount)}</span>
          <span style={{ fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ background: "#eee", borderRadius: 8, height: 6, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "#f59a27", borderRadius: 8 }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 13 }}>
        <span style={{ color: "var(--muted)" }}>Sisa</span>
        <span style={{ fontWeight: 700 }}>{formatRupiah(remaining)}</span>
      </div>
    </>}
    {daysLeft !== null && daysLeft < 0 && !completed && <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--red)" }}>Terlambat {Math.abs(daysLeft)} hari</p>}
  </Card>;
}

function AddModal({ open, close, done, s, familyId, defaultType }: { open: boolean; close: () => void; done: () => void; s: any; familyId: string; defaultType: string }) {
  const [person, setPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const { data: { user } } = await s.auth.getUser();
    const { error: e2 } = await s.from("debts").insert({ family_id: familyId, type: defaultType, person_name: person.trim(), amount: amountValue(amount), paid_amount: 0, due_date: dueDate || null, notes: notes.trim(), status: "unpaid", created_by: user?.id });
    if (e2) setError(e2.message); else done();
    setSaving(false);
  }
  return <Modal open={open} title={`Tambah ${defaultType === "debt" ? "hutang" : "piutang"}`} onClose={close}>
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="field form-full"><label>{defaultType === "debt" ? "Piutang ke" : "Hutang dari"}</label><Input value={person} onChange={e => setPerson(e.target.value)} placeholder="Nama orang" required /></div>
        <div className="field"><label>Nominal</label><Input inputMode="numeric" value={amount} onChange={e => setAmount(formatInput(e.target.value))} placeholder="Rp 500.000" required /></div>
        <div className="field"><label>Jatuh tempo</label><Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
        <div className="field form-full"><label>Catatan</label><Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Opsional" /></div>
      </div>
      {error && <div className="notice error" style={{ marginTop: 12 }}>{error}</div>}
      <div className="form-actions"><Button type="button" variant="secondary" onClick={close}>Batal</Button><Button disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button></div>
    </form>
  </Modal>;
}

function PayModal({ open, debt, close, done, s, familyId }: { open: boolean; debt: Debt; close: () => void; done: () => void; s: any; familyId: string }) {
  const remaining = Math.max(debt.amount - debt.paid_amount, 0);
  const [payAmount, setPayAmount] = useState(formatInput(String(remaining)));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit() {
    setSaving(true); setError("");
    const val = amountValue(payAmount);
    if (val <= 0) { setError("Nominal harus lebih dari 0"); setSaving(false); return; }
    const { data: { user } } = await s.auth.getUser();
    const { error: e2 } = await s.from("debt_payments").insert({ debt_id: debt.id, family_id: familyId, amount: val, created_by: user?.id });
    if (e2) setError(e2.message); else done();
    setSaving(false);
  }
  return <Modal open={open} title={`Bayar: ${debt.person_name}`} onClose={close}>
    <div style={{ padding: "12px 14px", background: "#f7faf8", borderRadius: 12, fontSize: 13, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>Sisa</span><strong>{formatRupiah(remaining)}</strong></div>
    </div>
    <div className="field"><label>Nominal bayar</label><Input inputMode="numeric" value={payAmount} onChange={e => setPayAmount(formatInput(e.target.value))} /></div>
    {error && <div className="notice error" style={{ marginTop: 12 }}>{error}</div>}
    <div className="form-actions"><Button variant="secondary" onClick={close}>Batal</Button><Button onClick={submit} disabled={saving}>{saving ? "Memproses..." : "Bayar"}</Button></div>
  </Modal>;
}

