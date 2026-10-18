import { teams, type Team } from './data';

export const volleyballCategories = ['Indoor Volleyball', 'Beach Volleyball', '6 v 6 Volleyball'] as const;
export type VolleyballCategory = typeof volleyballCategories[number];

// Deterministic one-time assignment, distributed as evenly as possible (4/3/3).
// Fictional demonstration data — not verified OVA classifications.
const baseAssignments: Record<string, VolleyballCategory> = {
  t1: 'Indoor Volleyball', t2: 'Indoor Volleyball', t3: 'Indoor Volleyball', t4: 'Indoor Volleyball',
  t5: 'Beach Volleyball', t6: 'Beach Volleyball', t7: 'Beach Volleyball',
  t8: '6 v 6 Volleyball', t9: '6 v 6 Volleyball', t10: '6 v 6 Volleyball',
};

const overrideKey = 'courtside-category-overrides';

export function categoryOverrides(): Record<string, VolleyballCategory> {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(overrideKey) ?? '{}');
    if (saved && typeof saved === 'object') {
      return Object.fromEntries(Object.entries(saved as Record<string, string>).filter(([, v]) => (volleyballCategories as readonly string[]).includes(v))) as Record<string, VolleyballCategory>;
    }
  } catch { /* Overrides stay empty when storage is unavailable. */ }
  return {};
}

export const categoryFor = (teamId: string, overrides: Record<string, VolleyballCategory> = categoryOverrides()) =>
  overrides[teamId] ?? baseAssignments[teamId] ?? 'Indoor Volleyball';

export const teamsInCategory = (cat: VolleyballCategory, overrides?: Record<string, VolleyballCategory>) =>
  teams.filter(t => categoryFor(t.id, overrides) === cat);

export function setCategoryOverride(teamId: string, cat: VolleyballCategory) {
  const next = { ...categoryOverrides(), [teamId]: cat };
  try { localStorage.setItem(overrideKey, JSON.stringify(next)); } catch { /* In-memory override still applies. */ }
  return next;
}

export const teamWithCategory = (t: Team, overrides?: Record<string, VolleyballCategory>) => ({ ...t, category: categoryFor(t.id, overrides) });
