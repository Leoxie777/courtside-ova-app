import { describe, it, expect } from 'vitest';
import { teams } from './data';
import { volleyballCategories, categoryFor, teamsInCategory } from './categories';
import { similarAnnouncement } from './events';
import { checkAdminPassword } from './admin-gate';

describe('Volleyball category rules', () => {
  it('assigns every existing team exactly once with no duplicates or deletions', () => {
    const assigned = teams.map(t => categoryFor(t.id, {}));
    expect(assigned).toHaveLength(teams.length);
    expect(new Set(teams.map(t => t.id)).size).toBe(teams.length);
    assigned.forEach(c => expect(volleyballCategories).toContain(c));
  });
  it('distributes teams as evenly as possible (counts differ by at most one)', () => {
    const counts = volleyballCategories.map(c => teamsInCategory(c, {}).length);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(teams.length);
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
  });
  it('is deterministic and stable across calls', () => {
    expect(teams.map(t => categoryFor(t.id, {}))).toEqual(teams.map(t => categoryFor(t.id, {})));
    expect(categoryFor('t1', {})).toBe('Indoor Volleyball');
  });
  it('organizer overrides win over the base assignment', () => {
    expect(categoryFor('t1', { t1: 'Beach Volleyball' })).toBe('Beach Volleyball');
  });
});

describe('Duplicate announcement detection', () => {
  const existing = [{ id: 'x', title: 'Court 4 Schedule Change', body: 'Court 4 matches move 20 minutes later.', priority: 'urgent' as const, createdAt: '' }];
  it('flags a highly similar announcement', () => {
    expect(similarAnnouncement({ id: 'new', title: 'Court 4 Schedule Change', body: 'Court 4 matches move 20 minutes later.' }, existing)?.id).toBe('x');
  });
  it('excludes the record being edited from comparison', () => {
    expect(similarAnnouncement({ id: 'x', title: 'Court 4 Schedule Change', body: 'Court 4 matches move 20 minutes later.' }, existing)).toBeUndefined();
  });
  it('ignores unrelated announcements', () => {
    expect(similarAnnouncement({ id: 'new', title: 'Doors open', body: 'Registration desk opens early.' }, existing)).toBeUndefined();
  });
});

describe('Demo admin password gate', () => {
  it('accepts only the demonstration password', () => {
    expect(checkAdminPassword('123')).toBe(true);
    expect(checkAdminPassword('1234')).toBe(false);
    expect(checkAdminPassword('')).toBe(false);
  });
});
