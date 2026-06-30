// ---------- Age ----------
function getAge(birthDateStr) {
  const birth = new Date(birthDateStr);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age--;
  return age;
}

// ---------- Discord presence ----------
const STATUS_LABELS = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline"
};

function buildAvatarUrl(discordUser) {
  if (!discordUser) return null;
  if (discordUser.avatar) {
    return `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=128`;
  }
  return `https://cdn.discordapp.com/embed/avatars/0.png`;
}

async function fetchPresence(discordId) {
  const dot = document.querySelector(".status-dot");
  const img = document.querySelector(".avatar-wrap img");
  const pill = document.getElementById("statusPill");
  const nameEl = document.getElementById("heroName");

  if (!discordId) {
    if (pill) pill.textContent = "Discord not connected";
    return;
  }

  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
    const json = await res.json();
    if (!json.success) throw new Error("lanyard: not found");

    const data = json.data;
    const status = data.discord_status || "offline";

    if (dot) {
      dot.classList.remove("online", "idle", "dnd", "offline");
      dot.classList.add(status);
    }
    if (pill) pill.textContent = STATUS_LABELS[status] || status;
    if (img) img.src = buildAvatarUrl(data.discord_user);
    if (nameEl && data.discord_user && data.discord_user.username) {
      nameEl.textContent = data.discord_user.username;
      document.title = data.discord_user.username;
    }

    updateNowPlaying(data);
  } catch (e) {
    if (pill) pill.textContent = "Status unavailable";
  }
}

function updateNowPlaying(data) {
  const card = document.getElementById("nowPlaying");
  if (!card) return;

  if (data.listening_to_spotify && data.spotify) {
    const sp = data.spotify;
    document.getElementById("npArt").src = sp.album_art_url || "";
    document.getElementById("npSong").textContent = sp.song || "";
    document.getElementById("npArtist").textContent = sp.artist || "";
    card.href = sp.track_id ? `https://open.spotify.com/track/${sp.track_id}` : "#";
    card.classList.add("show");
  } else {
    card.classList.remove("show");
  }
}

// ---------- Hero ----------
function renderHero() {
  document.title = CONFIG.displayName;
  document.getElementById("heroName").textContent = CONFIG.displayName;
  document.getElementById("heroRole").textContent = CONFIG.role;
  setPageBackground(CONFIG.bannerUrl);
  fetchPresence(CONFIG.discordId);
}

