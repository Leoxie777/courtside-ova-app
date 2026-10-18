import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { MatchCard, PageTitle, Section } from "@/components/ui-kit";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Live Results — Courtside" },
      { name: "description", content: "Live scores and final results from every court." },
      { property: "og:title", content: "Live Results — Courtside" },
      { property: "og:description", content: "Live scores and final results from every court." },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Results,
});

function Results() {
  const { matches } = useStore();
  const live = matches.filter((m) => m.status === "live");
  const final = matches.filter((m) => m.status === "final").reverse();
  return (
    <>
      <PageTitle title="Live" sub="Scores update automatically (simulated)" />
      <Section title={`On court now (${live.length})`}>
        <div className="grid gap-2 md:grid-cols-2">
          {live.length ? live.map((m) => <MatchCard key={m.id} m={m} />) : <p className="text-sm text-muted-foreground">No live matches right now.</p>}
        </div>
      </Section>
      <Section title="Recent Result">
        <div className="grid gap-2 md:grid-cols-2">{final.map((m) => <MatchCard key={m.id} m={m} />)}</div>
      </Section>
    </>
  );
}
