import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, Flame, Radio, TrendingUp } from "lucide-react";

type Alert = {
  id: number;
  level: "high" | "med" | "low";
  region: string;
  topic: string;
  delta: string;
  time: string;
};

const SEED: Omit<Alert, "id" | "time">[] = [
  { level: "high", region: "EU-WEST", topic: "Vaccine narrative spike", delta: "+412%" },
  { level: "med",  region: "US-EAST", topic: "Election fraud claims",   delta: "+89%"  },
  { level: "low",  region: "ASIA",    topic: "AI deepfake — politician", delta: "+34%" },
  { level: "high", region: "LATAM",   topic: "Climate denial cluster",  delta: "+217%" },
  { level: "med",  region: "MENA",    topic: "Conflict misinfo surge",  delta: "+156%" },
  { level: "low",  region: "GLOBAL",  topic: "Crypto scam headlines",   delta: "+22%"  },
  { level: "high", region: "UK",      topic: "Health miracle clickbait", delta: "+301%" },
  { level: "med",  region: "AFRICA",  topic: "Synthetic news domain",   delta: "+74%"  },
];

function timeNow() {
  const d = new Date();
  return d.toLocaleTimeString("en-GB", { hour12: false });
}

const levelMap = {
  high: { bg: "bg-crimson-glow/15", border: "border-crimson-glow/40", text: "text-crimson-glow", dot: "bg-crimson-glow", label: "CRITICAL" },
  med:  { bg: "bg-amber/15",        border: "border-amber/40",        text: "text-amber",        dot: "bg-amber",        label: "ELEVATED" },
  low:  { bg: "bg-electric/15",     border: "border-electric/40",     text: "text-electric",     dot: "bg-electric",     label: "MONITOR"  },
} as const;

export function LiveIntelFeed({ compact = false }: { compact?: boolean }) {
  const [alerts, setAlerts] = useState<Alert[]>(() =>
    SEED.slice(0, 5).map((a, i) => ({ ...a, id: i, time: timeNow() })),
  );

  useEffect(() => {
    let nextId = alerts.length;
    const id = setInterval(() => {
      const seed = SEED[Math.floor(Math.random() * SEED.length)];
      const next: Alert = { ...seed, id: nextId++, time: timeNow() };
      setAlerts((prev) => [next, ...prev].slice(0, 6));
    }, 3800);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside
      className={`glass relative overflow-hidden rounded-md ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-glow/60 to-transparent" />
      <div className="scanlines absolute inset-0 opacity-50 pointer-events-none" />

      <header className="relative mb-4 flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson-glow/70 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson-glow" />
          </span>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground">
            Live Intel · Sector 09
          </h3>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
          <Radio className="h-3 w-3 text-electric animate-pulse" /> Streaming
        </span>
      </header>

      <ul className="relative space-y-2">
        <AnimatePresence initial={false}>
          {alerts.map((a) => {
            const m = levelMap[a.level];
            return (
              <motion.li
                key={a.id}
                layout
                initial={{ opacity: 0, x: 30, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: -30, height: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative overflow-hidden rounded-sm border ${m.border} ${m.bg} p-3 transition-all hover:translate-x-0.5`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${m.dot} animate-pulse`} />
                      <span className={`font-mono text-[9px] uppercase tracking-[0.25em] ${m.text}`}>
                        {m.label}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                        · {a.region}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate text-sm text-foreground/90">{a.topic}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className={`font-display text-base font-bold ${m.text}`}>{a.delta}</div>
                    <div className="font-mono text-[9px] tabular-nums text-muted-foreground">{a.time}</div>
                  </div>
                </div>
                <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-transparent via-current to-transparent opacity-50" style={{ color: m.dot.replace("bg-", "") }} />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <footer className="relative mt-4 flex items-center justify-between border-t border-border pt-3 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <TrendingUp className="h-3 w-3 text-electric" /> 4,217 signals / 24h
        </span>
        <span className="flex items-center gap-1.5">
          <AlertTriangle className="h-3 w-3 text-crimson-glow" /> 12 critical
        </span>
      </footer>
    </aside>
  );
}

export function IntelTicker() {
  return (
    <div className="relative overflow-hidden border-y border-border bg-ink/60 py-2 backdrop-blur">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />
      <div className="marquee font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60">
        {Array.from({ length: 2 }).map((_, k) => (
          <div key={k} className="flex shrink-0 items-center gap-10">
            <span className="flex items-center gap-2"><Flame className="h-3 w-3 text-crimson-glow" /> EU-WEST · vaccine narrative +412%</span>
            <span className="flex items-center gap-2"><Activity className="h-3 w-3 text-electric" /> Detection model v2.4 · stable</span>
            <span className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-amber" /> US-EAST · election claims spiking</span>
            <span className="flex items-center gap-2"><Radio className="h-3 w-3 text-electric animate-pulse" /> Live · 4,217 signals / 24h</span>
            <span className="flex items-center gap-2"><Flame className="h-3 w-3 text-crimson-glow" /> LATAM · climate cluster +217%</span>
            <span className="flex items-center gap-2"><TrendingUp className="h-3 w-3 text-electric" /> Synthetic media domain detected</span>
          </div>
        ))}
      </div>
    </div>
  );
}