// ============================================================
// FIXED: video fills screen + starts UNMUTED
// ============================================================
function setPageBackground(url) {
  const video = document.getElementById("pageBgVideo");
  const audio = document.getElementById("bgAudio");
  const toggle = document.getElementById("bgAudioToggle");
  const pageBg = document.getElementById("pageBg");

  // Reset background
  pageBg.style.backgroundImage = "none";
  pageBg.style.backgroundColor = "#100D0A";

  // ---- 1. LOAD AUDIO ----
  if (CONFIG.bgAudio && CONFIG.bgAudio.trim() !== "") {
    audio.src = CONFIG.bgAudio;
    audio.load();
    audio.volume = 0.6;
    audio.muted = false;
    console.log("[audio] Loading:", CONFIG.bgAudio);
    audio.onerror = function() { console.error("[audio] FAILED:", CONFIG.bgAudio); };
    audio.oncanplaythrough = function() {
      console.log("[audio] Ready.");
      audio.play().catch(function() { console.warn("[audio] Autoplay blocked – will unmute on first click."); });
    };
  } else {
    console.log("[audio] No audio configured.");
    audio.src = "";
  }

  // ---- 2. LOAD VIDEO ----
  if (!url) {
    toggle.style.display = "none";
    return;
  }

  var isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
  if (!isVideo) {
    var img = new Image();
    img.onload = function() { pageBg.style.backgroundImage = 'url("' + url + '")'; };
    img.onerror = function() { console.error("[background] Image failed:", url); };
    img.src = url;
    toggle.style.display = "none";
    return;
  }

  video.src = url;
  video.load();
  video.volume = 0.6;
  video.muted = false;
  video.oncanplaythrough = function() {
    video.play()
      .then(function() { console.log("[video] Playing unmuted."); })
      .catch(function() { console.warn("[video] Autoplay blocked – will unmute on first click."); });
  };
  video.onerror = function() { video.style.display = "none"; };

  // ---- 3. TOGGLE: always visible, starts as 🔊 (sound on) ----
  toggle.style.display = "flex";
  var isSoundOn = true;
  toggle.textContent = "🔊";

  function applySoundState(on) {
    if (on) {
      video.muted = false;
      video.play().catch(function() {});
      if (audio.src) {
        audio.muted = false;
        audio.play().catch(function() { console.warn("[audio] Play blocked, but user will click."); });
      }
      toggle.textContent = "🔊";
      console.log("[audio] Sound ON");
    } else {
      video.muted = true;
      if (audio.src) audio.muted = true;
      toggle.textContent = "🔇";
      console.log("[audio] Sound OFF");
    }
  }

  toggle.onclick = function(e) {
    e.stopPropagation();
    isSoundOn = !isSoundOn;
    applySoundState(isSoundOn);
  };

  // ---- 4. FIRST CLICK ANYWHERE: ensures unmute if browser blocked ----
  var firstClick = function() {
    if (!isSoundOn) {
      isSoundOn = true;
    }
    video.muted = false;
    video.play().catch(function() {});
    if (audio.src) {
      audio.muted = false;
      audio.play().catch(function() {});
    }
    toggle.textContent = "🔊";
    console.log("[audio] Unmuted on first user click.");
    document.removeEventListener("click", firstClick);
  };
  document.addEventListener("click", firstClick);

  applySoundState(true);
}

// ---------- About ----------
function renderAbout() {
  document.getElementById("bioText").textContent = CONFIG.bio;
  var age = getAge(CONFIG.birthDate);
  var projectCount = CONFIG.work.filter(function(w) { return w.type === "project"; }).length;
  var certCount = CONFIG.work.filter(function(w) { return w.type === "cert"; }).length;
  var stats = [
    { num: age, label: "Age" },
    { num: projectCount, label: projectCount === 1 ? "Project" : "Projects" },
    { num: certCount, label: certCount === 1 ? "Certificate" : "Certificates" }
  ];
  document.getElementById("statRow").innerHTML = stats.map(function(s) {
    return '<div class="stat"><span class="stat-num">' + s.num + '</span><span class="stat-label">' + s.label + '</span></div>';
  }).join("");
}

