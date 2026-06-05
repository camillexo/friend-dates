# Friend Dates 🎉

A tiny single-page site for June. Friends can **join you** at events you already attend, or **propose** a new friend date. Confirmed plans live in your "Friend Dates" Google Calendar, embedded at the bottom.

**Design:** cute/playful editorial — Camille's brand fonts (Playfair Display, DM Sans, Space Mono) and warm cream base, with a candy-bright accent palette (bubblegum, limeade, pure sun, peony, sky blue, sage) pulled from the mood board. Chunky outlined cards with hard offset shadows, floating blobs, grain overlay. Respects `prefers-reduced-motion`.

## What it does
- **Join me** — cards for your weekly events (Church, Pilates, Dance ×2, Run Club, Co-Working). Clicking one opens a prefilled "Add to Google Calendar" link so a friend can drop it on their own calendar.
- **Propose a date** — a form (type w/ "Other", date, time, location, note + their name). On submit it opens a prefilled Google Calendar event draft for review. Optionally emails the proposal to you.
- **Calendar** — your public "Friend Dates" calendar embedded.

## Customize
Open `app.js`:
- `WEEKLY` — your recurring events (title, emoji, day-of-week, time, duration, location). Fill in locations where blank.
- `PROPOSE_EMAIL` — set to your email to also receive proposals via `mailto:` on submit. Leave `""` to skip.

## Deploy (GitHub → Netlify)
1. Push this folder to a GitHub repo.
2. In Netlify: **Add new site → Import from GitHub**, pick the repo.
3. Leave build command empty; publish directory = `.` (already set in `netlify.toml`).
4. Deploy.

That's it — it's a static site, no build step.

## Notes / first-draft limits
- Proposals don't auto-write to your calendar (Google requires OAuth for that). The draft-link approach keeps it zero-backend. If you later want auto-add + an RSVP list, that needs a small backend or a service like Google Apps Script / a form provider.
- All dates are pinned to June 2026 and `America/Chicago`.
