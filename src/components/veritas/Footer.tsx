import { Link } from "react-router-dom";
import { ScanSearch, Github, Twitter, Mail, Heart, Coffee } from "lucide-react";

const year = new Date().getFullYear();

const cols = [
  {
    title: "Product",
    links: [
      { to: "/", label: "Analyze" },
      { to: "/dashboard", label: "Dashboard" },
      { to: "/rewrite-lab", label: "Rewrite Lab" },
      { to: "/trends", label: "Trends" },
    ],
  },
  {
    title: "Discover",
    links: [
      { to: "/explore", label: "Explore cases" },
      { to: "/about", label: "Our mission" },
      { to: "/about", label: "Methodology" },
      { to: "/about", label: "Press kit" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/about", label: "Media literacy guide" },
      { to: "/about", label: "Source rating notes" },
      { to: "/about", label: "Citation policy" },
      { to: "/about", label: "Report a false positive" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cream/10 bg-ink text-cream">
      {/* ambient glow */}
      <div className="aurora opacity-30" />
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-crimson-glow/15 blur-3xl float-blob-slow" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl float-blob" />

      {/* top hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-glow/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* manifesto */}
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-cream text-foreground shadow-glow">
                <ScanSearch className="h-4 w-4" />
              </div>
              <span className="font-display text-2xl font-black tracking-tight">
                Verit<span className="text-gradient">as</span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-balance font-display text-lg leading-relaxed text-cream/80">
              We started Veritas because we got tired of forwarding the same fact-check
              link to family group chats. It's a small tool with a stubborn idea:
              <span className="italic text-crimson-glow"> truth deserves better defaults.</span>
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/60">
              Built by a tiny team of journalists, researchers and engineers — the kind
              of people who read the corrections column for fun. Veritas is a research
              instrument, not a verdict. Always read past the score.
            </p>

            {/* socials */}
            <div className="mt-6 flex items-center gap-2">
              {[
                { I: Github, href: "#", label: "GitHub" },
                { I: Twitter, href: "#", label: "Twitter" },
                { I: Mail, href: "mailto:hello@veritas.app", label: "Email" },
              ].map(({ I, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-sm border border-cream/15 bg-cream/5 text-cream/70 transition-all hover:-translate-y-0.5 hover:border-crimson-glow/60 hover:bg-crimson-glow/10 hover:text-cream hover:shadow-glow"
                >
                  <I className="h-4 w-4 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* link columns */}
          <div className="grid gap-8 sm:grid-cols-3">
            {cols.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-crimson-glow">
                  / {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l, i) => (
                    <li key={`${col.title}-${i}`}>
                      <Link
                        to={l.to}
                        className="group inline-flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-cream"
                      >
                        <span className="h-px w-3 bg-cream/30 transition-all group-hover:w-6 group-hover:bg-crimson-glow" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* newsletter pitch — human voiced */}
        <div className="mt-14 grid gap-6 rounded-sm border border-cream/10 bg-cream/5 p-6 backdrop-blur md:grid-cols-[2fr_1fr] md:items-center">
          <div>
            <h3 className="font-display text-2xl font-bold">
              The <span className="text-gradient">Field Notes</span> letter
            </h3>
            <p className="mt-2 max-w-xl text-sm text-cream/70">
              One Sunday email. New manipulation patterns we caught that week, a
              short reading list, and one thing we got wrong. No spam. No tracking
              pixels. Unsubscribe in one click — we mean it.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="you@somewhere.com"
              className="h-11 flex-1 rounded-sm border border-cream/15 bg-ink/60 px-3 font-mono text-xs text-cream placeholder:text-cream/40 focus:border-crimson-glow/60 focus:outline-none focus:ring-2 focus:ring-crimson-glow/30"
            />
            <button
              type="submit"
              className="group h-11 rounded-sm bg-cream px-5 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-all hover:bg-crimson-glow hover:text-cream hover:shadow-glow"
            >
              Subscribe →
            </button>
          </form>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-cream/10 pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-cream/50 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>© {year} Veritas Lab</span>
            <Link to="/about" className="hover:text-cream">Privacy</Link>
            <Link to="/about" className="hover:text-cream">Terms</Link>
            <Link to="/about" className="hover:text-cream">Ethics charter</Link>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              All systems normal
            </span>
          </div>
          <p className="flex items-center gap-1.5 normal-case tracking-normal text-cream/60">
            Made with <Heart className="h-3 w-3 fill-crimson-glow text-crimson-glow" /> &
            entirely too much <Coffee className="h-3 w-3" /> in a small studio off a
            noisy street.
          </p>
        </div>

        {/* tiny disclaimer line */}
        <p className="mt-4 text-center text-[10px] leading-relaxed text-cream/35 md:text-left">
          Veritas is an NLP-assisted research instrument. It is not a court, an
          editor, or your conscience. Treat every score as a starting point — then
          read the article, check the source, and ask a human you trust.
        </p>
      </div>
    </footer>
  );
}
