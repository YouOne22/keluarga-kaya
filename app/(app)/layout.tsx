import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar, BottomNav } from "@/components/app/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: member } = await supabase.from("family_members").select("family_id, families(name)").eq("user_id", user.id).limit(1).maybeSingle();
  const family = member?.families as unknown as { name?: string } | { name?: string }[] | null;
  const familyName = Array.isArray(family) ? family[0]?.name : family?.name;
  return <div className="app-shell"><Sidebar familyName={familyName || "Keluarga baru"}/><main className="app-content">{children}</main><BottomNav/></div>;
}