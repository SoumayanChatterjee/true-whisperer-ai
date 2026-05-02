import type { Analysis } from "@/components/veritas/ResultPanel";

export type HistoryEntry = {
  id: string;
  created_at: string;
  input_kind: "text" | "url" | "headline" | "source";
  input_preview: string;
  analysis: Analysis;
  meta: any;
};

const KEY = "veritas:history";

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveAnalysis(entry: Omit<HistoryEntry, "id" | "created_at">) {
  const list = loadHistory();
  const next: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  list.unshift(next);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 100)));
  return next;
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}

export function verdictBucket(score: number): "real" | "mixed" | "fake" {
  if (score >= 65) return "real";
  if (score >= 40) return "mixed";
  return "fake";
}
