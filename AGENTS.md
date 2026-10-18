<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep provider event metadata separate from explicitly labeled demo fixtures; never attribute demo matches or rosters to an official provider event.
- Scope schedules, results, imports, and announcements by the selected event through the shared store so switching cannot mix events.
- Shared organizer writes use Cloud tables with role-based RLS; browser role checks only control presentation and never grant privileges.
- Keep venue directions and court plans absent until verified source details are available, rather than inferring logistics.
- Keep team lookup and urgent-announcement selection in browser-safe pure helpers with rule tests; detail pages reuse the existing roster and shared event store.
- Announcement publication uses a persisted active flag protected by organizer RLS; merge demo fixtures by ID so organizer edits and deactivation override fixtures.
- Promotion destinations are local mock pages until verified shop, raffle, and sponsor URLs exist, avoiding implied real sales or partnerships.
- The admin password gate is demo-only UI protection; real authorization stays with server-side organizer roles and RLS.
- Volleyball category assignments are deterministic demo data in src/lib/categories.ts with organizer overrides in localStorage; never present them as verified OVA classifications.
