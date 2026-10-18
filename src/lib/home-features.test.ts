import { describe, it, expect } from 'vitest';
import { searchTeams, followedTeams, nextMatch, nextUrgent, mergeAnnouncements } from './home-features';
import { initialMatches, initialAnnouncements } from './data';
describe('Home and roster rules', () => {
  it('matches case-insensitive partial player names and jersey numbers without duplicates', () => {
    const result = searchTeams('EMMA CH');
    expect(result).toHaveLength(1);
    expect(result[0]?.team.id).toBe('t1');
    expect(result[0]?.matchingPlayers).toEqual([expect.objectContaining({ name:'Emma Chen', number:1 })]);
  });
  it('still matches clubs and teams', () => { expect(searchTeams('KW Kodiaks')[0]?.team.id).toBe('t6'); expect(searchTeams('toronto thunder')[0]?.team.id).toBe('t1'); });
  it('shows only followed teams and changes on unfollow', () => { expect(followedTeams(['t1','t1']).map(t=>t.id)).toEqual(['t1']); expect(followedTeams([])).toEqual([]); });
  it('excludes final matches from upcoming team information', () => expect(nextMatch(initialMatches,'t1')?.id).toBe('m5'));
  it('does not repeat dismissed urgent notices but shows new notices', () => {
    const a = { ...initialAnnouncements[0], id:'first', title:'Urgent', body:'Change', priority:'urgent' as const, createdAt:'2026-10-17T12:00:00Z' };
    expect(nextUrgent([a],['first'])).toBeUndefined(); expect(nextUrgent([a,{...a,id:'new'}],['first'])?.id).toBe('new');
  });
  it('never opens inactive announcements', () => expect(nextUrgent([{ id:'draft', title:'Draft',body:'',createdAt:'',priority:'urgent',active:false }],[])).toBeUndefined());
  it('saved deactivation overrides demo fixtures', () => { const a = initialAnnouncements[0]; if (!a) throw Error('missing fixture'); expect(mergeAnnouncements([a],[{...a,active:false}])).toEqual([{...a,active:false}]); });
});