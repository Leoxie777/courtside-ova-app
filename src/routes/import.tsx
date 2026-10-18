import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { teams, type Match } from "@/lib/data";
import { normalizeCsv, sampleCsv, detectPlatform, type Platform } from "@/lib/normalize";
import { useStore } from "@/lib/store";
import { PageTitle, Section, btnCls, btnGhost, inputCls, teamName } from "@/components/ui-kit";

export const Route = createFileRoute("/import")({
  head: () => ({
    meta: [
      { title: "Data Import — Courtside" },
      { name: "description", content: "Import tournament CSVs from different platforms into one format." },
      { property: "og:title", content: "Data Import — Courtside" },
      { property: "og:description", content: "Import tournament CSVs from different platforms into one format." },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImportPage,
});

function ImportPage() {
  const { addMatches } = useStore();
  const [platform, setPlatform] = useState<Platform>("tourneymachine");
  const [csv, setCsv] = useState(sampleCsv.tourneymachine);
  const [preview, setPreview] = useState<Match[] | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(0);

  const run = () => {
    setError(""); setDone(0);
    try { setPreview(normalizeCsv(csv, platform, teams)); } catch { setError("Couldn't read this CSV. Check the format."); setPreview(null); }
  };

  const onFile = async (f?: File) => {
    if (!f) return;
    const text = await f.text();
    setCsv(text); setPlatform(detectPlatform(text)); setPreview(null);
  };

  return (
    <>
      <PageTitle title="Import" sub="Normalize CSVs from different tournament platforms" />
      <Section title="1. Source">
        <div className="mb-2 flex gap-2">
          {(["tourneymachine", "volleyhub"] as Platform[]).map((p) => (
            <button key={p} className={platform === p ? btnCls : btnGhost} onClick={() => { setPlatform(p); setCsv(sampleCsv[p]); setPreview(null); }}>
              {p === "tourneymachine" ? "TourneyMachine" : "VolleyHub"}
            </button>
          ))}
        </div>
        <textarea className={`${inputCls} font-mono text-xs`} rows={5} value={csv} onChange={(e) => setCsv(e.target.value)} />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input type="file" accept=".csv,text/csv" className="text-sm" onChange={(e) => onFile(e.target.files?.[0])} />
          <button className={btnCls} onClick={run}>Normalize</button>
        </div>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </Section>
      {preview && (
        <Section title={`2. Normalized (${preview.length})`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted uppercase"><tr>{["Date", "Time", "Court", "Home", "Away", "Status", "Sets"].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {preview.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="px-2 py-2">{m.date}</td><td className="px-2">{m.time}</td><td className="px-2">{m.court}</td>
                    <td className="px-2">{teamName(m.homeId)}</td><td className="px-2">{teamName(m.awayId)}</td>
                    <td className="px-2">{m.status}</td><td className="px-2">{m.sets.map((s) => s.join("-")).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className={`${btnCls} mt-3`} onClick={() => { addMatches(preview); setDone(preview.length); setPreview(null); }}>Add to schedule</button>
        </Section>
      )}
      {done > 0 && <p className="rounded-xl bg-success p-3 text-sm font-semibold text-accent-foreground">Added {done} matches to the schedule.</p>}
    </>
  );
}
