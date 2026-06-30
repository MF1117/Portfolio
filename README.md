# snoutlol — Portfolio

A portfolio page: a Discord-style profile header (big avatar, username,
live status, and what you're listening to on Spotify if anything), an
About section, a swipeable slider of projects + certificates, and one
contact card.

## Files

```
.
├── index.html       the page
├── style.css         theme (amber accent on dark)
├── script.js         rendering, slider logic, Discord + Spotify sync
└── config.js         <-- you edit this to update your content
```

Everything you'd want to change lives in `config.js`.

## What's live / automatic

- **Avatar + username** — pulled live from Discord via Lanyard once
  `discordId` is set. Change your pfp or username on Discord and it
  updates here too.
- **Online status dot** — online / idle / dnd / offline, same source.
- **Now playing** — if you're listening to Spotify while connected to
  Discord, a little card appears under your name with the album art,
  song, and artist, linking out to the track on Spotify. It just
  disappears when you're not listening to anything.
- **Age** — recalculated on load and rechecked periodically, so it rolls
  over automatically on the date in `birthDate`. Still pointed at a
  placeholder year, not your real one (see safety note below).

## Setting a background

`config.js` has a `bannerUrl` field — paste an image **or video** URL in
and it becomes a full-page background, fixed behind everything as you
scroll, with a dark overlay so text stays readable on top of it. Your
profile card, about section, and project cards all get a frosted-glass
look floating over it — the guns.lol look. Leave it blank and you just
get the plain dark background, no file needed.

**Video backgrounds:** point `bannerUrl` at an `.mp4` file and it
autoplays, loops, and stays muted automatically — no extra setup. It's
detected purely by file extension, so as long as the path ends in `.mp4`
(or `.webm`) it'll be picked up as a video instead of an image. Avoid
`.mov` — browser support for it is inconsistent.

**Using your own file instead of a link:** drop the image or video into
the `assets/` folder (already in this project), then point at it with a
relative path:
```js
bannerUrl: "assets/background.mp4",
```
Just make sure the file actually gets committed and pushed along with
everything else — it needs to live in the repo for GitHub Pages to serve it.

## Setting up live Discord + Spotify sync

Both ride on [Lanyard](https://github.com/Phineas/lanyard), a free public
API that tracks Discord presence (including Spotify activity) for users
who've joined its server.

1. Discord: **Settings → Advanced → Developer Mode** (turn it on).
2. Right-click your own name → **Copy User ID**.
3. Join the Lanyard server so it can see your presence:
   https://discord.gg/lanyard
4. Paste your ID into `config.js`:
   ```js
   discordId: "123456789012345678",
   ```
5. Save, commit, push. Avatar, username, status, and now-playing all sync
   automatically from there — no further setup needed for Spotify, since
   Lanyard reads it straight from your Discord activity status.

Leave `discordId` blank and the page just shows the fallback username,
an offline dot, and no now-playing card — nothing breaks.

## A safety note, since you're 17 and this is public

- Your real name isn't shown anywhere on the page — `displayName` is
  your Discord username (`snoutlol`) instead, and stays that way even
  as Lanyard syncs it live.
- You've added your Discord handle and your email to the contact card.
  That means anyone visiting the page can message you directly. That's
  worth knowing going in — keep an eye on who reaches out, and you can
  always remove either from the `contacts` array in `config.js` later
  if it ends up attracting more messages than you want.
- Birthdate is still a placeholder (`2008-01-01`), not your real one.
  Change it in `config.js` if you want the real date wired in — your
  call either way.

## Updating the slider (projects & certificates)

```js
work: [
  {
    type: "project",        // or "cert"
    title: "daily-cheese-bot",
    description: "A Discord bot that posts a random pic of cheese, on a schedule.",
    tags: ["Node.js", "Discord.js"],
    link: "https://github.com/MF1117/daily-cheese-bot",
    linkLabel: "View repo", // e.g. "View certificate" for certs
    status: "Active"        // e.g. "Earned" / "In progress" for certs
  }
]
```

Two placeholder cert entries are in there now — replace with your real
AWS certificates (a Credly badge URL or PDF link both work) as you earn them.

**Heads up:** `daily-cheese-bot` is currently a **private** repo, so its
link will 404 for visitors until you make it public (repo **Settings →
Danger Zone → Change visibility**).

## Deploy on GitHub Pages

1. Push these files to a repo (e.g. `portfolio`), branch `main`.
2. **Settings → Pages → Source → Deploy from a branch → main / (root)**.
3. Live at `https://yourusername.github.io/portfolio/` within a minute or two.
