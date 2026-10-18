import { teams, type Announcement, type Match } from './data';
import { rosterFor } from './rosters';

export function searchTeams(query: string) {
  const q = query.trim().toLocaleLowerCase();
  return teams.flatMap(team => {
    const matchingPlayers = q ? rosterFor(team.id).filter(p => p.name.toLocaleLowerCase().includes(q)) : [];
    const matchesTeam = `${team.name} ${team.club} ${team.division}`.toLocaleLowerCase().includes(q);
    return matchesTeam || matchingPlayers.length ? [{ team, matchingPlayers }] : [];
  });
}
export const followedTeams = (ids: string[]) => teams.filter(t => ids.includes(t.id));
export const nextMatch = (rows: Match[], id: string) => rows.filter(m => m.status !== 'final' && (m.homeId === id || m.awayId === id)).sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time))[0];
export const nextUrgent = (rows: Announcement[], dismissed: string[]) => rows.find(a => a.priority === 'urgent' && a.active !== false && !dismissed.includes(a.id));
export const mergeAnnouncements = (fixtures: Announcement[], saved: Announcement[]) => [...new Map([...fixtures, ...saved].map(a => [a.id, a])).values()];