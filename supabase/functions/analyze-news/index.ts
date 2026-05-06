// Edge function: analyzes content for fake news signals via Lovable AI
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ReqBody {
  text?: string;
  url?: string;
  headline?: string;
  source?: string;
}

async function fetchUrlText(url: string): Promise<{ text: string; title?: string; domain?: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; VeritasBot/1.0; +https://veritas.app)",
      },
      redirect: "follow",
    });
    const html = await res.text();
    // Strip scripts/styles
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
    const titleMatch = cleaned.match(/<title>([^<]*)<\/title>/i);
    const text = cleaned
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);
    let domain = "";
    try {
      domain = new URL(url).hostname.replace(/^www\./, "");
    } catch (_) { /* noop */ }
    return { text, title: titleMatch?.[1]?.trim(), domain };
  } catch (e) {
    console.error("fetchUrlText error:", e);
    return { text: "" };
  }
}

const SYSTEM_PROMPT = `You are Veritas, an expert misinformation analyst trained in NLP, journalism, forensic linguistics, and source credibility analysis.

Analyze the provided content rigorously for signs of fake news, misinformation, propaganda, or manipulation. Consider:
- Linguistic markers: sensationalism, emotional manipulation, loaded language, ALL-CAPS, excessive punctuation
- Logical structure: verifiable claims vs unsupported assertions
- Source credibility: domain reputation, transparency, author attribution
- Citation quality: links to primary sources, named experts, verifiable evidence
- Sentiment & bias: neutral reporting vs partisan framing
- Plausibility: extraordinary claims requiring extraordinary evidence
- Narrative patterns: fear-mongering, political bias, propaganda tone, conspiracy framing, us-vs-them rhetoric, urgency manipulation
- Headline vs body coherence: clickbait, exaggeration, misrepresentation
- Suspicious words: emotionally loaded or manipulative tokens worth highlighting

Also produce:
- "signal_explanations": for EACH signal (linguistic_score, source_credibility, evidence_quality, sentiment_bias, plausibility), a 1-2 sentence rationale and 2-4 short evidence bullets quoting or citing concrete observations from the input (e.g. "Quotes 'BREAKING' and 3 exclamation marks", "Domain ap.org has high journalistic reputation", "No named sources or links to primary documents").
- A "rewritten_neutral" version of the content stripped of bias and sensationalism (factual tone, similar length, keep verifiable facts).
- A "truth_evolution" timeline (3-4 stages) hypothesizing how the claim likely evolved from original facts -> modified narrative -> viral/distorted version.
- A "headline_body_mismatch" score (0=fully matches, 100=severely misleading) with explanation, only if both a headline and body exist; otherwise score 0 and note "n/a".
- A "bias_tone" object capturing political_bias (-100=far left, 0=center, 100=far right) plus a label, an emotional_tone label (one of: neutral, fear, anger, hope, outrage, sadness, mockery), tone_intensity (0-100), and a 1-2 sentence rationale.
- A "fake_reasons" object grouping the strongest "why this might be fake" signals into 3 buckets: emotional_language (array of short bullets), clickbait_patterns (array), missing_sources (array). Leave arrays empty if not applicable.

Be calibrated, fair, and precise. Score 0 = certainly fake/manipulative, 100 = highly credible verified reporting.`;

