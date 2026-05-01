import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Quote, ExternalLink, Lightbulb } from "lucide-react";

export type Analysis = {
  authenticity_score: number;
  verdict: "likely_authentic" | "mixed" | "questionable" | "likely_fake";
  confidence: number;
  summary: string;
  signals: {
    linguistic_score: number;
    source_credibility: number;
    evidence_quality: number;
    sentiment_bias: number;
    plausibility: number;
  };
  red_flags: string[];
  green_flags: string[];
  key_claims: { claim: string; verifiability: "verifiable" | "partially_verifiable" | "unverifiable" }[];
  recommendations: string[];
};

const verdictMeta = {
  likely_authentic: { label: "Likely authentic", tone: "good", icon: CheckCircle2 },
  mixed: { label: "Mixed signals", tone: "mixed", icon: AlertTriangle },
  questionable: { label: "Questionable", tone: "mixed", icon: AlertTriangle },
  likely_fake: { label: "Likely fake / manipulative", tone: "bad", icon: XCircle },
} as const;

function scoreGradient(score: number) {
  if (score >= 70) return "var(--gradient-score-good)";
  if (score >= 40) return "var(--gradient-score-mixed)";
  return "var(--gradient-score-bad)";
}

function ScoreRing({ score }: { score: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative h-44 w-44">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={r} stroke="hsl(var(--border))" strokeWidth="10" fill="none" />
        <motion.circle
          cx="80"
          cy="80"
          r={r}
          stroke="url(#g)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={score >= 70 ? "hsl(152 60% 40%)" : score >= 40 ? "hsl(38 90% 50%)" : "hsl(358 75% 45%)"} />
            <stop offset="100%" stopColor={score >= 70 ? "hsl(165 55% 45%)" : score >= 40 ? "hsl(28 90% 52%)" : "hsl(12 80% 55%)"} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-display text-5xl font-black text-ink"
        >
          {Math.round(score)}
        </motion.span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function SignalBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="font-display text-sm font-bold text-ink">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(2, Math.min(100, value))}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: scoreGradient(value) }}
        />
      </div>
    </div>
  );
}

export function ResultPanel({ analysis, meta }: { analysis: Analysis; meta: any }) {
  const v = verdictMeta[analysis.verdict];
  const Icon = v.icon;

  return (
    <article className="overflow-hidden rounded-md border border-border bg-card shadow-elevated">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-border bg-ink p-8 text-cream">
        <div className="grain absolute inset-0 opacity-40" />
        <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cream/60">
              <span>Verdict</span>
              <span className="h-px w-8 bg-cream/30" />
              <span className="text-crimson-glow">Confidence {Math.round(analysis.confidence)}%</span>
            </div>
            <h3 className="mt-3 flex items-center gap-3 font-display text-3xl font-black md:text-4xl">
              <Icon className={`h-8 w-8 ${v.tone === "good" ? "text-emerald-400" : v.tone === "bad" ? "text-crimson-glow" : "text-amber-300"}`} />
              {v.label}
            </h3>
            <p className="mt-4 max-w-xl text-cream/80 text-balance">{analysis.summary}</p>
            {meta?.fetched_domain && (
              <a
                href={meta.analyzed_url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-crimson-glow hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                {meta.fetched_domain}
              </a>
            )}
          </div>
          <ScoreRing score={analysis.authenticity_score} />
        </div>
      </header>

      {/* Signals */}
      <section className="grid gap-6 border-b border-border p-8 md:grid-cols-2">
        <div className="space-y-4">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Signal breakdown</h4>
          <SignalBar label="Linguistic neutrality" value={analysis.signals.linguistic_score} />
          <SignalBar label="Source credibility" value={analysis.signals.source_credibility} />
          <SignalBar label="Evidence quality" value={analysis.signals.evidence_quality} />
          <SignalBar label="Sentiment / bias" value={analysis.signals.sentiment_bias} />
          <SignalBar label="Plausibility" value={analysis.signals.plausibility} />
        </div>

        <div className="grid gap-3 content-start">
          {analysis.red_flags.length > 0 && (
            <div className="rounded-md border border-danger/30 bg-danger/5 p-4">
              <h5 className="mb-2 flex items-center gap-2 font-display text-sm font-bold text-danger">
                <XCircle className="h-4 w-4" /> Red flags
              </h5>
              <ul className="space-y-1.5 text-sm text-ink">
                {analysis.red_flags.map((f, i) => (
                  <li key={i} className="flex gap-2"><span className="text-danger">·</span>{f}</li>
                ))}
              </ul>
            </div>
          )}
          {analysis.green_flags.length > 0 && (
            <div className="rounded-md border border-success/30 bg-success/5 p-4">
              <h5 className="mb-2 flex items-center gap-2 font-display text-sm font-bold text-success">
                <CheckCircle2 className="h-4 w-4" /> Credibility signals
              </h5>
              <ul className="space-y-1.5 text-sm text-ink">
                {analysis.green_flags.map((f, i) => (
                  <li key={i} className="flex gap-2"><span className="text-success">·</span>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Claims */}
      {analysis.key_claims.length > 0 && (
        <section className="border-b border-border p-8">
          <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Extracted claims</h4>
          <ul className="space-y-3">
            {analysis.key_claims.map((c, i) => (
              <li key={i} className="flex gap-3 border-l-2 border-ink/10 pl-4">
                <Quote className="mt-1 h-4 w-4 shrink-0 text-crimson" />
                <div className="flex-1">
                  <p className="font-display text-base text-ink leading-snug">{c.claim}</p>
                  <span className={`mt-1 inline-block font-mono text-[10px] uppercase tracking-widest ${
                    c.verifiability === "verifiable" ? "text-success" :
                    c.verifiability === "partially_verifiable" ? "text-warning" : "text-danger"
                  }`}>
                    {c.verifiability.replace("_", " ")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <section className="bg-secondary/40 p-8">
          <h4 className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <Lightbulb className="h-3 w-3" /> Verify further
          </h4>
          <ul className="space-y-2 text-sm text-ink">
            {analysis.recommendations.map((r, i) => (
              <li key={i} className="flex gap-2"><span className="text-crimson">→</span>{r}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
