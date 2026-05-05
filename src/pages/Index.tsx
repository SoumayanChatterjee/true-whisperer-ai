import { useEffect, useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ScanSearch, ShieldAlert, ShieldCheck, AlertTriangle, FileText, Link2, Newspaper, Globe, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import heroImg from "@/assets/hero.jpg";
import { ResultPanel, type Analysis } from "@/components/veritas/ResultPanel";
import { Navbar } from "@/components/veritas/Navbar";
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
    <main className="min-h-screen bg-paper">
      <Navbar />
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero text-cream">
        <div className="grain absolute inset-0 opacity-60" />
        <img
          src={heroImg}
          alt="Newspaper fragments dissolving into data particles"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-screen"
        />
        {/* floating glow blobs */}
        <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-crimson-glow/20 blur-3xl float-blob" />
        <div className="pointer-events-none absolute right-0 top-32 h-96 w-96 rounded-full bg-accent/15 blur-3xl float-blob-slow" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl float-blob" />

        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-28 md:pt-24 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cream/80 backdrop-blur pulse-glow">
              <Sparkles className="h-3 w-3 text-crimson-glow animate-pulse" />
              Misinformation intelligence
            </div>
            <h1 className="mt-6 font-display text-5xl font-black leading-[0.95] tracking-tight text-balance md:text-7xl">
              Read the news.
              <br />
              <span className="italic text-gradient">Question</span> the source.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cream/75 text-balance">
              Veritas combines NLP, source credibility heuristics and large language models
              to score articles, URLs and headlines for authenticity in seconds.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-cream/60">
              {[
                { I: ShieldCheck, t: "Linguistic analysis" },
                { I: Globe, t: "Source credibility" },
                { I: ScanSearch, t: "Claim extraction" },
              ].map(({ I, t }, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 transition-colors hover:text-cream"
                >
                  <I className="h-4 w-4 text-crimson-glow" /> {t}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Marquee ticker */}
        <div className="relative overflow-hidden border-y border-cream/10 bg-ink/40 py-2.5 backdrop-blur">
          <div className="marquee font-mono text-[10px] uppercase tracking-[0.3em] text-cream/50">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex shrink-0 items-center gap-12">
                <span>● Live signal model</span>
                <span>◆ Gemini 2.5 · NLP pipeline</span>
                <span>▲ Source credibility heuristics</span>
                <span>● Claim extraction · v2</span>
                <span>◆ Headline-vs-body mismatch</span>
                <span>▲ Reality rewrite engine</span>
                <span>● Narrative pattern detection</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANALYZER */}
      <section className="relative -mt-20 px-4 pb-24 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="glow-ring mx-auto max-w-4xl rounded-md border border-border bg-paper p-6 shadow-elevated md:p-10"
        >
          <div className="mb-6 flex items-baseline justify-between border-b border-border pb-4">
            <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">Run an analysis</h2>
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
            className="group relative mt-8 h-14 w-full overflow-hidden bg-ink text-cream transition-all hover:bg-ink-soft hover:shadow-glow"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-crimson-glow/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing credibility…</>
            ) : (
              <>
                <ScanSearch className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Analyze authenticity
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>

          {loading && (
            <div className="mt-6 space-y-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-1/3 animate-shimmer rounded-full bg-accent/30" />
              </div>
              <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Tokenizing · Extracting claims · Mapping narrative patterns · Drafting rewrite
              </p>
            </div>
          )}
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
                className="rounded-md border border-border bg-card p-5 shadow-paper"
              >
                <f.icon className="h-5 w-5 text-crimson" />
                <h3 className="mt-3 font-display text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-border bg-ink py-8 text-center font-mono text-xs uppercase tracking-[0.25em] text-cream/50">
        Veritas · NLP-assisted misinformation research · Not a substitute for human verification
      </footer>
    </main>
  );
};

export default Index;
