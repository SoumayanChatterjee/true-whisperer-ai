import { motion } from "framer-motion";
import {
  Brain,
  ScanSearch,
  Radar,
  GitMerge,
  Sparkles,
  ShieldAlert,
  HeartHandshake,
  Users,
  Globe2,
  Vote,
  Stethoscope,
  Newspaper,
  Quote,
} from "lucide-react";
import { Navbar } from "@/components/veritas/Navbar";
import { Footer } from "@/components/veritas/Footer";
import { Link } from "react-router-dom";

const PILLARS = [
  {
    icon: HeartHandshake,
    title: "People before clicks",
    body: "Misinformation isn't an abstract problem. It splits families, ruins reputations, and pushes vulnerable people toward harmful choices. Veritas exists to protect the human on the other side of the screen.",
  },
  {
    icon: Globe2,
    title: "Built for everyone",
    body: "Free to use, no account required, accessible on a phone with a weak connection. Truth literacy shouldn't be a paywalled luxury — especially in regions where independent journalism is under threat.",
  },
  {
    icon: Users,
    title: "Transparent, not preachy",
    body: "We don't tell you what to believe. We show our reasoning, surface the evidence we found, and trust you to decide. The goal is informed citizens, not obedient ones.",
  },
];

const HARMS = [
  {
    icon: Vote,
    title: "Democratic erosion",
    body: "Coordinated falsehoods suppress votes and destabilise elections in over 40 countries each year.",
  },
  {
    icon: Stethoscope,
    title: "Public health harm",
    body: "Health hoaxes during COVID-19 contributed to an estimated hundreds of thousands of preventable deaths.",
  },
  {
    icon: Newspaper,
    title: "Trust collapse",
    body: "When everything could be fake, people stop believing anything — including the journalists risking their lives for the truth.",
  },
];

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
    <main className="min-h-screen bg-mesh">
      <Navbar />

      {/* HERO — humanitarian framing */}
      <section className="relative overflow-hidden bg-hero text-cream">
        <div className="grain absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-crimson-glow/25 blur-3xl float-blob" />
        <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl float-blob-slow" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-cream/80 backdrop-blur pulse-glow">
              <HeartHandshake className="h-3 w-3" />
              Our mission
            </div>
            <h1 className="mt-4 font-display text-5xl font-black leading-[1.05] md:text-6xl">
              Truth is a <span className="italic text-gradient">human right</span>.
              <br />
              <span className="text-cream/80">We're trying to defend it.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-cream/80">
              Every day, false stories reach billions of people before the truth has a chance to put on its shoes.
              Veritas is a small, open tool built to give that truth a fighting chance — for journalists,
              students, grandparents, election workers, and anyone trying to make sense of a noisy world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* QUOTE — human voice */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <motion.figure
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-md border border-border bg-card p-8 shadow-paper md:p-12"
        >
          <Quote className="absolute -top-5 left-8 h-10 w-10 rounded-sm bg-ink p-2 text-cream shadow-glow" />
          <blockquote className="font-display text-2xl italic leading-snug text-foreground md:text-3xl">
            "A lie can travel halfway around the world while the truth is still putting on its shoes."
          </blockquote>
          <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            — Often attributed to Mark Twain · still true in 2026
          </figcaption>
        </motion.figure>
      </section>

      {/* PILLARS — values */}
      <section className="mx-auto max-w-5xl px-6 pb-8">
        <h2 className="font-display text-3xl font-black text-foreground md:text-4xl">
          What we <span className="text-gradient">stand for</span>
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Three commitments that shape every decision we make — from the prompts we write to the data we refuse to collect.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="tilt group relative overflow-hidden rounded-md border border-border bg-card p-6 shadow-paper"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition-all group-hover:bg-accent/30" />
              <div className="relative">
                <div className="grid h-11 w-11 place-items-center rounded-sm bg-ink text-cream shadow-glow transition-transform group-hover:rotate-6 group-hover:scale-110">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HARMS — why this matters */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-md border border-border bg-card p-8 shadow-paper md:p-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-crimson">The stakes</div>
              <h2 className="mt-1 font-display text-3xl font-black text-foreground md:text-4xl">
                Why this <span className="text-gradient">matters</span>
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Misinformation isn't a meme problem. It's a public-safety problem with measurable human cost.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {HARMS.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-sm border border-border/60 bg-background p-5"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-crimson to-transparent opacity-60" />
                <h.icon className="h-5 w-5 text-crimson" />
                <h3 className="mt-3 font-display text-lg font-bold text-foreground">{h.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{h.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PIPELINE — kept, condensed */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="font-display text-3xl font-black text-foreground">
          How it <span className="text-gradient">works</span>
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A transparent, multi-signal pipeline. No black-box verdicts — every score comes with the evidence behind it.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="tilt group relative overflow-hidden rounded-md border border-border bg-card p-6 shadow-paper"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-crimson-glow/10 blur-2xl transition-all group-hover:bg-crimson-glow/30" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-sm bg-ink text-cream shadow-glow transition-transform group-hover:rotate-6 group-hover:scale-110">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Step {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ETHICS + STACK */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-8 rounded-md border border-border bg-card p-8 md:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground">Limits & humility</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>· Veritas is an <em>assistant</em>, not an oracle. Always verify with primary sources.</li>
              <li>· Scores reflect linguistic and structural signals, not ground-truth fact-checking.</li>
              <li>· LLMs can be wrong, biased, or out-of-date. Treat outputs as hypotheses to investigate.</li>
              <li>· We never store the articles you analyse on our servers. Your reading is yours.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground">Built with</h3>
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

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glow-ring relative overflow-hidden rounded-lg bg-hero p-10 text-center text-cream shadow-elevated"
        >
          <div className="grain absolute inset-0 opacity-40" />
          <div className="relative">
            <h3 className="font-display text-3xl font-black md:text-4xl">
              Help us defend the <span className="text-gradient italic">signal</span> from the noise.
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-cream/80">
              Try Veritas on a story you're unsure about. Share it with someone who needs it. That's how trust scales.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-sm bg-cream px-5 py-3 font-mono text-xs uppercase tracking-widest text-foreground shadow-glow transition-transform hover:scale-[1.03]"
              >
                Analyse a story
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-sm border border-cream/30 px-5 py-3 font-mono text-xs uppercase tracking-widest text-cream/90 transition-colors hover:bg-cream/10"
              >
                Explore real cases
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
