import { motion } from "framer-motion";
import {
  ScanSearch, Sparkles, ShieldCheck, Scale, Gauge, FileText, Wand2, ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/veritas/Navbar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const STEPS = [
  { I: FileText, title: "1 · Ingest", text: "You paste text, a URL, headline or source. We normalize and tokenize the input." },
  { I: ScanSearch, title: "2 · Extract", text: "Claims, entities, named sources, and stylistic markers are pulled out." },
  { I: Sparkles, title: "3 · LLM reasoning", text: "A reasoning model scores authenticity, evidence quality and bias with rationale." },
  { I: Gauge, title: "4 · Score", text: "Five sub-signals roll up into a 0–100 score with calibrated model confidence." },
  { I: Wand2, title: "5 · Rewrite", text: "A neutral rewrite is generated to show what reality-aware framing looks like." },
  { I: ShieldCheck, title: "6 · Verdict", text: "You get a verdict, red & green flags, claims, and recommended next checks." },
];

const SCORING = [
  { name: "Linguistic", desc: "Sensational language, loaded words, emotional loading, clickbait patterns." },
  { name: "Source credibility", desc: "Domain reputation, named authorship, transparency, attribution chain." },
  { name: "Evidence quality", desc: "Concrete data, named experts, primary sources, links to documents." },
  { name: "Sentiment bias", desc: "Tone neutrality vs. outrage / fear / mockery — calibrated against topic norms." },
  { name: "Plausibility", desc: "How well the claim fits known facts, prior reporting and physical possibility." },
];

const BIAS = [
  { label: "Political lean", text: "Estimates left ↔ right tilt from framing, source mix and word choice." },
  { label: "Emotional tone", text: "Detects fear, anger, hope, outrage, mockery and intensity level." },
  { label: "Headline mismatch", text: "Compares headline framing to body content and flags exaggeration." },
];

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-mesh">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground pulse-glow">
            <Gauge className="h-3 w-3 text-crimson animate-pulse" /> Methodology
          </div>
          <h1 className="mt-3 font-display text-4xl font-black text-ink md:text-5xl">
            How <span className="text-gradient">Veritas</span> thinks
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            A six-stage pipeline blending NLP, domain heuristics and large language model reasoning —
            tuned for explanation, not just verdicts.
          </p>
        </motion.div>

        <h2 className="mb-4 font-display text-2xl font-bold text-ink">The pipeline</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="tilt group relative overflow-hidden rounded-md border border-border bg-card p-5 shadow-paper"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-crimson-glow/10 blur-2xl transition-all group-hover:bg-crimson-glow/30" />
              <div className="relative">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-ink text-cream transition-transform group-hover:rotate-6 group-hover:scale-110">
                  <s.I className="h-4 w-4" />
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-md border border-border bg-card p-6 shadow-paper"
          >
            <div className="mb-4 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-crimson" />
              <h3 className="font-display text-xl font-bold text-ink">Credibility scoring</h3>
            </div>
            <ul className="space-y-3">
              {SCORING.map((s, i) => (
                <motion.li
                  key={s.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="rounded-sm border border-border bg-paper p-3"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.name}</div>
                  <div className="text-sm text-ink">{s.desc}</div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-md border border-border bg-card p-6 shadow-paper"
          >
            <div className="mb-4 flex items-center gap-2">
              <Scale className="h-4 w-4 text-crimson" />
              <h3 className="font-display text-xl font-bold text-ink">Bias detection</h3>
            </div>
            <ul className="space-y-3">
              {BIAS.map((b, i) => (
                <motion.li
                  key={b.label}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="rounded-sm border border-border bg-paper p-3"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{b.label}</div>
                  <div className="text-sm text-ink">{b.text}</div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="glow-ring mt-12 flex flex-col items-start justify-between gap-4 rounded-md border border-border bg-paper p-6 shadow-elevated md:flex-row md:items-center"
        >
          <div>
            <h3 className="font-display text-xl font-bold text-ink">Try it on a real article</h3>
            <p className="text-sm text-muted-foreground">Run the full pipeline on your own text in seconds.</p>
          </div>
          <Link to="/">
            <Button size="lg" className="group bg-ink text-cream hover:bg-ink-soft hover:shadow-glow">
              Open analyzer <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
