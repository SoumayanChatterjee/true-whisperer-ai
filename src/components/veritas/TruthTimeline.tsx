import { motion } from "framer-motion";
import { Sprout, GitBranch, Megaphone, Flame } from "lucide-react";

const stageMeta: Record<string, { icon: any; label: string; color: string }> = {
  origin: { icon: Sprout, label: "Origin", color: "text-success" },
  modified: { icon: GitBranch, label: "Modified", color: "text-warning" },
  amplified: { icon: Megaphone, label: "Amplified", color: "text-accent" },
  viral: { icon: Flame, label: "Viral", color: "text-danger" },
};

export function TruthTimeline({
  items,
}: {
  items: { stage: string; title: string; description: string }[];
}) {
  return (
    <ol className="relative space-y-6 border-l-2 border-dashed border-border pl-6">
      {items.map((it, i) => {
        const meta = stageMeta[it.stage] ?? stageMeta.modified;
        const Icon = meta.icon;
        return (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            className="relative"
          >
            <span className="absolute -left-[34px] flex h-7 w-7 items-center justify-center rounded-full border border-border bg-paper shadow-paper">
              <Icon className={`h-3.5 w-3.5 ${meta.color}`} />
            </span>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Stage {i + 1} · {meta.label}
            </div>
            <h5 className="mt-1 font-display text-lg font-bold text-ink">{it.title}</h5>
            <p className="mt-1 text-sm text-muted-foreground">{it.description}</p>
          </motion.li>
        );
      })}
    </ol>
  );
}
