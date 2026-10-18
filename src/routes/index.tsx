import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { useStore } from "@/lib/store";
import { eventFor } from "@/lib/events";
import { AnnouncementCard, Section, fmtDate } from "@/components/ui-kit";
import { SponsorsSection, UrgentAnnouncement } from '@/components/home-extras';
import { followedTeams, nextMatch } from '@/lib/home-features';
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Courtside — Match Day" }, { name: "description", content: "Your selected tournament schedule, teams, venues, scores and announcements." },
    { property: "og:title", content: "Courtside — Match Day" }, { property: "og:description", content: "Your selected tournament schedule, teams, venues, scores and announcements." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Home,
});
function Home() {
  const { followed, matches, announcements, eventId, userId } = useStore();
  const selected = eventFor(eventId);
  const myTeams = followedTeams(followed);
  return <>
    <div className="mb-5 flex items-end justify-between gap-3"><div><p className="text-xs text-primary font-semibold uppercase">{eventId === 'demo' ? 'Sample tournament' : selected.provider}</p><h1 className="text-4xl font-bold uppercase">Match day</h1></div><CalendarDays className="h-9 w-9 text-primary" /></div>
    <UrgentAnnouncement />
    {!userId && <p className="mb-5 text-xs text-muted-foreground">Guest follows last for this visit. <Link className="text-primary" to="/admin">Sign in to save them.</Link></p>}
    <Section title="My Teams">
      {myTeams.length ? <div className="grid gap-3 md:grid-cols-2">{myTeams.map(t => {
        const next = nextMatch(matches, t.id);
        return <Link key={t.id} to="/teams/$teamId" params={{ teamId: t.id }} className="block rounded-lg border bg-card p-3 shadow-sm hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
          <h3 className="text-lg font-bold">{t.name}</h3>
          <p className="text-xs text-muted-foreground">{t.club} · {t.division}</p>
          {next ? <p className="mt-2 text-sm"><span className="font-semibold">Next:</span> {fmtDate(next.date)} · {next.time} · {next.court}</p> : <p className="mt-2 text-sm text-muted-foreground">No upcoming matches.</p>}
        </Link>;
      })}</div> : <p className="text-sm text-muted-foreground">You are not following any teams yet. <Link to="/teams" className="text-primary font-semibold">Browse teams</Link> to follow one.</p>}
    </Section>
    <Section title="Announcements"><div className="space-y-2">{announcements.filter(a=>a.active!==false).map(a => <div key={a.id}><AnnouncementCard a={a} /><Link to="/announcements/$id" params={{id:a.id}} className="mt-1 inline-block text-xs text-primary">View Details →</Link></div>)}{!announcements.some(a=>a.active!==false) && <p className="text-sm text-muted-foreground">No announcements for this event.</p>}</div></Section>
    <SponsorsSection />
  </>;
}
