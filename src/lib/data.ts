export type Team = { id: string; name: string; club: string; division: string; category?: string };
export type MatchStatus = "scheduled" | "live" | "final";
export type Match = {
  eventId?: string;
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  court: string;
  homeId: string;
  awayId: string;
  status: MatchStatus;
  sets: [number, number][];
  source?: string;
};
export type Announcement = { id: string; title: string; body: string; priority: "normal" | "urgent"; createdAt: string; eventId?: string; active?: boolean };

export const teams: Team[] = [
  { id: "t1", name: "Toronto Thunder 16U", club: "Toronto Thunder VC", division: "16U Girls" },
  { id: "t2", name: "Ottawa Fusion 16U", club: "Ottawa Fusion", division: "16U Girls" },
  { id: "t3", name: "Hamilton Spikers 16U", club: "Hamilton Spikers", division: "16U Girls" },
  { id: "t4", name: "London Lightning 16U", club: "London Lightning", division: "16U Girls" },
  { id: "t5", name: "Mississauga Titans 17U", club: "Mississauga Titans", division: "17U Boys" },
  { id: "t6", name: "Kitchener Kodiaks 17U", club: "KW Kodiaks", division: "17U Boys" },
  { id: "t7", name: "Barrie Blaze 17U", club: "Barrie Blaze", division: "17U Boys" },
  { id: "t8", name: "Kingston Kraken 17U", club: "Kingston Kraken", division: "17U Boys" },
  { id: "t9", name: "Durham Attack 18U", club: "Durham Attack", division: "18U Girls" },
  { id: "t10", name: "Windsor Waves 18U", club: "Windsor Waves", division: "18U Girls" },
];

export const initialMatches: Match[] = [
  { id: "m1", date: "2026-10-17", time: "08:00", court: "Court 1", homeId: "t1", awayId: "t2", status: "final", sets: [[25, 21], [22, 25], [15, 11]] },
  { id: "m2", date: "2026-10-17", time: "08:00", court: "Court 2", homeId: "t5", awayId: "t6", status: "final", sets: [[25, 18], [25, 20]] },
  { id: "m3", date: "2026-10-17", time: "09:30", court: "Court 1", homeId: "t3", awayId: "t4", status: "live", sets: [[25, 23], [12, 14]] },
  { id: "m4", date: "2026-10-17", time: "09:30", court: "Court 3", homeId: "t7", awayId: "t8", status: "live", sets: [[18, 20]] },
  { id: "m5", date: "2026-10-17", time: "11:00", court: "Court 1", homeId: "t1", awayId: "t3", status: "scheduled", sets: [] },
  { id: "m6", date: "2026-10-17", time: "11:00", court: "Court 2", homeId: "t9", awayId: "t10", status: "scheduled", sets: [] },
  { id: "m7", date: "2026-10-17", time: "12:30", court: "Court 2", homeId: "t5", awayId: "t7", status: "scheduled", sets: [] },
  { id: "m8", date: "2026-10-17", time: "14:00", court: "Court 1", homeId: "t2", awayId: "t4", status: "scheduled", sets: [] },
  { id: "m9", date: "2026-10-18", time: "09:00", court: "Court 1", homeId: "t1", awayId: "t4", status: "scheduled", sets: [] },
  { id: "m10", date: "2026-10-18", time: "09:00", court: "Court 3", homeId: "t6", awayId: "t8", status: "scheduled", sets: [] },
  { id: "m11", date: "2026-10-18", time: "10:30", court: "Court 2", homeId: "t9", awayId: "t1", status: "scheduled", sets: [] },
];

export const initialAnnouncements: Announcement[] = [
  { id: "00000000-0000-4000-8000-000000000004", eventId: "demo", title: "Court 4 Schedule Change", body: "Demo notice: Court 4 matches move 20 minutes later. Check with the tournament desk before your next match.", priority: "urgent", active: true, createdAt: "2026-10-17T23:00:00Z" },
  { id: "a1", title: "Court 3 delayed 15 minutes", body: "Floor maintenance on Court 3. All matches shifted by 15 minutes.", priority: "urgent", createdAt: "2026-10-17T08:45:00" },
  { id: "a2", title: "Welcome to the Fall Classic", body: "Doors open at 7:15 AM. Coaches check in at the registration desk by the main entrance.", priority: "normal", createdAt: "2026-10-17T07:00:00" },
];

export const venue = {
  name: "Toronto Pan Am Sports Centre",
  address: "875 Morningside Ave, Toronto, ON M1C 0C7",
  parking: [
    "Lot A (main entrance) — free, fills by 8:30 AM",
    "Lot C (overflow) — free shuttle every 10 min",
    "Accessible parking at the north entrance",
  ],
};

export const teamById = (id: string) => teams.find((t) => t.id === id);

export function setsWon(m: Match): [number, number] {
  let h = 0, a = 0;
  m.sets.forEach(([x, y], i) => {
    const done = m.status === "final" || i < m.sets.length - 1;
    if (!done) return;
    if (x > y) h++; else if (y > x) a++;
  });
  return [h, a];
}
