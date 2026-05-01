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
- Logical structure: presence of verifiable claims vs unsupported assertions
- Source credibility: domain reputation, transparency, author attribution
- Citation quality: links to primary sources, named experts, verifiable evidence
- Sentiment & bias: neutral reporting vs partisan framing
- Plausibility: extraordinary claims requiring extraordinary evidence
- Temporal markers: recency, dateline, freshness signals

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
      },
      required: [
        "authenticity_score",
        "verdict",
        "confidence",
        "summary",
        "signals",
        "red_flags",
        "green_flags",
        "key_claims",
        "recommendations",
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
