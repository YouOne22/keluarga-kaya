"use client";
import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AppHeader } from "@/components/app/navigation";
import { Button, Card, Input } from "@/components/ui";
import { initials } from "@/lib/financial";

type MemberRow = { user_id: string; role: string; joined_at: string };
type ProfileRow = { id: string; full_name: string; phone_number: string | null };

export default function AnggotaPage() {
  const supabase = createClient();
  const [members, setMembers] = useState<(MemberRow & { full_name: string; phone_number: string | null })[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: m } = await supabase
      .from("family_members")
      .select("user_id, role, joined_at")
      .limit(50);

    if (!m) return;

    const myMembership = m.find((x: MemberRow) => x.user_id === user.id);
    setIsOwner(myMembership?.role === "owner");

    const ids = m.map((x: MemberRow) => x.user_id);
    const { data: profiles } = ids.length
      ? await supabase.from("profiles").select("id, full_name, phone_number").in("id", ids)
      : { data: [] };

    const byId = new Map((profiles || []).map((p: ProfileRow) => [p.id, p]));
    const merged = m.map((x: MemberRow) => ({
      ...x,
      full_name: byId.get(x.user_id)?.full_name || "Anggota",
      phone_number: byId.get(x.user_id)?.phone_number || null,
    }));
    setMembers(merged);
  }

  useEffect(() => { load(); }, []);

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const { error } = await supabase.rpc("add_family_member", { p_phone: phone.trim() });
    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Anggota berhasil ditambahkan!");
      setPhone("");
      load();
    }
    setLoading(false);
  }

  return <>
    <AppHeader title="Anggota" subtitle="Orang dalam keluarga" />
    <Card>
      {members.length ? members.map((m) => (
        <div className="member-row" key={m.user_id}>
          <span className="avatar">{initials(m.full_name)}</span>
          <div>
            <strong>{m.full_name}</strong>
            <span>{m.phone_number || "Belum ada nomor"}</span>
          </div>
          <span className="pill">{m.role === "owner" ? "Pemilik" : "Anggota"}</span>
        </div>
      )) : (
        <div className="empty">
          <UserPlus size={28} />
          <strong>Belum ada anggota</strong>
        </div>
      )}
    </Card>
    {isOwner && (
      <Card className="side-panel" style={{ marginTop: 18 }}>
        <h3>Tambah anggota keluarga</h3>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 14 }}>
          Masukkan nomor WhatsApp anggota yang sudah mendaftar di aplikasi.
        </p>
        <form onSubmit={addMember} className="form-grid">
          <div className="field form-full">
            <label>Nomor WhatsApp</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08123456789"
              required
            />
          </div>
          <div className="form-full" style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button type="submit" disabled={loading}>
              {loading ? "Menambahkan..." : "Tambah"}
            </Button>
          </div>
        </form>
        {msg && (
          <div className="notice" style={{
            marginTop: 12,
            color: msg.includes("berhasil") ? "var(--green)" : "#e74c3c",
            fontSize: 13,
          }}>{msg}</div>
        )}
      </Card>
    )}
  </>;
}
