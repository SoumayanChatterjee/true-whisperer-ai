import { motion } from "framer-motion";
import { Brain, ScanSearch, Radar, GitMerge, Sparkles, ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/veritas/Navbar";

const STEPS = [
  { icon: ScanSearch, title: "Ingest", body: "We accept article text, URL (auto-fetched), headlines, or just a publisher domain." },
  { icon: Brain, title: "LLM analysis", body: "Gemini 2.5 Flash via Lovable AI Gateway runs a structured forensic-linguistics prompt." },
  { icon: Radar, title: "Multi-signal scoring", body: "Linguistic neutrality, source credibility, evidence quality, sentiment bias, plausibility." },
  { icon: GitMerge, title: "Narrative modelling", body: "Detects propaganda patterns, headline-vs-body mismatch, and reconstructs claim evolution." },
  { icon: Sparkles, title: "Reality rewrite", body: "Generates a neutral, factual rewrite stripped of bias for side-by-side comparison." },
  { icon: ShieldAlert, title: "Calibrated verdict", body: "0–100 score with confidence, red/green flags, and actions to verify further." },
];

export default function About() {
  return (
    <main className="min-h-screen bg-paper">
      <Navbar />

      <section className="relative overflow-hidden bg-hero text-cream">
        <div className="grain absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/60">About Veritas</div>
            <h1 className="mt-3 font-display text-5xl font-black md:text-6xl">
              How the system <span className="italic text-crimson-glow">thinks</span>.
            </h1>
            <p className="mt-5 max-w-2xl text-cream/80">
              Veritas combines NLP, forensic linguistics, source-credibility heuristics and a large language model
              to produce a transparent, multi-signal authenticity report — never a black-box yes/no.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-display text-3xl font-black text-ink">Pipeline</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="lift shine relative overflow-hidden rounded-md border border-border bg-card p-6 shadow-paper"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-sm bg-ink text-cream">
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Step {String(i + 1).padStart(2, "0")}
                </div>
              </div>
              <h3 className="mt-3 font-display text-xl font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 rounded-md border border-border bg-card p-8 md:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl font-bold text-ink">Limits & ethics</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>· Veritas is an <em>assistant</em>, not an oracle. Always verify with primary sources.</li>
              <li>· Scores reflect linguistic and structural signals, not ground-truth fact-checking.</li>
              <li>· LLMs can be wrong, biased, or out-of-date. Treat outputs as hypotheses.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-ink">Tech stack</h3>
            <ul className="mt-4 space-y-2 font-mono text-xs text-muted-foreground">
              <li>· React + Vite + Tailwind</li>
              <li>· Recharts for radar and stats</li>
              <li>· Framer Motion for transitions</li>
              <li>· Lovable Cloud edge functions</li>
              <li>· Lovable AI Gateway · google/gemini-2.5-flash</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
