import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Quote, ExternalLink, Lightbulb, Radar as RadarIcon, Sparkles, GitMerge, Tags, AlignVerticalJustifyCenter, ChevronDown, Info, Scale, Flame, MessageSquareWarning, Link2Off, Megaphone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CredibilityRadar, type RadarData } from "./CredibilityRadar";
import { TruthTimeline } from "./TruthTimeline";
import { HighlightedText } from "./HighlightedText";

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
  signal_explanations?: {
    linguistic_score: { rationale: string; evidence: string[] };
    source_credibility: { rationale: string; evidence: string[] };
    evidence_quality: { rationale: string; evidence: string[] };
    sentiment_bias: { rationale: string; evidence: string[] };
    plausibility: { rationale: string; evidence: string[] };
  };
  red_flags: string[];
  green_flags: string[];
  key_claims: { claim: string; verifiability: "verifiable" | "partially_verifiable" | "unverifiable" }[];
  recommendations: string[];
  radar?: RadarData;
  narrative_patterns?: { label: string; severity: "low" | "medium" | "high"; evidence: string }[];
  suspicious_words?: string[];
  headline_body_mismatch?: { score: number; explanation: string };
  rewritten_neutral?: string;
  truth_evolution?: { stage: string; title: string; description: string }[];
  bias_tone?: {
    political_bias: number; // -100..100
    political_label: string;
    emotional_tone: string;
    tone_intensity: number;
    rationale: string;
  };
  fake_reasons?: {
    emotional_language: string[];
    clickbait_patterns: string[];
    missing_sources: string[];
  };
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
          cx="80" cy="80" r={r} stroke="url(#g)" strokeWidth="10" fill="none" strokeLinecap="round"
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
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="font-display text-5xl font-black text-ink">
          {Math.round(score)}
        </motion.span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function SignalBar({
  label,
  value,
  explanation,
}: {
  label: string;
  value: number;
  explanation?: { rationale: string; evidence: string[] };
}) {
  const [open, setOpen] = useState(false);
  const hasExplain = !!explanation && (explanation.rationale || explanation.evidence?.length);
  return (
    <div>
      <button
        type="button"
        onClick={() => hasExplain && setOpen((o) => !o)}
        disabled={!hasExplain}
        className={`group block w-full text-left ${hasExplain ? "cursor-pointer" : "cursor-default"}`}
        aria-expanded={open}
      >
        <div className="mb-1 flex items-baseline justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {label}
            {hasExplain && (
              <ChevronDown
                className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""} text-muted-foreground/60 group-hover:text-crimson`}
              />
            )}
          </span>
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
      </button>
      <AnimatePresence initial={false}>
        {open && hasExplain && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-md border border-border bg-paper/60 p-3">
              {explanation!.rationale && (
                <p className="flex gap-2 text-xs leading-relaxed text-ink">
                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-crimson" />
                  <span>{explanation!.rationale}</span>
                </p>
              )}
              {explanation!.evidence?.length > 0 && (
                <ul className="mt-2 space-y-1 border-t border-border/60 pt-2">
                  {explanation!.evidence.map((e, i) => (
                    <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                      <span className="font-mono text-crimson">·</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const severityClasses: Record<string, string> = {
  low: "border-success/40 bg-success/10 text-success",
  medium: "border-warning/40 bg-warning/10 text-warning",
  high: "border-danger/40 bg-danger/10 text-danger",
};

export function ResultPanel({
  analysis,
  meta,
  originalText,
  originalHeadline,
}: {
  analysis: Analysis;
  meta: any;
  originalText?: string;
  originalHeadline?: string;
}) {
  const v = verdictMeta[analysis.verdict];
  const Icon = v.icon;
  const [showRewrite, setShowRewrite] = useState(false);
  const suspicious = analysis.suspicious_words ?? [];
  const mismatch = analysis.headline_body_mismatch;

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
              <a href={meta.analyzed_url} target="_blank" rel="noreferrer noopener"
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-crimson-glow hover:underline">
                <ExternalLink className="h-3 w-3" />
                {meta.fetched_domain}
              </a>
            )}
          </div>
          <ScoreRing score={analysis.authenticity_score} />
        </div>
      </header>

      {/* Radar + Signals */}
      <section className="grid gap-8 border-b border-border p-8 md:grid-cols-2">
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <RadarIcon className="h-3 w-3" /> Credibility radar
          </h4>
          {analysis.radar ? (
            <CredibilityRadar data={analysis.radar} />
          ) : (
            <p className="text-sm text-muted-foreground">Radar metrics unavailable.</p>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Signal breakdown</h4>
            {analysis.signal_explanations && (
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">Tap a row for evidence</span>
            )}
          </div>
          <SignalBar label="Linguistic neutrality" value={analysis.signals.linguistic_score} explanation={analysis.signal_explanations?.linguistic_score} />
          <SignalBar label="Source credibility" value={analysis.signals.source_credibility} explanation={analysis.signal_explanations?.source_credibility} />
          <SignalBar label="Evidence quality" value={analysis.signals.evidence_quality} explanation={analysis.signal_explanations?.evidence_quality} />
          <SignalBar label="Sentiment / bias" value={analysis.signals.sentiment_bias} explanation={analysis.signal_explanations?.sentiment_bias} />
          <SignalBar label="Plausibility" value={analysis.signals.plausibility} explanation={analysis.signal_explanations?.plausibility} />
        </div>
      </section>

      {/* Flags */}
      <section className="grid gap-3 border-b border-border p-8 md:grid-cols-2">
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
      </section>

      {/* Why this might be fake */}
      {analysis.fake_reasons &&
        (analysis.fake_reasons.emotional_language?.length ||
          analysis.fake_reasons.clickbait_patterns?.length ||
          analysis.fake_reasons.missing_sources?.length) > 0 && (
          <section className="border-b border-border bg-danger/[0.03] p-8">
            <h4 className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <MessageSquareWarning className="h-3 w-3 text-danger" /> Why this might be fake
            </h4>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { key: "emotional_language", label: "Emotional language", icon: Flame, items: analysis.fake_reasons.emotional_language },
                { key: "clickbait_patterns", label: "Clickbait patterns", icon: Megaphone, items: analysis.fake_reasons.clickbait_patterns },
                { key: "missing_sources", label: "Lack of credible sources", icon: Link2Off, items: analysis.fake_reasons.missing_sources },
              ].map((b, i) => {
                const I = b.icon;
                const empty = !b.items || b.items.length === 0;
                return (
                  <motion.div
                    key={b.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`rounded-md border p-4 ${empty ? "border-border bg-card" : "border-danger/30 bg-card"}`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <I className={`h-4 w-4 ${empty ? "text-muted-foreground" : "text-danger"}`} />
                      <span className="font-display text-sm font-bold text-ink">{b.label}</span>
                    </div>
                    {empty ? (
                      <p className="text-xs text-muted-foreground">No notable issues detected.</p>
                    ) : (
                      <ul className="space-y-1.5 text-sm text-ink">
                        {b.items.map((x, j) => (
                          <li key={j} className="flex gap-2"><span className="text-danger">·</span>{x}</li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

      {/* Bias & Tone Meter */}
      {analysis.bias_tone && (
        <section className="border-b border-border p-8">
          <h4 className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <Scale className="h-3 w-3" /> Bias &amp; tone meter
          </h4>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Political bias slider */}
            <div className="rounded-md border border-border bg-paper p-5">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="font-display text-sm font-bold text-ink">Political bias</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {analysis.bias_tone.political_label.replace(/_/g, " ")}
                </span>
              </div>
              <div className="mb-2 flex justify-between font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                <span>Left</span><span>Center</span><span>Right</span>
              </div>
              <div className="relative h-2 rounded-full" style={{ background: "linear-gradient(90deg, hsl(217 80% 55%), hsl(0 0% 70%) 50%, hsl(358 75% 50%))" }}>
                <motion.div
                  initial={{ left: "50%" }}
                  animate={{ left: `${50 + Math.max(-50, Math.min(50, analysis.bias_tone.political_bias / 2))}%` }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-cream shadow-elevated"
                />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{analysis.bias_tone.rationale}</p>
            </div>

            {/* Emotional tone */}
            <div className="rounded-md border border-border bg-paper p-5">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="font-display text-sm font-bold text-ink">Emotional tone</span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-crimson">
                  <Flame className="h-3 w-3" />
                  {analysis.bias_tone.emotional_tone}
                </span>
              </div>
              <div className="mb-1 flex justify-between font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                <span>Calm</span><span>Intense</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(2, Math.min(100, analysis.bias_tone.tone_intensity))}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ background: scoreGradient(100 - analysis.bias_tone.tone_intensity) }}
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Intensity</span>
                <span className="font-display text-2xl font-black text-ink">{Math.round(analysis.bias_tone.tone_intensity)}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Narrative patterns */}
      {analysis.narrative_patterns && analysis.narrative_patterns.length > 0 && (
        <section className="border-b border-border p-8">
          <h4 className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <Tags className="h-3 w-3" /> Narrative patterns detected
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.narrative_patterns.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`group rounded-sm border px-3 py-2 ${severityClasses[p.severity] ?? severityClasses.medium}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold">{p.label}</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest opacity-70">{p.severity}</span>
                </div>
                <p className="mt-1 text-xs opacity-90">{p.evidence}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Headline vs Body Mismatch */}
      {mismatch && originalHeadline && originalText && (
        <section className="border-b border-border p-8">
          <h4 className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <AlignVerticalJustifyCenter className="h-3 w-3" /> Headline vs content mismatch
          </h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>Match</span><span>Mismatch</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mismatch.score}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                  style={{ background: scoreGradient(100 - mismatch.score) }}
                />
              </div>
            </div>
            <span className="font-display text-2xl font-black text-ink">{Math.round(mismatch.score)}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{mismatch.explanation}</p>
        </section>
      )}

      {/* Suspicious word highlighting */}
      {originalText && suspicious.length > 0 && (
        <section className="border-b border-border p-8">
          <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Loaded language in your text
          </h4>
          <div className="rounded-md border border-border bg-paper p-4">
            <HighlightedText
              text={originalText.slice(0, 1200) + (originalText.length > 1200 ? "…" : "")}
              suspicious={suspicious}
              className="font-display text-base leading-relaxed text-ink"
            />
          </div>
        </section>
      )}

      {/* Reality Rewrite */}
      {analysis.rewritten_neutral && originalText && (
        <section className="border-b border-border p-8">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <Sparkles className="h-3 w-3" /> Reality Rewrite Engine
            </h4>
            <Button size="sm" variant={showRewrite ? "default" : "outline"} onClick={() => setShowRewrite(!showRewrite)}>
              {showRewrite ? "Hide rewrite" : "Rewrite to Truth"}
            </Button>
          </div>
          {showRewrite && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-4 md:grid-cols-2"
            >
              <div className="rounded-md border border-danger/30 bg-danger/5 p-4">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-danger">Original</div>
                <p className="text-sm leading-relaxed text-ink">{originalText.slice(0, 800)}{originalText.length > 800 ? "…" : ""}</p>
              </div>
              <div className="rounded-md border border-success/30 bg-success/5 p-4">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-success">Neutral rewrite</div>
                <p className="text-sm leading-relaxed text-ink">{analysis.rewritten_neutral}</p>
              </div>
            </motion.div>
          )}
        </section>
      )}

      {/* Truth Evolution Timeline */}
      {analysis.truth_evolution && analysis.truth_evolution.length > 0 && (
        <section className="border-b border-border p-8">
          <h4 className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <GitMerge className="h-3 w-3" /> Truth evolution timeline
          </h4>
          <TruthTimeline items={analysis.truth_evolution} />
        </section>
      )}

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
