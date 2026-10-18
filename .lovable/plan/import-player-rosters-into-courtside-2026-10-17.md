# Import player rosters into Courtside

The CSV has 100 players, 10 per team, for all 10 existing teams (T001–T010). Team names, clubs and divisions match the app's teams exactly.

## What changes
- **Roster data**: all 100 players added exactly as in the file (jersey number, name, position). No players invented. The 4 old placeholder players are replaced by the CSV data.
- **Team matching**: CSV `team_id` T001..T010 maps to app teams t1..t10; any row whose team doesn't match a known team is skipped, not guessed.
- **Teams page**: tapping a team card expands it to show its roster, sorted by jersey number (`#`, name, position). Tap again to collapse. The Follow button stays as is and does not toggle the roster.
- Team info, search and Follow behaviour remain unchanged. Rosters stay labelled as demo data (they're mock rosters, not official provider data).

## Technical details
- New `src/lib/rosters.ts` with a typed `players` array generated from the CSV, plus `rosterFor(teamId)` and `toAppTeamId("T001") -> "t1"`.
- `events.ts` `rosters` re-exports from the new module so existing imports keep working.
- `teams.tsx`: add `expanded` state; card body becomes a button with `aria-expanded`; roster list renders below.
- Test `src/lib/rosters.test.ts`: 100 players total, 10 per team, T001 maps to t1, Emma Chen is #1 Setter on t1.
