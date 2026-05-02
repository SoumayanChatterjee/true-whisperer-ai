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
    <nav className="sticky top-0 z-40 border-b border-border bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-ink text-cream">
            <ScanSearch className="h-4 w-4" />
          </div>
          <span className="font-display text-xl font-black tracking-tight text-ink">
            Veritas
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
                    "rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors",
                    isActive
                      ? "bg-ink text-cream"
                      : "text-muted-foreground hover:bg-secondary hover:text-ink",
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
