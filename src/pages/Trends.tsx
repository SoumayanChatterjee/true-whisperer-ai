import { motion } from "framer-motion";
import { TrendingUp, Flame, AlertTriangle, Activity } from "lucide-react";
import { Navbar } from "@/components/veritas/Navbar";
import { Footer } from "@/components/veritas/Footer";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";

const TRENDING = [
  { id: 1, topic: "AI-generated election deepfakes", category: "Politics", heat: 94, delta: "+38%", color: "border-danger/50" },
  { id: 2, topic: "Miracle weight-loss supplement claims", category: "Health", heat: 88, delta: "+22%", color: "border-warning/50" },
  { id: 3, topic: "Crypto 'guaranteed' return scams", category: "Finance", heat: 81, delta: "+17%", color: "border-warning/50" },
  { id: 4, topic: "Climate change denial resurgence", category: "Science", heat: 76, delta: "+12%", color: "border-danger/50" },
  { id: 5, topic: "Celebrity death hoaxes", category: "Social", heat: 64, delta: "+8%", color: "border-warning/50" },
  { id: 6, topic: "Vaccine misinformation revival", category: "Health", heat: 71, delta: "+14%", color: "border-danger/50" },
];

const SERIES = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  fake: Math.round(40 + Math.sin(i / 2) * 20 + Math.random() * 12),
  mixed: Math.round(25 + Math.cos(i / 3) * 10 + Math.random() * 8),
  real: Math.round(30 + Math.sin(i / 4) * 8 + Math.random() * 6),
}));

const CATEGORIES = [
  { name: "Politics", count: 142 },
  { name: "Health", count: 118 },
  { name: "Tech", count: 76 },
  { name: "Finance", count: 64 },
  { name: "Science", count: 52 },
  { name: "Social", count: 88 },
];

export default function Trends() {
  return (
    <main className="min-h-screen bg-mesh">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground pulse-glow">
            <TrendingUp className="h-3 w-3 text-crimson animate-pulse" /> Live trends · simulated
          </div>
          <h1 className="mt-3 font-display text-4xl font-black text-foreground md:text-5xl">
            Misinformation <span className="text-gradient">trends</span>
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Topics, categories and momentum of the narratives Veritas is detecting most often.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="tilt lg:col-span-2 rounded-md border border-border bg-card p-5 shadow-paper"
          >
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-crimson" />
              <h3 className="font-display text-lg font-bold text-foreground">Detections — last 14 days</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SERIES}>
                  <defs>
                    <linearGradient id="f" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--danger))" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="hsl(var(--danger))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="m" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="r" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Area type="monotone" dataKey="fake" stroke="hsl(var(--danger))" fill="url(#f)" />
                  <Area type="monotone" dataKey="mixed" stroke="hsl(var(--warning))" fill="url(#m)" />
                  <Area type="monotone" dataKey="real" stroke="hsl(var(--success))" fill="url(#r)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="tilt rounded-md border border-border bg-card p-5 shadow-paper"
          >
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h3 className="font-display text-lg font-bold text-foreground">By category</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CATEGORIES}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="count" fill="hsl(var(--crimson))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <h2 className="mt-10 font-display text-2xl font-bold text-foreground">Trending narratives</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TRENDING.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`tilt group relative overflow-hidden rounded-md border border-l-4 bg-card p-5 shadow-paper ${t.color}`}
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-crimson-glow/10 blur-2xl transition-all group-hover:bg-crimson-glow/25" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{t.category}</span>
                  <span className="flex items-center gap-1 font-mono text-[11px] text-danger">
                    <Flame className="h-3 w-3" /> {t.delta}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-lg font-bold text-foreground leading-snug">{t.topic}</h3>
                <div className="mt-4">
                  <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                    <span>Heat</span><span>{t.heat}/100</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.heat}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
                      className="h-full rounded-full bg-gradient-to-r from-warning to-danger"
                    />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
