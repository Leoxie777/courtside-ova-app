import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { MatchCard, PageTitle, fmtDate } from "@/components/ui-kit";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Match Schedule — Courtside" },
      { name: "description", content: "Match dates, times and courts for the tournament." },
      { property: "og:title", content: "Match Schedule — Courtside" },
      { property: "og:description", content: "Match dates, times and courts for the tournament." },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Schedule,
});

function Schedule() {
  const { matches, followed } = useStore();
  const [mineOnly, setMineOnly] = useState(false);
  const list = matches.filter((m) => !mineOnly || followed.includes(m.homeId) || followed.includes(m.awayId));
  const days = [...new Set(list.map((m) => m.date))];
  return (
    <>
      <PageTitle title="Schedule" />
      <div className="mb-4 inline-flex rounded-full border bg-card p-1">
        {[["All matches", false], ["My teams", true]].map(([label, v]) => (
          <button key={String(v)} onClick={() => setMineOnly(v as boolean)} className={`rounded-full px-4 py-1.5 text-sm font-bold ${mineOnly === v ? "bg-ink text-ink-foreground" : "text-muted-foreground"}`}>{label as string}</button>
        ))}
      </div>
      {days.map((d) => (
        <section key={d} className="mb-5">
          <h2 className="mb-2 text-lg font-bold uppercase text-muted-foreground">{fmtDate(d)}</h2>
          <div className="grid gap-2 md:grid-cols-2">{list.filter((m) => m.date === d).map((m) => <MatchCard key={m.id} m={m} />)}</div>
        </section>
      ))}
      {!list.length && <p className="text-sm text-muted-foreground">No matches for your followed teams.</p>}
    </>
  );
}
