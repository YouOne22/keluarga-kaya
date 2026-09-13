"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CircleDollarSign, FileText, House, Landmark, ReceiptText, Settings, Tag, Target, Users, CalendarClock, CreditCard, HandCoins } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Beranda", icon: House },
  { href: "/transaksi", label: "Transaksi", icon: ReceiptText },
  { href: "/anggaran", label: "Anggaran", icon: CircleDollarSign },
  { href: "/target", label: "Target", icon: Target },
  { href: "/profil", label: "Profil", icon: Settings },
];

const moreLinks = [
  { href: "/tagihan", label: "Tagihan", icon: CalendarClock },
  { href: "/cicilan", label: "Cicilan", icon: CreditCard },
  { href: "/hutang", label: "Hutang & Piutang", icon: HandCoins },
  { href: "/rekening", label: "Rekening", icon: Landmark },
  { href: "/laporan", label: "Laporan", icon: FileText },
  { href: "/anggota", label: "Anggota keluarga", icon: Users },
  { href: "/kategori", label: "Kategori", icon: Tag },
  { href: "/notifikasi", label: "Notifikasi", icon: Bell },
];

function NavItem({ item, compact = false }: { item: typeof links[number]; compact?: boolean }) {
  const path = usePathname();
  const Icon = item.icon;
  const active = path === item.href || (item.href !== "/dashboard" && path.startsWith(item.href));
  return <Link href={item.href} className={`nav-item ${active ? "active" : ""} ${compact ? "nav-compact" : ""}`}><Icon size={compact ? 20 : 19} strokeWidth={active ? 2.7 : 2}/><span>{item.label}</span></Link>;
}

export function Sidebar({ familyName }: { familyName: string }) {
  return <aside className="sidebar">
    <Link href="/dashboard" className="brand"><img src="/images/logo.png" alt=""/><span>Keluarga <b>Kaya</b></span></Link>
    <div className="family-chip"><span className="family-dot"/><div><small>KELUARGA AKTIF</small><strong>{familyName}</strong></div></div>
    <nav>{links.map(item => <NavItem item={item} key={item.href}/>)}</nav>
    <div className="sidebar-more">{moreLinks.map(item => <NavItem item={item} key={item.href}/>)}</div>
  </aside>;
}

export function BottomNav() { return <nav className="bottom-nav">{links.map(item => <NavItem item={item} compact key={item.href}/>)}</nav>; }

export function AppHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <header className="app-header"><Link href="/dashboard" className="mobile-app-brand"><img src="/images/logo.png" alt=""/><span>Keluarga <b>Kaya</b></span></Link><div className="app-heading"><p>{subtitle}</p><h1>{title}</h1></div><div className="header-action">{action}<Link href="/notifikasi" className="icon-button" aria-label="Notifikasi"><Bell size={19}/><i /></Link></div></header>;
}
