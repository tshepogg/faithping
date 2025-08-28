
/* FaithPing PWA — static POC */

// ===== Config =====
const DEFAULT_TIME = "07:00"; // local time
const STORAGE_KEYS = {
  settings: "fp_settings",
  lastShown: "fp_last_shown",      // yyyy-mm-dd
  snoozeUntil: "fp_snooze_until",  // ISO timestamp
  favorites: "fp_favorites",       // array of verse objects
};
const MODAL_SNOOZE_MIN = 10;
const APP_VERSION = "1.0.0";

// ===== State =====
let VERSES = [];      // loaded from verses.json
let CURRENT = null;   // {id, reference, text}
let SETTINGS = loadSettings();

// ===== Helpers =====
function $(sel) { return document.querySelector(sel); }
function now() { return new Date(); }
function todayKey(d = now()) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function parseHHMM(hhmm) {
  const [h,m] = hhmm.split(":").map(Number);
  return {h,m};
}
function minutesFromMidnight(d) { return d.getHours()*60 + d.getMinutes(); }
function getNextDailyTime(hhmm) {
  const {h,m} = parseHHMM(hhmm);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  if (d <= now()) d.setDate(d.getDate()+1);
  return d;
}
function hmacHash(str) {
  // simple DJB2-ish hash to pick deterministic verse of the day
  let h = 5381; for (let i=0; i<str.length; i++) h = ((h<<5)+h) + str.charCodeAt(i);
  return Math.abs(h);
}
function copyToClipboard(text) {
  return navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject();
}
function saveJSON(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return (v===null?fallback:v); }
  catch { return fallback; }
}
function loadSettings() {
  const s = loadJSON(STORAGE_KEYS.settings, null);
  return s || { time: DEFAULT_TIME, lang: "EN", theme: "light" };
}
function applyTheme(theme) {
  if (theme === "system") return; // rely on prefers-color-scheme
  document.documentElement.dataset.theme = theme;
}

// ===== Verse selection =====
function pickVerseForDate(dateKey) {
  if (!VERSES.length) return null;
  const idx = hmacHash(dateKey) % VERSES.length;
  return VERSES[idx];
}
function randomVerse(excludeId) {
  if (!VERSES.length) return null;
  let v;
  do { v = VERSES[Math.floor(Math.random()*VERSES.length)]; }
  while (VERSES.length > 1 && v.id === excludeId);
  return v;
}