// ---------- Slider ----------
function renderSlider() {
  var slider = document.getElementById("slider");
  var dotsWrap = document.getElementById("dots");
  var prevBtn = document.getElementById("navPrev");
  var nextBtn = document.getElementById("navNext");

  if (!CONFIG.work.length) {
    slider.innerHTML = '<p style="color:var(--text-muted)">Nothing logged yet.</p>';
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    return;
  }


  
  slider.innerHTML = CONFIG.work.map(function(item) {
    var hasLink = !!item.link;
    return '<div class="card">' +
      '<div class="card-top">' +
        '<span class="type-badge' + (item.type === "project" ? " project" : item.type === "cert" ? " certificate" : "") + '">' + (item.type === "project" ? "Project" : "Certificate") + '</span>' +
        (item.status ? '<span class="card-status">' + escapeHtml(item.status) + '</span>' : "") +
      '</div>' +
      '<h3 class="card-title">' + escapeHtml(item.title) + '</h3>' +
      '<p class="card-desc">' + escapeHtml(item.description) + '</p>' +
      (item.tags && item.tags.length ? '<div class="card-tags">' + item.tags.map(function(t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join("") + '</div>' : "") +
      (hasLink ? '<a class="card-link" href="' + escapeAttr(item.link) + '" target="_blank" rel="noopener">' + escapeHtml(item.linkLabel || "View") + '</a>' : '<span class="card-link disabled">No link yet</span>') +
    '</div>';
  }).join("");

  dotsWrap.innerHTML = CONFIG.work.map(function(_, i) {
    return '<button class="dot-btn' + (i === 0 ? " active" : "") + '" data-index="' + i + '" aria-label="Go to item ' + (i + 1) + '"></button>';
  }).join("");

  var cards = Array.from(slider.children);
  var dots = Array.from(dotsWrap.children);

  function cardStep() {
    return cards[0].getBoundingClientRect().width + 16;
  }

  function updateActiveDot() {
    var index = Math.round(slider.scrollLeft / cardStep());
    dots.forEach(function(d, i) {
      d.classList.toggle("active", i === Math.min(index, dots.length - 1));
    });
    prevBtn.disabled = slider.scrollLeft <= 4;
    nextBtn.disabled = slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 4;
  }

  prevBtn.addEventListener("click", function() { slider.scrollBy({ left: -cardStep(), behavior: "smooth" }); });
  nextBtn.addEventListener("click", function() { slider.scrollBy({ left: cardStep(), behavior: "smooth" }); });
  dots.forEach(function(dot) {
    dot.addEventListener("click", function() {
      var i = Number(dot.dataset.index);
      slider.scrollTo({ left: i * cardStep(), behavior: "smooth" });
    });
  });

  var scrollTimeout;
  slider.addEventListener("scroll", function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 80);
  });
  window.addEventListener("resize", updateActiveDot);
  updateActiveDot();
}



// ---------- Contact ----------
var GITHUB_ICON = '<svg width="17" height="17" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';
var DISCORD_ICON = '<svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2 3.5h12v7.5H6.5L4 13.5v-2.5H2z"/></svg>';
var MAIL_ICON = '<svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1.5" y="3" width="13" height="10" rx="1.5"/><path d="M2 4l6 5 6-5"/></svg>';
var LINK_ICON = '<svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6.5 9.5 9.5 6.5M5 11 3.5 12.5a2 2 0 1 1-2.8-2.8L2.5 8m6-3 1.5-1.5a2 2 0 1 1 2.8 2.8L11.5 8"/></svg>';

function iconFor(label) {
  var l = label.toLowerCase();
  if (l === "github") return GITHUB_ICON;
  if (l === "discord") return DISCORD_ICON;
  if (l === "email") return MAIL_ICON;
  return LINK_ICON;
}

function renderContact() {
  var panel = document.getElementById("contactPanel");
  if (!CONFIG.contacts.length) {
    panel.innerHTML = '<p style="color:var(--text-muted); margin:0;">No contact methods listed yet.</p>';
    return;
  }
  panel.innerHTML = CONFIG.contacts.map(function(c) {
    return '<div class="contact-item">' +
      iconFor(c.label) +
      (c.url ? '<a href="' + escapeAttr(c.url) + '" target="_blank" rel="noopener">' + escapeHtml(c.value) + '</a>' : '<span>' + escapeHtml(c.value) + '</span>') +
    '</div>';
  }).join("");
}

// ---------- Footer ----------
function renderFooter() {
  document.getElementById("footerLine").textContent = "built by " + CONFIG.displayName + " · status synced live via Discord";
}

// ---------- Utils (FIXED) ----------
function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, function(c) {
    if (c === "&") return "&amp;";
    if (c === "<") return "&lt;";
    if (c === ">") return "&gt;";
    if (c === '"') return "&quot;";
    if (c === "'") return "&#39;";
    return c;
  });
}

function escapeAttr(str) {
  return escapeHtml(str);
}

// ---------- Init ----------
renderHero();
renderAbout();
renderSlider();
renderContact();
renderFooter();

if (CONFIG.discordId) {
  setInterval(function() { fetchPresence(CONFIG.discordId); }, 20000);
}