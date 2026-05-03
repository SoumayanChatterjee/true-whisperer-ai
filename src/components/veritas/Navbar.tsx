import { NavLink } from "react-router-dom";
import { ScanSearch } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Analyze" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/explore", label: "Explore" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-paper/70 backdrop-blur-xl">
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-crimson-glow/60 to-transparent" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <NavLink to="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-md bg-ink text-cream shine overflow-hidden">
            <ScanSearch className="h-4 w-4 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-crimson/40 via-transparent to-crimson-glow/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-display text-xl font-black tracking-tight text-ink">
            Verit<span className="text-gradient">as</span>
          </span>
          <span className="pulse-dot ml-1" aria-hidden />
        </NavLink>
        <ul className="flex items-center gap-1 md:gap-2">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "relative rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-300",
                    isActive
                      ? "bg-ink text-cream shadow-[0_8px_24px_-12px_hsl(var(--crimson)/0.7)]"
                      : "text-muted-foreground hover:text-ink hover:-translate-y-0.5",
                  )
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
