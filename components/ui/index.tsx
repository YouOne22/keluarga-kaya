"use client";
import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";
export function Button({ className = "", variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) { return <button className={`button button-${variant} ${className}`} {...props} />; }
export function Card({ className = "", style, children }: { className?: string; style?: React.CSSProperties; children: React.ReactNode }) { return <section className={`card ${className}`} style={style}>{children}</section>; }
export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={`input ${className}`} {...props} />; }
export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) { return <select className={`input ${className}`} {...props}>{children}</select>; }
export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: React.ReactNode; onClose: () => void }) { if (!open) return null; return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal"><div className="modal-heading"><h2>{title}</h2><button onClick={onClose} aria-label="Tutup">×</button></div>{children}</div></div>; }
