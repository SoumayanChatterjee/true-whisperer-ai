import { NavLink } from "react-router-dom";
import { ScanSearch } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Analyze" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/explore", label: "Explore" },
  { to: "/trends", label: "Trends" },
  { to: "/rewrite-lab", label: "Rewrite" },
  { to: "/how-it-works", label: "How" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-paper/70 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-glow/60 to-transparent" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <NavLink to="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-sm bg-ink text-cream shadow-glow transition-transform group-hover:scale-110 group-hover:rotate-3">
            <ScanSearch className="h-4 w-4" />
            <span className="absolute inset-0 rounded-sm bg-gradient-to-tr from-crimson-glow/0 via-crimson-glow/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <span className="font-display text-xl font-black tracking-tight text-ink">
            Verit<span className="text-gradient">as</span>
          </span>
        </NavLink>
        <ul className="flex items-center gap-1 md:gap-2">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "relative rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-all sweep-link",
                    isActive
                      ? "bg-ink text-cream shadow-glow"
                      : "text-muted-foreground hover:text-ink",
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
