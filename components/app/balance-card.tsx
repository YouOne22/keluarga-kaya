"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const MASK = "•••••••";

export function BalanceCard({
  eyebrow,
  value,
  income,
  expense,
  incomeLabel,
  expenseLabel,
  className = "",
}: {
  eyebrow: string;
  value: string;
  income: string;
  expense: string;
  incomeLabel: React.ReactNode;
  expenseLabel: React.ReactNode;
  className?: string;
}) {
  const [show, setShow] = useState(true);
  const v = show ? value : MASK;
  const inc = show ? income : MASK;
  const exp = show ? expense : MASK;

  return (
    <div className={`balance-card card ${className}`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", position: "relative", zIndex: 2 }}>
        <span className="eyebrow">{eyebrow}</span>
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Sembunyikan saldo" : "Tampilkan saldo"}
          style={{
            background: "rgba(255,255,255,.18)",
            border: "none",
            borderRadius: 10,
            width: 34,
            height: 34,
            display: "grid",
            placeItems: "center",
            color: "#fff",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {show ? <Eye size={17} /> : <EyeOff size={17} />}
        </button>
      </div>
      <div className="balance-value">{v}</div>
      <div className="balance-split">
        <div className="balance-income">
          <small>{incomeLabel}</small>
          <strong>{inc}</strong>
        </div>
        <div className="balance-expense">
          <small>{expenseLabel}</small>
          <strong>{exp}</strong>
        </div>
      </div>
    </div>
  );
}
