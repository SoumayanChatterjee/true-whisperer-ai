import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Radar, Brain, Heart, FileSearch, ShieldAlert } from "lucide-react";

const STAGES = [
  { id: 0, label: "Scanning sources", sub: "Resolving domain reputation, citations, attribution",  icon: Radar },
  { id: 1, label: "Detecting narrative manipulation", sub: "Pattern-matching clickbait, framing, distortion", icon: Brain },
  { id: 2, label: "Analyzing emotional bias", sub: "Tone, intensity, polarization indicators",  icon: Heart },
  { id: 3, label: "Generating truth model", sub: "Cross-referencing claims against knowledge graph", icon: FileSearch },
  { id: 4, label: "Compiling intelligence report", sub: "Drafting verdict, rationale, rewrites", icon: ShieldAlert },
];

export function IntelligenceLoader() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a >= STAGES.length - 1 ? a : a + 1));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mt-8 overflow-hidden rounded-md border border-border glass scan-sweep">
      <div className="absolute inset-0 cyber-grid-dense opacity-30 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric to-transparent" />

      <div className="relative p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
            </span>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground">
              Intelligence Pipeline · Running
            </h4>
          </div>
          <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
            STAGE {String(active + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")}
          </span>
        </div>

        <ul className="space-y-2.5">
          {STAGES.map((s, i) => {
            const done = i < active;
            const current = i === active;
            const pending = i > active;
            const Icon = s.icon;
            return (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: pending ? 0.4 : 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-center gap-3 rounded-sm border p-3 transition-all ${
                  current
                    ? "border-electric/50 bg-electric/5 shadow-glow"
                    : done
                    ? "border-success/30 bg-success/5"
                    : "border-border bg-card/30"
                }`}
              >
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-sm border ${
                    current
                      ? "border-electric/50 bg-electric/10 text-electric"
                      : done
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-border bg-secondary text-muted-foreground"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : current ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-sm font-semibold ${
                        current ? "text-foreground" : done ? "text-foreground/85" : "text-foreground/60"
                      }`}
                    >
                      {s.label}
                    </span>
                    {current && (
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric"
                      >
                        ··· processing
                      </motion.span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{s.sub}</p>
                </div>
                {current && (
                  <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-secondary md:block">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.4, ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-electric to-electric-soft"
                      style={{ background: "linear-gradient(90deg, hsl(var(--electric)), hsl(var(--crimson-glow)))" }}
                    />
                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>

        <AnimatePresence>
          {active >= STAGES.length - 1 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-electric"
            >
              Awaiting model response · Drafting report
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
