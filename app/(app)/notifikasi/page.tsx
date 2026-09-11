"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AppHeader } from "@/components/app/navigation";
import { Card } from "@/components/ui";
import { Bell } from "lucide-react";

type Notif = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

export default function NotifikasiPage() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadNotifs();
    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        setNotifs(prev => [payload.new as Notif, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function loadNotifs() {
    const { data } = await supabase
      .from("notifications")
      .select("id, title, body, read, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    setNotifs((data as Notif[]) || []);
    setLoading(false);
  }

  async function markRead(id: string) {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <>
      <AppHeader title="Notifikasi" subtitle="Aktivitas keluarga" />
      {loading ? (
        <div className="card" style={{padding:30,textAlign:"center"}}><p style={{color:"var(--muted)"}}>Memuat notifikasi...</p></div>
      ) : notifs.length === 0 ? (
        <div className="card target-empty" style={{padding:30}}>
          <span className="quick-icon"><Bell/></span>
          <h2>Belum ada notifikasi</h2>
          <p>Notifikasi akan muncul saat ada aktivitas di keluarga Anda.</p>
        </div>
      ) : (
        <Card className="transaction-list">
          {notifs.map(n => (
            <button
              key={n.id}
              onClick={() => !n.read && markRead(n.id)}
              className="transaction-row"
              style={{
                width:"100%",textAlign:"left",border:0,cursor:"pointer",
                background: n.read ? "transparent" : "var(--mint)",
                opacity: n.read ? 0.6 : 1,
              }}
            >
              <span className="category-icon" style={{background:n.read?"var(--line)":"var(--green)"}}>
                <Bell size={16}/>
              </span>
              <div className="tx-main">
                <strong>{n.title}</strong>
                <span>{n.body}</span>
              </div>
              <span style={{fontSize:10,color:"var(--muted)",whiteSpace:"nowrap"}}>
                {new Date(n.created_at).toLocaleString("id-ID",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
              </span>
            </button>
          ))}
        </Card>
      )}
    </>
  );
}