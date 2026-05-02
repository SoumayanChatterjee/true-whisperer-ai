import { useMemo } from "react";

export function HighlightedText({
  text,
  suspicious,
  className,
}: {
  text: string;
  suspicious: string[];
  className?: string;
}) {
  const parts = useMemo(() => {
    if (!text) return [];
    const words = suspicious.filter(Boolean).map((w) => w.trim()).filter((w) => w.length > 1);
    if (words.length === 0) return [{ text, hit: false }];
    const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const re = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
    const out: { text: string; hit: boolean }[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push({ text: text.slice(last, m.index), hit: false });
      out.push({ text: m[0], hit: true });
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push({ text: text.slice(last), hit: false });
    return out;
  }, [text, suspicious]);

  return (
    <p className={className}>
      {parts.map((p, i) =>
        p.hit ? (
          <mark
            key={i}
            className="rounded-sm bg-danger/15 px-0.5 text-danger underline decoration-danger/40 decoration-wavy underline-offset-2"
          >
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </p>
  );
}
