import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Car, Map, ExternalLink } from "lucide-react";
import { useStore } from "@/lib/store";
import { eventFor } from "@/lib/events";
import { AnnouncementCard, PageTitle, Section } from "@/components/ui-kit";
export const Route = createFileRoute("/event")({ head: () => ({ meta: [
  { title: "Event & Venue Details — Courtside" }, { name: "description", content: "Selected event sources, confirmed venue details and tournament announcements." },
  { property: "og:title", content: "Event & Venue Details — Courtside" }, { property: "og:description", content: "Selected event sources, confirmed venue details and tournament announcements." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
]}), component: EventInfo });
function EventInfo() {
  const { eventId, announcements } = useStore(); const event = eventFor(eventId);
  return <><PageTitle title="Event details" sub={event.name} />
    <Section title="Tournament"><div className="border-y py-4 space-y-2"><p>{event.detail}</p><p className="text-sm text-muted-foreground">{eventId==='demo'?'All teams, matches and rosters in this event are fictional.':'Automatic synchronization is not connected. Source access is awaiting confirmation.'}</p>{event.url && <a href={event.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary text-sm">Open {event.provider}<ExternalLink className="h-4 w-4" /></a>}</div></Section>
    <Section title="Venue & arrival"><div className="divide-y border-y">{[{ icon: MapPin, title:'Venue & Google Maps', body:'Venue name and address awaiting confirmation. Directions are unavailable until verified.' },{ icon:Car,title:'Parking',body:'Parking lot address, fees and entrance instructions have not been verified.' },{icon:Map,title:'Court & division map',body:'An official venue plan has not been provided for this event.'}].map(({icon:Icon,title,body}) => <div key={title} className="flex gap-3 py-4"><Icon className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><h3 className="text-xl font-bold">{title}</h3><p className="text-sm text-muted-foreground">{body}</p></div></div>)}</div></Section>
    <Section title="Announcements"><div className="space-y-2">{announcements.filter(a=>a.active!==false).map(a=><AnnouncementCard key={a.id} a={a} />)}{!announcements.some(a=>a.active!==false) && <p className="text-muted-foreground text-sm">No event announcements.</p>}</div></Section></>;
}
