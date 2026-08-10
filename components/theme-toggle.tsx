"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

type ThemeOption = {
  value: string;
  label: string;
  swatch: string; // 预览色（背景/文字组合）
};

const THEMES: ThemeOption[] = [
  { value: "light", label: "光", swatch: "#ffffff" },
  { value: "dark", label: "夜", swatch: "#0a0a0b" },
  { value: "sepia", label: "古卷", swatch: "#f4ecd8" },
  { value: "nord", label: "极地", swatch: "#eceff4" },
  { value: "forest", label: "青松", swatch: "#16211c" },
  { value: "sunset", label: "暮霞", swatch: "#fff4eb" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // 点击外部关闭下拉
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = THEMES.find((t) => t.value === theme) ?? THEMES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="切换主题"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-fg transition-colors hover:bg-card"
      >
        {mounted ? (
          <span
            className="block h-4 w-4 rounded-full border border-border"
            style={{ backgroundColor: current.swatch }}
          />
        ) : (
          <span className="h-4 w-4" />
        )}
      </button>

      {open && (
        <ul className="absolute right-0 top-11 z-20 min-w-[8rem] overflow-hidden rounded-md border border-border bg-bg py-1 shadow-lg">
          {THEMES.map((t) => (
            <li key={t.value}>
              <button
                type="button"
                onClick={() => {
                  setTheme(t.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-sm transition-colors hover:bg-card ${
                  t.value === theme ? "text-fg" : "text-muted"
                }`}
              >
                <span
                  className="block h-3.5 w-3.5 rounded-full border border-border"
                  style={{ backgroundColor: t.swatch }}
                />
                {t.label}
                {t.value === theme && (
                  <span className="ml-auto text-xs text-muted">✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
