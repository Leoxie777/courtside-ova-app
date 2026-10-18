import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { searchTeams } from '@/lib/home-features';
import { Button } from '@/components/ui/button';
import { rosterFor } from "@/lib/rosters";
import { useStore } from "@/lib/store";
import { volleyballCategories, categoryFor, categoryOverrides, type VolleyballCategory } from "@/lib/categories";
import { PageTitle, Section, inputCls } from "@/components/ui-kit";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Follow Teams — Courtside" },
      { name: "description", content: "Search and follow OVA volleyball teams." },
      { property: "og:title", content: "Follow Teams — Courtside" },
      { property: "og:description", content: "Search and follow OVA volleyball teams." },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Teams,
});

function Teams() {
  const { followed, toggleFollow } = useStore();
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [category, setCategory] = useState<VolleyballCategory | 'all'>('all');
  const overrides = categoryOverrides();
  const list = searchTeams(q).filter(({ team }) => category === 'all' || categoryFor(team.id, overrides) === category);
  return (
    <>
      <PageTitle title="Teams" sub={`Following ${followed.length}`} />
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input aria-label="Search teams or players" className={`${inputCls} pl-9`} placeholder="Search teams, clubs, players" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <Section title="Volleyball Categories">
        <p className="mb-2 text-xs text-muted-foreground">Fictional demonstration assignments — not verified OVA classifications.</p>
        <div role="tablist" aria-label="Volleyball categories" className="flex flex-wrap gap-2">
          {(['all', ...volleyballCategories] as const).map(c => (
            <button key={c} role="tab" aria-selected={category === c} onClick={() => setCategory(c)} className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${category === c ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}>{c === 'all' ? 'All categories' : c}</button>
          ))}
        </div>
      </Section>
      <div className="space-y-2">
        {list.map(({team:t, matchingPlayers}) => {
          const on = followed.includes(t.id);
          const open = expanded === t.id;
          const roster = rosterFor(t.id);
          return (
            <div key={t.id} className="rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between gap-2">
                <Link to="/teams/$teamId" params={{teamId:t.id}} className="min-w-0 flex-1 text-left">
                  <span className="break-words">
                    <span className="block font-semibold">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.club} · {t.division} · {categoryFor(t.id, overrides)}</span>
                  </span>
                </Link>
                <Button size="sm" variant={on?'default':'outline'} onClick={() => void toggleFollow(t.id)}>
                  {on ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{on ? "Following" : "Follow"}
                </Button>
              </div>
              {!!matchingPlayers.length && <ul className="mt-3 space-y-1 border-t pt-2 text-sm">{matchingPlayers.map(p=><li key={p.id}><Link className="text-primary" to="/teams/$teamId" params={{teamId:t.id}}>#{p.number} · {p.name}</Link></li>)}</ul>}
              <Button size="sm" variant="ghost" className="mt-2" aria-expanded={open} onClick={()=>setExpanded(open?null:t.id)}><ChevronDown className={open?'rotate-180':''} />Roster · demo data</Button>
              {open && (
                <div className="mt-3 border-t pt-3">
                  <p className="mb-2 text-xs uppercase text-muted-foreground">Roster · demo data</p>
                  {roster.length ? (
                    <ul className="divide-y text-sm">
                      {roster.map((p) => (
                        <li key={p.id} className="flex items-center gap-3 py-1.5">
                          <span className="w-8 font-bold text-primary">#{p.number}</span>
                          <span className="flex-1">{p.name}</span>
                          <span className="text-xs text-muted-foreground">{p.position}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-muted-foreground">No roster available.</p>}
                </div>
              )}
            </div>
          );
        })}
        {!list.length && <p className="text-sm text-muted-foreground">No teams match "{q}"{category !== 'all' ? ` in ${category}` : ''}.</p>}
      </div>
    </>
  );
}
