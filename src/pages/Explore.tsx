import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/veritas/Navbar";

const CASES = [
  {
    id: "miracle-cure",
    title: "SHOCKING: Doctors HATE this miracle cure that erases diabetes overnight!",
    tag: "Health misinformation",
    body: `In a stunning revelation that BIG PHARMA doesn't want you to know, a simple kitchen ingredient has been shown to ERASE diabetes overnight. Thousands have already tried this miracle cure, and the results are mind-blowing. Doctors are FURIOUS that this secret is finally getting out. Click now before this page is taken down forever!!!`,
    accent: "border-danger/40",
  },
  {
    id: "election-rumor",
    title: "BREAKING: Anonymous insider reveals rigged election plot",
    tag: "Political propaganda",
    body: `An anonymous source close to the campaign has revealed what they call "incontrovertible proof" that the upcoming election is being rigged by a shadowy cabal of elites. The source, who refused to be named or provide documents, says the truth will shock the nation. Patriots must act now before it's too late.`,
    accent: "border-warning/40",
  },
  {
    id: "credible-science",
    title: "NASA's Webb telescope detects water vapor on distant exoplanet",
    tag: "Likely credible",
    body: `Astronomers using NASA's James Webb Space Telescope have detected water vapor in the atmosphere of exoplanet K2-18b, located 120 light-years away. The findings, published in The Astrophysical Journal Letters, were corroborated by observations from the European Space Agency. Lead researcher Dr. Nikku Madhusudhan emphasized the results require further verification.`,
    accent: "border-success/40",
  },
  {
    id: "celebrity-death",
    title: "BREAKING: Famous actor dies in tragic accident — fans devastated",
    tag: "Hoax / clickbait",
    body: `Reports are flooding social media that beloved actor [Name] has died in a tragic accident. No major news outlet has confirmed the story, and the actor's representatives have not responded. The same hoax circulated last year. Be cautious before sharing.`,
    accent: "border-warning/40",
  },
  {
    id: "climate-denial",
    title: "Scientists ADMIT climate change is a complete hoax",
    tag: "Science denial",
    body: `In a bombshell report, "scientists" have finally admitted what skeptics have known all along: climate change is a complete hoax engineered to control the population. The report, shared widely on alternative media, cherry-picks one quote out of context from a 2008 paper. Mainstream media refuses to cover it.`,
    accent: "border-danger/40",
  },
  {
    id: "verified-econ",
    title: "Federal Reserve raises interest rates by 0.25%, citing inflation data",
    tag: "Likely credible",
    body: `The Federal Reserve announced on Wednesday a 0.25 percentage point increase to its benchmark interest rate, citing persistent inflation data from the latest CPI report. Chair Jerome Powell stated in a press conference that further rate decisions will depend on incoming labor market and price data over the coming months.`,
    accent: "border-success/40",
  },
];

export default function Explore() {
  const nav = useNavigate();

  const tryCase = (body: string) => {
    sessionStorage.setItem("veritas:prefill", JSON.stringify({ tab: "text", text: body }));
    nav("/");
  };

  return (
    <main className="min-h-screen bg-mesh">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground pulse-glow">
            <Beaker className="h-3 w-3 text-crimson animate-pulse" /> Demo gallery
          </div>
          <h1 className="mt-3 font-display text-4xl font-black text-ink md:text-5xl">
            Expl<span className="text-gradient">ore</span>
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Hand-picked examples showing how Veritas detects fake, mixed, and credible content.
            Click <em>Run analysis</em> to send a case to the analyzer.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`tilt group relative flex flex-col overflow-hidden rounded-md border border-l-4 bg-card p-5 shadow-paper ${c.accent}`}
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-crimson-glow/10 blur-2xl transition-all group-hover:bg-crimson-glow/25" />
              <div className="relative flex flex-1 flex-col">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{c.tag}</span>
                <h3 className="mt-2 font-display text-lg font-bold text-ink leading-snug">{c.title}</h3>
                <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">{c.body}</p>
                <Button
                  onClick={() => tryCase(c.body)}
                  size="sm"
                  className="group/btn relative mt-5 self-start overflow-hidden bg-ink text-cream hover:bg-ink-soft hover:shadow-glow"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-crimson-glow/40 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                  Run analysis <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
