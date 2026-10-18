import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { initialAnnouncements, initialMatches, type Announcement, type Match } from "./data";
import { forEvent, type EventId } from "./events";
import { supabase } from "@/integrations/supabase/client";
import { mergeAnnouncements } from './home-features';

const announcementDbId = (id: string) => id === 'a1' ? '00000000-0000-4000-8000-000000000001' : id === 'a2' ? '00000000-0000-4000-8000-000000000002' : id;
const announcementAppId = (id: string) => id === '00000000-0000-4000-8000-000000000001' ? 'a1' : id === '00000000-0000-4000-8000-000000000002' ? 'a2' : id;

type Store = {
  followed: string[]; toggleFollow: (id: string) => Promise<void>;
  matches: Match[]; addMatches: (m: Match[]) => Promise<void>;
  announcements: Announcement[]; saveAnnouncement: (a: Announcement) => Promise<void>; deleteAnnouncement: (id: string) => Promise<void>;
  eventId: EventId; selectEvent: (id: EventId) => void; userId: string | null; isOrganizer: boolean; error: string;
};
const Ctx = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [eventId, setEvent] = useState<EventId>('demo');
  const [followed, setFollowed] = useState<string[]>(['t1']);
  const [userId, setUser] = useState<string | null>(null);
  const [isOrganizer, setOrganizer] = useState(false);
  const [announcements, setAnn] = useState<Announcement[]>([]);
  const [imported, setImported] = useState<Match[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    let generation = 0;
    const loadIdentity = async (id: string | null) => {
      const request = ++generation;
      setUser(id); setOrganizer(false);
      if (!id) return;
      const [role, follows] = await Promise.all([supabase.from('user_roles').select('role').eq('user_id', id), supabase.from('team_follows').select('team_id').eq('user_id', id)]);
      if (!alive || request !== generation) return;
      setOrganizer(role.data?.some(r => r.role === 'organizer') ?? false);
      setFollowed(follows.data?.map(r => r.team_id) ?? []);
      void refresh();
    };
    try { const saved: unknown = JSON.parse(sessionStorage.getItem('courtside-guest-follows') ?? 'null'); if (Array.isArray(saved)) setFollowed(saved.filter((x): x is string => typeof x === 'string')); } catch { /* Guest follows still work in memory. */ }
    supabase.auth.getUser().then(({ data }) => { if (alive) void loadIdentity(data.user?.id ?? null); });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') setTimeout(() => { if (alive) void loadIdentity(session?.user.id ?? null); }, 0);
    });
    const refresh = async () => {
      const [a, m] = await Promise.all([supabase.from('announcements').select('*').order('created_at', { ascending: false }), supabase.from('imported_matches').select('match_data,event_id')]);
      if (!alive) return;
      if (a.error || m.error) { setError('Shared event information could not be loaded.'); return; }
      setAnn((a.data ?? []).map(r => ({ id: announcementAppId(r.id), title: r.title, body: r.body, priority: r.priority as Announcement['priority'], createdAt: r.created_at, eventId: r.event_id, active: r.active })));
      setImported((m.data ?? []).map(r => ({ ...(r.match_data as unknown as Match), eventId: r.event_id })));
      setError('');
    };
    void refresh();
    const timer = setInterval(refresh, 30000);
    return () => { alive = false; data.subscription.unsubscribe(); clearInterval(timer); };
  }, []);
  const value: Store = {
    eventId, selectEvent: setEvent, userId, isOrganizer, error, followed,
    toggleFollow: async id => {
      const on = followed.includes(id);
      if (userId) {
        const result = on ? await supabase.from('team_follows').delete().eq('user_id', userId).eq('team_id', id) : await supabase.from('team_follows').insert({ user_id: userId, team_id: id });
        if (result.error) { setError('Could not save your followed teams.'); return; }
      }
      setFollowed(f => { const updated = on ? f.filter(x => x !== id) : [...f, id]; if (!userId) { try { sessionStorage.setItem('courtside-guest-follows',JSON.stringify(updated)); } catch { /* Guest follows still work in memory. */ } } return updated; });
    },
    matches: forEvent([...initialMatches, ...imported], eventId).sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time)),
    announcements: forEvent(mergeAnnouncements(initialAnnouncements, announcements), eventId).sort((a,b) => b.createdAt.localeCompare(a.createdAt)),
    addMatches: async rows => {
      if (!isOrganizer) throw new Error('Organizer access is required.');
      const keyed = rows.map(m => ({ ...m, eventId, id: [eventId,m.date,m.time,m.court,m.homeId,m.awayId].join('|') }));
      const { error } = await supabase.from('imported_matches').upsert(keyed.map(m => ({ id: m.id, event_id: eventId, match_data: JSON.parse(JSON.stringify(m)) })), { onConflict: 'id' });
      if (error) throw new Error(error.message);
      setImported(old => [...old.filter(m => !keyed.some(n => n.id === m.id)), ...keyed]);
    },
    saveAnnouncement: async a => {
      if (!isOrganizer) throw new Error('Organizer access is required.');
      const { error } = await supabase.from('announcements').upsert({ id: announcementDbId(a.id), event_id: eventId, title: a.title.trim(), body: a.body.trim(), priority: a.priority, created_at: a.createdAt, active: a.active !== false });
      if (error) throw new Error(error.message);
      const saved = { ...a, eventId };
      setAnn(old => [saved, ...old.filter(x => x.id !== saved.id)]);
    },
    deleteAnnouncement: async id => {
      if (!isOrganizer) throw new Error('Organizer access is required.');
      const { error } = await supabase.from('announcements').delete().eq('id', announcementDbId(id)).eq('event_id', eventId);
      if (error) throw new Error(error.message);
      setAnn(old => old.filter(a => a.id !== id));
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useStore = () => { const c = useContext(Ctx); if (!c) throw new Error('StoreProvider missing'); return c; };
