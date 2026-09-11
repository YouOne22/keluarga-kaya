import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
const font = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", weight: ["400","500","600","700","800"] });
export const metadata: Metadata = { title: "Keluarga Kaya", description: "Kelola keuangan keluarga bersama" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#008d51" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="id" className={font.variable}><body className={font.className}>{children}</body></html>; }