import { useEffect, useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ScanSearch, ShieldAlert, ShieldCheck, AlertTriangle, FileText, Link2, Newspaper, Globe, Sparkles, ArrowRight, Radar, Activity, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ResultPanel, type Analysis } from "@/components/veritas/ResultPanel";
import { Navbar } from "@/components/veritas/Navbar";
import { Footer } from "@/components/veritas/Footer";
import { LiveIntelFeed, IntelTicker } from "@/components/veritas/LiveIntelFeed";
import { IntelligenceLoader } from "@/components/veritas/IntelligenceLoader";
import { saveAnalysis } from "@/lib/history";

const schema = z.object({
  text: z.string().max(20000).optional(),
  url: z.string().url("Enter a valid URL").max(2048).optional().or(z.literal("")),
  headline: z.string().max(500).optional(),
  source: z.string().max(200).optional(),
});

const Index = () => {
  const [tab, setTab] = useState("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [headline, setHeadline] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ analysis: Analysis; meta: any; originalText?: string; originalHeadline?: string } | null>(null);

  // Prefill from Explore page
  useEffect(() => {
    const raw = sessionStorage.getItem("veritas:prefill");
    if (!raw) return;
    sessionStorage.removeItem("veritas:prefill");
    try {
      const p = JSON.parse(raw);
      if (p.tab) setTab(p.tab);
      if (p.text) setText(p.text);
      if (p.url) setUrl(p.url);
      if (p.headline) setHeadline(p.headline);
      if (p.source) setSource(p.source);
    } catch { /* ignore */ }
  }, []);

  const analyze = async () => {
    const payload = {
      text: text.trim() || undefined,
      url: url.trim() || undefined,
      headline: headline.trim() || undefined,
      source: source.trim() || undefined,
    };
    if (!payload.text && !payload.url && !payload.headline && !payload.source) {
      toast.error("Provide article text, a URL, a headline, or a source.");
      return;
    }
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-news", { body: parsed.data });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);

      const analysis = (data as any).analysis as Analysis;
      const meta = (data as any).meta;
      const next = {
        analysis,
        meta,
        originalText: payload.text,
        originalHeadline: payload.headline,
      };
      setResult(next);

      // Persist to local history
      const inputKind = (payload.text ? "text" : payload.url ? "url" : payload.headline ? "headline" : "source") as
        "text" | "url" | "headline" | "source";
      const inputPreview =
        payload.text?.slice(0, 140) ||
        payload.url ||
        payload.headline ||
        payload.source ||
        "Untitled";
      saveAnalysis({ analysis, meta, input_kind: inputKind, input_preview: inputPreview });

      setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (e: any) {
      const msg = e?.message?.includes("429")
        ? "Rate limit reached. Try again shortly."
        : e?.message?.includes("402")
        ? "AI credits exhausted. Add credits to continue."
        : e?.message ?? "Analysis failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-mesh">
      <Navbar />
      {/* CINEMATIC HERO — split-screen command center */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 cyber-grid opacity-60" />
        <div className="absolute inset-0 particles opacity-50 pointer-events-none" />
        <div className="grain absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-electric/20 blur-3xl float-blob" />
        <div className="pointer-events-none absolute right-0 top-32 h-[28rem] w-[28rem] rounded-full bg-crimson-glow/15 blur-3xl float-blob-slow" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-neon/10 blur-3xl float-blob" />
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none">
          <defs>
            <linearGradient id="line-grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="hsl(var(--electric))" stopOpacity="0" />
              <stop offset="0.5" stopColor="hsl(var(--electric))" stopOpacity="0.6" />
              <stop offset="1" stopColor="hsl(var(--crimson-glow))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="20%" x2="100%" y2="35%" stroke="url(#line-grad)" strokeWidth="1" />
          <line x1="0" y1="60%" x2="100%" y2="80%" stroke="url(#line-grad)" strokeWidth="1" />
          <line x1="20%" y1="0" x2="60%" y2="100%" stroke="url(#line-grad)" strokeWidth="0.5" />
        </svg>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pt-12 pb-20 md:px-6 md:pt-20 md:pb-28 lg:grid-cols-[1.5fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="inline-flex items-center gap-2 rounded-sm border border-electric/30 bg-electric/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-electric backdrop-blur pulse-glow">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Misinformation Intelligence Console · v2.4</span>
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance md:text-7xl lg:text-[5.5rem]">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7 }}
                className="block text-foreground"
              >
                Decode misinformation
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="block"
              >
                <span className="italic text-gradient">before</span>{" "}
                <span className="text-foreground">it shapes reality.</span>
              </motion.span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground text-balance">
              An investigative AI console for journalists, researchers and the
              terminally curious. Veritas scans sources, detects narrative
              manipulation, and compiles an intelligence report — in seconds.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {[
                { I: Radar,    t: "Source scan",      c: "text-electric"     },
                { I: Activity, t: "Narrative model",  c: "text-crimson-glow" },
                { I: Zap,      t: "Real-time intel",  c: "text-amber"        },
              ].map(({ I, t, c }, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="group flex items-center gap-2 rounded-sm border border-border bg-card/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-electric/40 hover:text-foreground"
                >
                  <I className={`h-3.5 w-3.5 ${c}`} /> {t}
                </motion.span>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 max-w-lg">
              {[
                { v: "4,217", l: "Signals / 24h", c: "text-electric" },
                { v: "12",    l: "Critical now",  c: "text-crimson-glow" },
                { v: "98.2%", l: "Model uptime",  c: "text-success" },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                  className="glass relative overflow-hidden rounded-sm p-3"
                >
                  <div className={`font-display text-2xl font-bold tabular-nums ${s.c}`}>{s.v}</div>
                  <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <LiveIntelFeed />
          </motion.div>
        </div>

        <IntelTicker />
      </section>

      {/* ANALYZER */}
      <section className="relative -mt-20 px-4 pb-24 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="glow-ring mx-auto max-w-4xl rounded-md border border-border bg-background p-6 shadow-elevated md:p-10"
        >
          <div className="mb-6 flex items-baseline justify-between border-b border-border pb-4">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Run an analysis</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              v2 · Gemini · NLP pipeline
            </span>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary">
              <TabsTrigger value="text" className="gap-2"><FileText className="h-4 w-4" />Text</TabsTrigger>
              <TabsTrigger value="url" className="gap-2"><Link2 className="h-4 w-4" />URL</TabsTrigger>
              <TabsTrigger value="headline" className="gap-2"><Newspaper className="h-4 w-4" />Headline</TabsTrigger>
              <TabsTrigger value="source" className="gap-2"><Globe className="h-4 w-4" />Source</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">Headline (optional, enables mismatch detection)</label>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Optional: paste the headline"
                  className="h-11 border-border bg-card font-display text-base"
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">Article body</label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste the full article text here…"
                  className="min-h-[220px] resize-y border-border bg-card font-display text-base leading-relaxed"
                />
              </div>
            </TabsContent>

            <TabsContent value="url" className="mt-6">
              <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">Article URL</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/breaking-news"
                className="h-12 border-border bg-card font-mono text-sm"
              />
              <p className="mt-2 text-xs text-muted-foreground">We'll fetch and analyze the page content.</p>
            </TabsContent>

            <TabsContent value="headline" className="mt-6">
              <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">Headline only</label>
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Scientists discover…"
                className="h-12 border-border bg-card font-display text-lg"
              />
            </TabsContent>

            <TabsContent value="source" className="mt-6">
              <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">Publisher / domain</label>
              <Input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="example-news.com"
                className="h-12 border-border bg-card font-mono text-sm"
              />
            </TabsContent>
          </Tabs>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Tip · Combine headline + body to unlock mismatch detection.
          </p>


          <Button
            onClick={analyze}
            disabled={loading}
            size="lg"
            className="btn-glow group relative mt-8 h-14 w-full font-mono text-xs uppercase tracking-[0.25em]"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Compiling Intelligence Report…</>
            ) : (
              <>
                <ScanSearch className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Initiate Analysis
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>

          {loading && <IntelligenceLoader />}
        </motion.div>

        {/* RESULT */}
        <AnimatePresence>
          {result && (
            <motion.div
              id="result"
              key="result"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-10 max-w-4xl"
            >
              <ResultPanel
                analysis={result.analysis}
                meta={result.meta}
                originalText={result.originalText}
                originalHeadline={result.originalHeadline}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!result && !loading && (
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Authenticity score", text: "0–100 calibrated rating with model confidence." },
              { icon: AlertTriangle, title: "Red & green flags", text: "Concrete linguistic and structural signals." },
              { icon: ShieldAlert, title: "Source credibility", text: "Domain reputation, attribution, citations." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className="tilt group relative overflow-hidden rounded-md border border-border bg-card p-5 shadow-paper"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-crimson-glow/10 blur-2xl transition-all group-hover:bg-crimson-glow/30" />
                <div className="relative">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-ink text-cream transition-transform group-hover:rotate-6 group-hover:scale-110">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default Index;
