import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export type RadarData = {
  source_trust: number;
  language_neutrality: number;
  evidence_strength: number;
  virality_risk: number;
  factual_density: number;
};

export function CredibilityRadar({ data }: { data: RadarData }) {
  // Invert virality_risk so "higher = better" radar is consistent
  const chart = [
    { metric: "Source Trust", value: data.source_trust },
    { metric: "Language Neutrality", value: data.language_neutrality },
    { metric: "Evidence Strength", value: data.evidence_strength },
    { metric: "Low Virality Risk", value: 100 - data.virality_risk },
    { metric: "Factual Density", value: data.factual_density },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chart} outerRadius="75%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontFamily: "JetBrains Mono" }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="value"
            stroke="hsl(var(--crimson))"
            fill="hsl(var(--crimson))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