const TOOL_SCHEMA = {
  type: "function" as const,
  function: {
    name: "report_authenticity",
    description: "Return a structured authenticity analysis.",
    parameters: {
      type: "object",
      properties: {
        authenticity_score: {
          type: "number",
          description: "Overall authenticity score 0-100 (100 = most credible)",
        },
        verdict: {
          type: "string",
          enum: ["likely_authentic", "mixed", "questionable", "likely_fake"],
        },
        confidence: { type: "number", description: "0-100 model confidence" },
        summary: { type: "string", description: "2-3 sentence overall assessment" },
        signals: {
          type: "object",
          properties: {
            linguistic_score: { type: "number", description: "0-100, higher = more neutral/professional" },
            source_credibility: { type: "number", description: "0-100, higher = more credible publisher" },
            evidence_quality: { type: "number", description: "0-100, higher = better citations/evidence" },
            sentiment_bias: { type: "number", description: "0-100, higher = less biased" },
            plausibility: { type: "number", description: "0-100, higher = more plausible" },
          },
          required: [
            "linguistic_score",
            "source_credibility",
            "evidence_quality",
            "sentiment_bias",
            "plausibility",
          ],
          additionalProperties: false,
        },
        signal_explanations: {
          type: "object",
          description: "For each signal, a short rationale (1-2 sentences) and 2-4 concrete evidence bullets (quotes, observations, domain reputation notes) drawn from the input.",
          properties: {
            linguistic_score: {
              type: "object",
              properties: {
                rationale: { type: "string" },
                evidence: { type: "array", items: { type: "string" } },
              },
              required: ["rationale", "evidence"],
              additionalProperties: false,
            },
            source_credibility: {
              type: "object",
              properties: {
                rationale: { type: "string" },
                evidence: { type: "array", items: { type: "string" } },
              },
              required: ["rationale", "evidence"],
              additionalProperties: false,
            },
            evidence_quality: {
              type: "object",
              properties: {
                rationale: { type: "string" },
                evidence: { type: "array", items: { type: "string" } },
              },
              required: ["rationale", "evidence"],
              additionalProperties: false,
            },
            sentiment_bias: {
              type: "object",
              properties: {
                rationale: { type: "string" },
                evidence: { type: "array", items: { type: "string" } },
              },
              required: ["rationale", "evidence"],
              additionalProperties: false,
            },
            plausibility: {
              type: "object",
              properties: {
                rationale: { type: "string" },
                evidence: { type: "array", items: { type: "string" } },
              },
              required: ["rationale", "evidence"],
              additionalProperties: false,
            },
          },
          required: ["linguistic_score", "source_credibility", "evidence_quality", "sentiment_bias", "plausibility"],
          additionalProperties: false,
        },
        red_flags: {
          type: "array",
          items: { type: "string" },
          description: "Specific concerning patterns detected",
        },
        green_flags: {
          type: "array",
          items: { type: "string" },
          description: "Positive credibility indicators",
        },
        key_claims: {
          type: "array",
          items: {
            type: "object",
            properties: {
              claim: { type: "string" },
              verifiability: { type: "string", enum: ["verifiable", "partially_verifiable", "unverifiable"] },
            },
            required: ["claim", "verifiability"],
            additionalProperties: false,
          },
        },
        recommendations: {
          type: "array",
          items: { type: "string" },
          description: "Actions a reader should take to verify",
        },
        radar: {
          type: "object",
          description: "Credibility radar metrics 0-100 (higher = better)",
          properties: {
            source_trust: { type: "number" },
            language_neutrality: { type: "number" },
            evidence_strength: { type: "number" },
            virality_risk: { type: "number", description: "0-100, higher = MORE viral/risky (inverted)" },
            factual_density: { type: "number" },
          },
          required: ["source_trust", "language_neutrality", "evidence_strength", "virality_risk", "factual_density"],
          additionalProperties: false,
        },
        narrative_patterns: {
          type: "array",
          description: "Detected narrative/propaganda patterns",
          items: {
            type: "object",
            properties: {
              label: { type: "string", description: "Short tag e.g. 'Fear-based language'" },
              severity: { type: "string", enum: ["low", "medium", "high"] },
              evidence: { type: "string", description: "1-sentence why" },
            },
            required: ["label", "severity", "evidence"],
            additionalProperties: false,
          },
        },
        suspicious_words: {
          type: "array",
          description: "Loaded/manipulative words/phrases found in the text (lowercase, max 12)",
          items: { type: "string" },
        },
        headline_body_mismatch: {
          type: "object",
          properties: {
            score: { type: "number", description: "0=match, 100=severe mismatch" },
            explanation: { type: "string" },
          },
          required: ["score", "explanation"],
          additionalProperties: false,
        },
        rewritten_neutral: {
          type: "string",
          description: "Neutral, factual rewrite of the input (similar length).",
        },
        truth_evolution: {
          type: "array",
          description: "3-4 stages showing how the claim may have evolved",
          items: {
            type: "object",
            properties: {
              stage: { type: "string", enum: ["origin", "modified", "amplified", "viral"] },
              title: { type: "string" },
              description: { type: "string" },
            },
            required: ["stage", "title", "description"],
            additionalProperties: false,
          },
        },
        bias_tone: {
          type: "object",
          description: "Political bias and emotional tone analysis",
          properties: {
            political_bias: { type: "number", description: "-100 (far left) to 100 (far right), 0 = center" },
            political_label: { type: "string", enum: ["far_left", "left", "center_left", "center", "center_right", "right", "far_right", "unclear"] },
            emotional_tone: { type: "string", enum: ["neutral", "fear", "anger", "hope", "outrage", "sadness", "mockery"] },
            tone_intensity: { type: "number", description: "0-100, how strong the emotion is" },
            rationale: { type: "string" },
          },
          required: ["political_bias", "political_label", "emotional_tone", "tone_intensity", "rationale"],
          additionalProperties: false,
        },
        fake_reasons: {
          type: "object",
          description: "Why this might be fake, grouped into emotional_language, clickbait_patterns, missing_sources",
          properties: {
            emotional_language: { type: "array", items: { type: "string" } },
            clickbait_patterns: { type: "array", items: { type: "string" } },
            missing_sources: { type: "array", items: { type: "string" } },
          },
          required: ["emotional_language", "clickbait_patterns", "missing_sources"],
          additionalProperties: false,
        },
      },
      required: [
        "authenticity_score",
        "verdict",
        "confidence",
        "summary",
        "signals",
        "signal_explanations",
        "red_flags",
        "green_flags",
        "key_claims",
        "recommendations",
        "radar",
        "narrative_patterns",
        "suspicious_words",
        "headline_body_mismatch",
        "rewritten_neutral",
        "truth_evolution",
        "bias_tone",
        "fake_reasons",
      ],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const body = (await req.json()) as ReqBody;
    let { text, url, headline, source } = body;

    let fetchedTitle: string | undefined;
    let fetchedDomain: string | undefined;
    if (url && (!text || text.trim().length < 50)) {
      const f = await fetchUrlText(url);
      if (f.text) text = f.text;
      fetchedTitle = f.title;
      fetchedDomain = f.domain;
    }

    if (!text && !headline && !source && !url) {
      return new Response(
        JSON.stringify({ error: "Provide at least one of: text, url, headline, source." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userContent = [
      headline ? `HEADLINE:\n${headline}` : null,
      source || fetchedDomain ? `SOURCE / DOMAIN:\n${source || fetchedDomain}` : null,
      url ? `URL:\n${url}` : null,
      fetchedTitle ? `PAGE TITLE:\n${fetchedTitle}` : null,
      text ? `ARTICLE TEXT:\n${text.slice(0, 8000)}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        tools: [TOOL_SCHEMA],
        tool_choice: { type: "function", function: { name: "report_authenticity" } },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (aiRes.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Add credits to your Lovable workspace." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "Model did not return structured analysis" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const analysis = JSON.parse(toolCall.function.arguments);
    return new Response(
      JSON.stringify({
        analysis,
        meta: {
          analyzed_url: url || null,
          fetched_domain: fetchedDomain || null,
          fetched_title: fetchedTitle || null,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("analyze-news error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
