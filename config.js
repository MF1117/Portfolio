// =========================================================
// SITE CONFIG — edit this file to update your portfolio
// =========================================================

const CONFIG = {
  // Shown everywhere on the page instead of your real name — kept as
  // your Discord username on purpose. If you set a discordId below,
  // this gets overridden live by whatever your actual Discord username
  // is at the time (so it stays in sync if you ever change it).
  displayName: "snoutlol",
  role: "Developer",

  // --- Background ---
  // Paste an image OR video URL here for a guns.lol-style full-page
  // background — it stays fixed behind everything as you scroll, with a
  // dark overlay so text stays readable, and the cards float on top
  // with a frosted-glass look. Leave blank for a plain dark background.
  //
  // Video backgrounds: just point at an .mp4 file (best browser support —
  // .webm also works, avoid .mov) and it'll autoplay, loop, and stay muted
  // automatically. Detected by file extension, so no extra config needed.
  //
  // Using your own file instead of a web URL? Drop it into the assets/
  // folder, then point at it with a relative path, e.g.:
  //   bannerUrl: "assets/background.mp4",
  bannerUrl: "assets/banner.mp4",

  // --- Background audio (optional) ---
  // Put your audio file (mp3, ogg, or wav) inside the assets/ folder
  // and point to it here. The toggle button will control both video
  // audio and this background audio together.
  bgAudio: "assets/audio.mp3", // leave empty ("") if you don't want audio

  // Shown in the About panel.
  bio: "I build small, focused tools — right now that's a Discord bot " +
       "that posts a random pic of cheese on a schedule, and a growing " +
       "stack of AWS certifications. I like shipping things that work, " +
       "learning cloud infrastructure, and finding excuses to automate " +
       "things that probably didn't need automating.",

  // --- Age display ---
  // Your real name isn't shown anywhere on this page anymore, which
  // helps — but birthdate is still a placeholder year, not your real
  // one. Exact DOB + a direct way to message you (email, Discord) is
  // still a combination that makes it easier for a stranger to single
  // you out. The age shown will keep ticking up automatically either way.
  birthDate: "2008-11-09", // <-- placeholder, change if you want

  // --- Contact ---
  // All contact methods render together in one card.
  contacts: [
    { label: "GitHub", value: "github.com/MF1117", url: "https://github.com/MF1117" },
    { label: "Discord", value: "snoutlol", url: "https://discord.gg/abpb2H6U" },
  ],

  // --- Live Discord presence (via Lanyard) ---
  // 1. Discord Settings > Advanced > turn on Developer Mode
  // 2. Right-click your name > Copy User ID
  // 3. Join the Lanyard server so it can track your presence:
  //    https://discord.gg/lanyard
  // 4. Paste your ID below.
  discordId: "420592843908841472", // <-- e.g. "123456789012345678"

  // --- Work: projects + certificates, shown together in the slider ---
  // type: "project" or "cert"
  work: [
    {
      type: "project",
      title: "daily-cheese-bot",
      description: "A Discord bot that posts a random pic of cheese, on a schedule.",
      tags: ["Node.js", "Discord.js", "EJS", "CSS"],
      link: "https://github.com/MF1117/daily-cheese-bot",
      linkLabel: "View repo",
      status: "Active"
      // Note: this repo is currently private — make it public on GitHub
      // (Settings > Danger Zone > Change visibility) for the link to
      // work for visitors.
    },
    {
      type: "cert",
      title: "Builder Labs: Introduction to AWS Cloud",
      description: "Completed practical AWS Builder Labs in cloud fundamentals and architecture, certified by AWS Training & Certification.",
      tags: ["AWS"],
      link: "https://mf1117.github.io/certificates/",
      linkLabel: "View certificate",
      status: "Earned"
    },
    {
      type: "cert",
      title: "More on the way",
      description: "Currently studying for the next AWS certification.",
      tags: ["AWS"],
      link: "",
      linkLabel: "View certificate",
      status: "In progress"
    }
    // Add as many project/cert entries as you want, same shape.
  ]
};