import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Wand2, ArrowRight, FileText, Sparkles, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/veritas/Navbar";
import { Footer } from "@/components/veritas/Footer";
import { toast } from "sonner";

export default function RewriteLab() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [original, setOriginal] = useState("");
  const [rewritten, setRewritten] = useState("");
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!text.trim()) {
      toast.error("Paste an article or headline to rewrite.");
      return;
    }
    setLoading(true);
    setRewritten("");
    try {
      const { data, error } = await supabase.functions.invoke("analyze-news", {
        body: { text: text.trim() },
      });
      if (error) throw error;
      const a = (data as any)?.analysis;
      const neutral = a?.rewritten_neutral || "No neutral rewrite was returned for this input.";
      setOriginal(text.trim());
      setRewritten(neutral);
    } catch (e: any) {
      toast.error(e?.message ?? "Rewrite failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!rewritten) return;
    await navigator.clipboard.writeText(rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="min-h-screen bg-mesh">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground pulse-glow">
            <Wand2 className="h-3 w-3 text-crimson animate-pulse" /> Rewrite lab
          </div>
          <h1 className="mt-3 font-display text-4xl font-black text-foreground md:text-5xl">
            Rewrite to <span className="text-gradient">Truth</span>
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Paste a sensational headline or article. Veritas will rewrite it in a calm, neutral,
            evidence-aware tone — so you can compare manipulation side-by-side with reality.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glow-ring rounded-md border border-border bg-background p-6 shadow-elevated"
        >
          <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Source text
          </label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a sensational article, headline or claim…"
            className="min-h-[160px] resize-y border-border bg-card font-display text-base leading-relaxed"
          />
          <Button
            onClick={run}
            disabled={loading}
            size="lg"
            className="group relative mt-5 h-12 w-full overflow-hidden bg-ink text-cream hover:bg-ink-soft hover:shadow-glow"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-crimson-glow/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Rewriting in neutral tone…</>
            ) : (
              <><Sparkles className="mr-2 h-5 w-5" /> Rewrite to truth</>
            )}
          </Button>
        </motion.div>

        <AnimatePresence>
          {(original || rewritten) && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-stretch"
            >
              <motion.article
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="tilt relative overflow-hidden rounded-md border border-l-4 border-danger/40 bg-card p-5 shadow-paper"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-danger/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-danger">
                    <FileText className="h-3 w-3" /> Original — manipulative
                  </div>
                  <p className="mt-3 whitespace-pre-wrap font-display text-base leading-relaxed text-foreground">
                    {original}
                  </p>
                </div>
              </motion.article>

              <div className="hidden items-center justify-center md:flex">
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="rounded-full border border-border bg-background p-2 shadow-glow"
                >
                  <ArrowRight className="h-5 w-5 text-crimson" />
                </motion.div>
              </div>

              <motion.article
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="tilt relative overflow-hidden rounded-md border border-l-4 border-success/40 bg-card p-5 shadow-paper"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-success/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-success">
                      <Sparkles className="h-3 w-3" /> Rewritten — neutral
                    </div>
                    <Button size="sm" variant="ghost" onClick={copy} className="h-7 px-2">
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap font-display text-base leading-relaxed text-foreground">
                    {rewritten || (loading ? "…" : "")}
                  </p>
                </div>
              </motion.article>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <Footer />
    </main>
  );
}