// ===== Favorites =====
function getFavorites() { return loadJSON(STORAGE_KEYS.favorites, []); }
function isFav(v) { return getFavorites().some(f => f.id === v.id); }
function toggleFav(v) {
  const favs = getFavorites();
  const i = favs.findIndex(f => f.id === v.id);
  if (i >= 0) favs.splice(i,1); else favs.push(v);
  saveJSON(STORAGE_KEYS.favorites, favs);
  renderFavList();
  renderFavButton();
}
function renderFavButton() {
  const b = $("#btn-fav"); const m = $("#modal-fav");
  if (!CURRENT) return;
  const label = isFav(CURRENT) ? "★ Favorited" : "❤ Favorite";
  if (b) b.textContent = label;
  if (m) m.textContent = label;
}
function renderFavList() {
  const list = $("#fav-list");
  if (!list) return;
  const favs = getFavorites();
  list.innerHTML = "";
  favs.forEach(v => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${escapeHtml(v.reference)}</strong><br>${escapeHtml(v.text)}`;
    list.appendChild(li);
  });
}
function exportFavorites() {
  const data = JSON.stringify(getFavorites(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `faithping-favorites-${todayKey()}.json`;
  a.click();
}
function importFavorites(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const arr = JSON.parse(reader.result);
      if (Array.isArray(arr)) {
        saveJSON(STORAGE_KEYS.favorites, arr);
        renderFavList();
        alert("Favorites imported.");
      } else throw new Error();
    } catch { alert("Invalid favorites file."); }
  };
  reader.readAsText(file);
}

// ===== Rendering =====
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
function renderVerse(v) {
  CURRENT = v;
  $("#verse-ref").textContent = v.reference;
  $("#verse-text").textContent = v.text;
  $("#modal-ref").textContent = v.reference;
  $("#modal-text").textContent = v.text;
  $("#time-label").textContent = new Date().toLocaleString();
  renderFavButton();
}
function showModal() {
  const dlg = $("#verse-modal");
  if (!dlg.open) dlg.showModal();
}
function closeModal() {
  const dlg = $("#verse-modal");
  if (dlg.open) dlg.close();
}

// ===== Scheduling =====
function markShownToday() { localStorage.setItem(STORAGE_KEYS.lastShown, todayKey()); }
function lastShown() { return localStorage.getItem(STORAGE_KEYS.lastShown) || ""; }
function setSnooze(minutes) {
  const t = new Date(Date.now() + minutes*60*1000);
  localStorage.setItem(STORAGE_KEYS.snoozeUntil, t.toISOString());
}
function snoozeUntil() { return localStorage.getItem(STORAGE_KEYS.snoozeUntil); }

function checkScheduleTick() {
  const nowd = new Date();
  const today = todayKey(nowd);
  const target = SETTINGS.time || DEFAULT_TIME;
  const {h,m} = parseHHMM(target);

  // Snooze logic
  const snoozeISO = snoozeUntil();
  if (snoozeISO) {
    const snoozeAt = new Date(snoozeISO);
    if (nowd < snoozeAt) return; // still snoozing
    localStorage.removeItem(STORAGE_KEYS.snoozeUntil);
  }

  // Show once per day
  if (lastShown() === today) return;

  if (nowd.getHours() > h || (nowd.getHours() === h && nowd.getMinutes() >= m)) {
    // it is time (or after)
    const v = pickVerseForDate(today);
    if (v) {
      renderVerse(v);
      showModal();
      markShownToday();
    }
  }
}

// ===== Share/Copy =====
function shareCurrent() {
  if (!CURRENT) return;
  const text = `${CURRENT.reference}\n\n${CURRENT.text}\n— Sent via FaithPing`;
  if (navigator.share) {
    navigator.share({ title: CURRENT.reference, text });
  } else {
    copyToClipboard(text).then(()=>alert("Copied to clipboard")).catch(()=>{});
  }
}
function copyCurrent() {
  if (!CURRENT) return;
  const text = `${CURRENT.reference}\n\n${CURRENT.text}`;
  copyToClipboard(text).then(()=>alert("Copied!")).catch(()=>{});
}

// ===== Settings UI =====
function loadSettingsUI() {
  $("#set-time").value = SETTINGS.time || DEFAULT_TIME;
  $("#set-lang").value = SETTINGS.lang || "EN";
  $("#set-theme").value = SETTINGS.theme || "light";
}
function saveSettings() {
  SETTINGS.time = $("#set-time").value || DEFAULT_TIME;
  SETTINGS.lang = $("#set-lang").value || "EN";
  SETTINGS.theme = $("#set-theme").value || "light";
  saveJSON(STORAGE_KEYS.settings, SETTINGS);
  applyTheme(SETTINGS.theme);
}

// ===== Init =====
async function init() {
  // Register SW
  if ("serviceWorker" in navigator) {
    try { await navigator.serviceWorker.register("./service-worker.js"); } catch {}
  }

  // Load verses
  try {
    const res = await fetch("verses.json", { cache: "no-store" });
    VERSES = await res.json();
  } catch {
    console.error("Failed to load verses.json");
    VERSES = [];
  }

  // Render today's verse immediately
  const v = pickVerseForDate(todayKey());
  if (v) renderVerse(v);

  // Apply settings
  document.getElementById("year").textContent = new Date().getFullYear();
  applyTheme(SETTINGS.theme);
  loadSettingsUI();
  renderFavList();
  document.getElementById("today-label").textContent = "Today (Africa/Gaborone):";

  // Events
  $("#btn-show-now").addEventListener("click", (e)=>{ e.preventDefault(); showModal(); });
  $("#btn-open-settings").addEventListener("click", ()=> $("#settings").showModal());
  $("#btn-open-favs").addEventListener("click", ()=> $("#favorites").showModal());
  $("#btn-close-favs").addEventListener("click", ()=> $("#favorites").close());

  $("#btn-next").addEventListener("click", ()=> renderVerse(randomVerse(CURRENT?.id)));
  $("#btn-share").addEventListener("click", shareCurrent);
  $("#btn-copy").addEventListener("click", copyCurrent);
  $("#btn-fav").addEventListener("click", ()=> toggleFav(CURRENT));

  $("#modal-share").addEventListener("click", shareCurrent);
  $("#modal-copy").addEventListener("click", copyCurrent);
  $("#modal-fav").addEventListener("click", ()=> toggleFav(CURRENT));
  $("#modal-snooze").addEventListener("click", ()=> { setSnooze(MODAL_SNOOZE_MIN); closeModal(); });
  $("#modal-close").addEventListener("click", closeModal);

  $("#btn-save-settings").addEventListener("click", saveSettings);
  $("#btn-export").addEventListener("click", exportFavorites);
  $("#import-file").addEventListener("change", (e)=> {
    const f = e.target.files?.[0]; if (f) importFavorites(f);
    e.target.value = "";
  });

  // Schedule tick every 30s
  setInterval(checkScheduleTick, 30*1000);
  // First tick soon
  setTimeout(checkScheduleTick, 1000);
}

document.addEventListener("DOMContentLoaded", init);
