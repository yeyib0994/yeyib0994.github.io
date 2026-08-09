import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/", label: "文章" },
  { href: "/tags", label: "标签" },
  { href: "/about", label: "关于" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-5">
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="mr-4 text-base font-semibold tracking-tight text-fg"
          >
            朝花夕拾
          </Link>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
