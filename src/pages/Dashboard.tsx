import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Trash2, FileSearch } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/veritas/Navbar";
import { clearHistory, loadHistory, verdictBucket, type HistoryEntry } from "@/lib/history";

const COLORS = {
  real: "hsl(152 60% 40%)",
  mixed: "hsl(38 90% 50%)",
  fake: "hsl(358 75% 45%)",
};

export default function Dashboard() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const stats = useMemo(() => {
    const total = history.length;
    let real = 0, mixed = 0, fake = 0;
    let sum = 0;
    history.forEach((h) => {
      const b = verdictBucket(h.analysis.authenticity_score);
      if (b === "real") real++; else if (b === "mixed") mixed++; else fake++;
      sum += h.analysis.authenticity_score;
    });
    return { total, real, mixed, fake, avg: total ? Math.round(sum / total) : 0 };
  }, [history]);

  const pieData = [
    { name: "Likely real", value: stats.real, color: COLORS.real },
    { name: "Mixed", value: stats.mixed, color: COLORS.mixed },
    { name: "Likely fake", value: stats.fake, color: COLORS.fake },
  ].filter((d) => d.value > 0);

  const recentBars = [...history].slice(0, 10).reverse().map((h, i) => ({
    name: `#${i + 1}`,
    score: Math.round(h.analysis.authenticity_score),
  }));

  return (
    <main className="min-h-screen bg-mesh">
      <Navbar />
      <section className="relative mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Workspace</div>
            <h1 className="mt-1 font-display text-4xl font-black text-ink md:text-5xl">
              Dash<span className="text-gradient">board</span>
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Your past analyses, locally stored, with credibility distribution.
            </p>
          </motion.div>
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => { clearHistory(); setHistory([]); }}
              className="hover:border-danger hover:text-danger"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear history
            </Button>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total analyses", value: stats.total, accent: "text-ink", glow: "from-ink/20" },
            { label: "Likely real", value: stats.real, accent: "text-success", glow: "from-success/30" },
            { label: "Mixed signals", value: stats.mixed, accent: "text-warning", glow: "from-warning/30" },
            { label: "Likely fake", value: stats.fake, accent: "text-danger", glow: "from-danger/30" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`tilt relative overflow-hidden rounded-md border border-border bg-card p-5 shadow-paper`}
            >
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${s.glow} to-transparent blur-2xl`} />
              <div className="relative">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
                <motion.div
                  key={s.value}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className={`mt-2 font-display text-4xl font-black ${s.accent}`}
                >
                  {s.value}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {history.length === 0 ? (
          <div className="mt-10 rounded-md border border-dashed border-border bg-card/40 p-12 text-center">
            <FileSearch className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 font-display text-2xl font-bold text-ink">No analyses yet</h3>
            <p className="mt-2 text-muted-foreground">Run your first analysis to populate the dashboard.</p>
            <Button asChild className="mt-6 bg-ink text-cream hover:bg-ink-soft">
              <Link to="/">Analyze something</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Charts */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-md border border-border bg-card p-6 shadow-paper">
                <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  <BarChart3 className="h-3 w-3" /> Verdict distribution
                </div>
                <div className="h-[260px]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                        {pieData.map((d) => <Cell key={d.name} fill={d.color} />)}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 10, textTransform: "uppercase" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Average score · <span className="text-ink">{stats.avg} / 100</span>
                </div>
              </div>

              <div className="rounded-md border border-border bg-card p-6 shadow-paper">
                <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  <BarChart3 className="h-3 w-3" /> Recent authenticity scores
                </div>
                <div className="h-[260px]">
                  <ResponsiveContainer>
                    <BarChart data={recentBars}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip />
                      <Bar dataKey="score" fill="hsl(var(--crimson))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* History list */}
            <div className="mt-8">
              <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Past analyses
              </h3>
              <ul className="space-y-2">
                {history.map((h) => {
                  const bucket = verdictBucket(h.analysis.authenticity_score);
                  const tone = bucket === "real" ? "border-success/40" : bucket === "fake" ? "border-danger/40" : "border-warning/40";
                  return (
                    <li
                      key={h.id}
                      className={`flex items-center gap-4 rounded-md border bg-card p-4 shadow-paper ${tone}`}
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-ink font-display text-lg font-black text-cream">
                        {Math.round(h.analysis.authenticity_score)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            {h.input_kind}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            · {new Date(h.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 truncate font-display text-base text-ink">{h.input_preview}</p>
                      </div>
                      <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:inline">
                        {h.analysis.verdict.replace("_", " ")}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
