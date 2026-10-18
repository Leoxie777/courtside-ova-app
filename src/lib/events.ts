import type { Announcement, Match } from './data';

export const events = [
  { id: 'demo', name: 'Fall Classic · Demo', category: 'Indoor', provider: 'Sample data', url: '', detail: 'October 17–18, 2026 · Fictional tournament', verified: false },
  { id: 'aes', name: 'Indoor Ontario Championships', category: 'Indoor', provider: 'AES', url: 'https://results.advancedeventsystems.com/event/MjAyNl9PbnRhcmlvX0NoYW1waW9uc2hpcHNfX19FdmVudF8yX182djZHX19UTFNHX18xNVVCXw2/home', detail: 'Event details awaiting verification', verified: false },
  { id: 'timu', name: '6v6 Girls Bugarski Cup Select A', category: 'Indoor', provider: 'TIMU', url: 'https://www.timu.ca/scoreboards/results.php?tid=3960', detail: 'March 1, 2026 · 9:00 AM · Past event', verified: true },
  { id: 'beach', name: 'Beach Regular Season Tournament', category: 'Beach', provider: 'MyTeam.Click', url: 'https://myteam.click/schedule/69a9c99aa3c28f5a62ef1235', detail: 'Event details awaiting verification', verified: false },
] as const;
export type EventId = typeof events[number]['id'];
export const eventFor = (id: string) => events.find(e => e.id === id) ?? events[0];
export const forEvent = <T extends { eventId?: string }>(rows: T[], id: string) => rows.filter(row => (row.eventId ?? 'demo') === id);
export const forTeams = (rows: Match[], ids: string[]) => rows.filter(m => ids.includes(m.homeId) || ids.includes(m.awayId));
const words = (s: string) => new Set(s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean));
export function similarAnnouncement(candidate: Pick<Announcement, 'title' | 'body' | 'id'>, rows: Announcement[]) {
  const a = words(candidate.title + ' ' + candidate.body);
  return rows.find(row => {
    if (row.id === candidate.id) return false;
    const b = words(row.title + ' ' + row.body);
    const union = new Set([...a, ...b]).size;
    return union > 0 && [...a].filter(w => b.has(w)).length / union >= 0.75;
  });
}
export { players as rosters } from "./rosters";
export const coaches: Record<string, string> = { t1: 'Sam Wilson', t2: 'Robin Martin', t3: 'Jamie Lee' };