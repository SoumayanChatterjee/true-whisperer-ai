import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ScanSearch, Menu, X, Radio, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Analyze", code: "01" },
  { to: "/dashboard", label: "Dashboard", code: "02" },
  { to: "/explore", label: "Explore", code: "03" },
  { to: "/trends", label: "Trends", code: "04" },
  { to: "/rewrite-lab", label: "Rewrite", code: "05" },
  { to: "/about", label: "About", code: "06" },
];

function useClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time.toUTCString().split(" ")[4] + " UTC";
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const time = useClock();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40">
      {/* Status strip */}
      <div className="relative hidden border-b border-cream/10 bg-ink text-cream/70 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em]">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              System · Operational
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-cream/50">
              <Radio className="h-3 w-3" /> Signal · Stable
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-cream/50">
              <Activity className="h-3 w-3" /> Threat Level <span className="text-warning">Elevated</span>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-cream/50">CLEARANCE · OPEN-SOURCE</span>
            <span className="tabular-nums text-cream/70">{time}</span>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <nav
        className={cn(
          "relative border-b transition-all duration-300",
          scrolled
            ? "border-border bg-background/80 backdrop-blur-xl shadow-paper"
            : "border-transparent bg-background/50 backdrop-blur-md",
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-glow/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          {/* Brand */}
          <NavLink to="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-sm bg-ink text-cream shadow-glow transition-transform group-hover:rotate-3 group-hover:scale-105">
              <ScanSearch className="h-4 w-4" />
              <span className="absolute -inset-px rounded-sm bg-gradient-to-tr from-crimson-glow/0 via-crimson-glow/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="absolute -bottom-1 -right-1 h-2 w-2 animate-pulse rounded-full bg-crimson-glow shadow-[0_0_8px_hsl(var(--crimson-glow))]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-black tracking-tight text-foreground">
                Verit<span className="text-gradient">as</span>
              </span>
              <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                Intel · Sector 09
              </span>
            </div>
          </NavLink>

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 md:flex">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-1.5 rounded-sm px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-all",
                      isActive
                        ? "bg-ink text-cream shadow-glow"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          "text-[9px] tabular-nums",
                          isActive ? "text-crimson-glow" : "text-muted-foreground/60",
                        )}
                      >
                        {l.code}
                      </span>
                      {l.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute -bottom-px left-2 right-2 h-px bg-crimson-glow"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-card text-foreground transition-colors hover:bg-ink hover:text-cream md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-border bg-background md:hidden"
            >
              <ul className="flex flex-col p-3">
                {links.map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      end={l.to === "/"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-between rounded-sm px-3 py-2.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors",
                          isActive ? "bg-ink text-cream" : "text-foreground hover:bg-secondary",
                        )
                      }
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground">{l.code}</span>
                        {l.label}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-crimson-glow/60" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
