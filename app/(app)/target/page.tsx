"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AppHeader } from "@/components/app/navigation";
import { Button, Card, Input, Modal, Select } from "@/components/ui";
import { amountValue, formatInput, formatRupiah, goalCategories, goalColors, today, type SavingGoal } from "@/lib/financial";
import { ArrowDownLeft, Calendar, Plus, Target, Trash2 } from "lucide-react";

const goalIcons: Record<string, string> = { Pendidikan: "🎓", Rumah: "🏠", Kendaraan: "🏍", Liburan: "✈", Pernikahan: "💍", "Dana Darurat": "🛡", "Modal Usaha": "💼", Lainnya: "🎯" };

function daysLeft(deadline: string | null) { if (!deadline) return null; return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000); }

export default function TargetPage() {
  const s = createClient();
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [familyId, setFamilyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [depositGoal, setDepositGoal] = useState<SavingGoal | null>(null);
  async function load() {
    const { data: m } = await s.from("family_members").select("family_id").limit(1).maybeSingle();
    if (!m) { setLoading(false); return; }
    setFamilyId(m.family_id);
    const { data } = await s.from("saving_goals").select("*").eq("family_id", m.family_id).order("created_at", { ascending: false });
    setGoals((data || []) as SavingGoal[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  const active = goals.filter(g => g.status === "active");
  const done = goals.filter(g => g.status !== "active");
  return <>
    <AppHeader title="Target Tabungan" subtitle="Impian besar dimulai bersama" action={<Button onClick={() => setOpenAdd(true)}><Plus size={16}/> Tambah Target</Button>} />
    {loading ? <div className="skeleton-page"><div className="skeleton-card"><div className="skeleton-line" style={{ width: 160, height: 14 }} /><div className="skeleton-line skeleton-row" /><div className="skeleton-line skeleton-row" /></div></div> : active.length === 0 && done.length === 0 ? (
      <div className="card target-empty" style={{ padding: 32 }}><span className="quick-icon pink"><Target /></span><h2>Belum ada target tabungan</h2><p>Buat target pertama untuk mulai merencanakan masa depan keluarga.</p><Button onClick={() => setOpenAdd(true)}><Plus size={16}/> Buat Target Pertama</Button></div>
    ) : (<>
      {active.length > 0 && <><div className="section-title" style={{ marginTop: 4 }}><h2>Target aktif</h2><span style={{ color: "var(--muted)", fontSize: 12 }}>{active.length} target</span></div><div className="goal-grid">{active.map(g => <GoalCard key={g.id} goal={g} onDeposit={() => setDepositGoal(g)} onRemove={async () => { if (!confirm("Hapus target ini?")) return; await s.from("saving_goals").delete().eq("id", g.id); load(); }} />)}</div></>}
      {done.length > 0 && <><div className="section-title" style={{ marginTop: 28 }}><h2>Riwayat</h2><span style={{ color: "var(--muted)", fontSize: 12 }}>{done.length} target</span></div><div className="goal-grid">{done.map(g => <GoalCard key={g.id} goal={g} />)}</div></>}
    </>)}
    <AddGoalModal open={openAdd} close={() => setOpenAdd(false)} done={() => { setOpenAdd(false); load(); }} s={s} familyId={familyId} />
    {depositGoal && <DepositModal open goal={depositGoal} close={() => setDepositGoal(null)} done={() => { setDepositGoal(null); load(); }} s={s} familyId={familyId} />}
  </>;
}

function GoalCard({ goal, onDeposit, onRemove }: { goal: SavingGoal; onDeposit?: () => void; onRemove?: () => void }) {
  const pct = goal.target_amount > 0 ? Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100) : 0;
  const dl = daysLeft(goal.deadline);
  const completed = goal.status === "completed" || pct >= 100;
  const color = goal.color || goalColors[goal.category] || "#008d51";
  return <Card className="goal-card">
    <div className="goal-card-head">
      <span className="goal-icon" style={{ background: color + "18", color }}>{goalIcons[goal.category] || "🎯"}</span>
      <div><strong>{goal.name}</strong><small style={{ color: "var(--muted)", fontSize: 11 }}>{goal.category}</small></div>
      {onRemove && <button className="icon-button" style={{ width: 32, height: 32, marginLeft: "auto" }} onClick={onRemove} aria-label="Hapus"><Trash2 size={14} /></button>}
    </div>
    <div className="goal-progress"><div className="goal-meter"><span style={{ width: `${pct}%`, background: completed ? "var(--green)" : color }} /></div></div>
    <div className="goal-amounts"><span style={{ fontSize: 15, fontWeight: 800 }}>{formatRupiah(goal.current_amount)}</span><span style={{ color: "var(--muted)", fontSize: 12 }}>/ {formatRupiah(goal.target_amount)}</span></div>
    <div className="goal-footer">
      <span style={{ color: completed ? "var(--green)" : "var(--muted)", fontSize: 12, fontWeight: 700 }}>{completed ? "Tercapai" : `${pct}%`}</span>
      {dl !== null && <span style={{ fontSize: 11, color: dl < 0 ? "var(--red)" : "var(--muted)" }}><Calendar size={12} style={{ verticalAlign: "middle", marginRight: 3 }} />{dl < 0 ? `${Math.abs(dl)} hari lewat` : dl === 0 ? "Hari ini" : `${dl} hari lagi`}</span>}
    </div>
    {!completed && onDeposit && <Button variant="secondary" style={{ width: "100%", marginTop: 10 }} onClick={onDeposit}><ArrowDownLeft size={14} /> Setor Dana</Button>}
  </Card>;
}


function AddGoalModal({ open, close, done, s, familyId }: { open: boolean; close: () => void; done: () => void; s: any; familyId: string }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Dana Darurat");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const { data: { user } } = await s.auth.getUser();
    const { error: e2 } = await s.from("saving_goals").insert({ family_id: familyId, name: name.trim(), category, icon: "target", color: goalColors[category] || "#008d51", target_amount: amountValue(target), current_amount: 0, deadline: deadline || null, status: "active", created_by: user?.id });
    if (e2) setError(e2.message); else done();
    setSaving(false);
  }
  return <Modal open={open} title="Tambah target tabungan" onClose={close}>
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="field form-full"><label>Nama target</label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Dana Darurat" required /></div>
        <div className="field"><label>Kategori</label><Select value={category} onChange={e => setCategory(e.target.value)}>{goalCategories.map(c => <option key={c} value={c}>{goalIcons[c]} {c}</option>)}</Select></div>
        <div className="field"><label>Target nominal</label><Input inputMode="numeric" value={target} onChange={e => setTarget(formatInput(e.target.value))} placeholder="Rp 5.000.000" required /></div>
        <div className="field form-full"><label>Batas waktu (opsional)</label><Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} min={today()} /></div>
      </div>
      {error && <div className="notice error" style={{ marginTop: 12 }}>{error}</div>}
      <div className="form-actions"><Button type="button" variant="secondary" onClick={close}>Batal</Button><Button disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button></div>
    </form>
  </Modal>;
}

function DepositModal({ open, goal, close, done, s, familyId }: { open: boolean; goal: SavingGoal; close: () => void; done: () => void; s: any; familyId: string }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const remaining = Math.max(goal.target_amount - goal.current_amount, 0);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const { data: { user } } = await s.auth.getUser();
    const { error: e2 } = await s.from("saving_goal_deposits").insert({ goal_id: goal.id, family_id: familyId, amount: amountValue(amount), note: note.trim() || null, created_by: user?.id });
    if (e2) setError(e2.message); else done();
    setSaving(false);
  }
  return <Modal open={open} title={`Setor ke: ${goal.name}`} onClose={close}>
    <div style={{ marginBottom: 16, padding: "12px 14px", background: "#f7faf8", borderRadius: 12, fontSize: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>Terkumpul</span><strong>{formatRupiah(goal.current_amount)}</strong></div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}><span style={{ color: "var(--muted)" }}>Sisa target</span><strong style={{ color: "var(--green)" }}>{formatRupiah(remaining)}</strong></div>
    </div>
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="field form-full"><label>Nominal setor</label><Input inputMode="numeric" value={amount} onChange={e => setAmount(formatInput(e.target.value))} placeholder="Rp 500.000" required /></div>
        <div className="field form-full"><label>Catatan (opsional)</label><Input value={note} onChange={e => setNote(e.target.value)} placeholder="Tabungan bulan ini" /></div>
      </div>
      {error && <div className="notice error" style={{ marginTop: 12 }}>{error}</div>}
      <div className="form-actions"><Button type="button" variant="secondary" onClick={close}>Batal</Button><Button disabled={saving}>{saving ? "Menyimpan..." : "Setor"}</Button></div>
    </form>
  </Modal>;
}