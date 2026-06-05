// ── Your regular weekly events (June 2026) ──────────────────────────
// dow: 0=Sun … 6=Sat. durationMin = length in minutes.
const WEEKLY = [
  { title: "Church",            emoji: "⛪", dow: 0, time: "10:30", durationMin: 90,  location: "" },
  { title: "Pilates on the Lake", emoji: "🧘", dow: 1, time: "18:00", durationMin: 60, location: "On the lake" },
  { title: "Dance",             emoji: "💃", dow: 2, time: "18:00", durationMin: 90,  location: "" },
  { title: "Dance",             emoji: "💃", dow: 4, time: "18:00", durationMin: 90,  location: "" },
  { title: "Run Club",          emoji: "👟", dow: 6, time: "08:00", durationMin: 60,  location: "" },
  { title: "Co-Working",        emoji: "💻", dow: 5, time: "09:00", durationMin: 180, location: "" },
];

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const PROPOSE_EMAIL = ""; // optional: put your email here to receive proposals via mailto

// Build the next occurrence (within June 2026) of each weekly event
function nextDateInJune(dow) {
  const start = new Date("2026-06-01T00:00:00");
  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d.getDay() === dow) return d;
  }
  return start;
}

function fmtGCalDate(dateObj, hhmm, addMin = 0) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(dateObj);
  d.setHours(h, m + addMin, 0, 0);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

function gcalLink({ title, dateObj, time, durationMin, location, details }) {
  const start = fmtGCalDate(dateObj, time, 0);
  const end = fmtGCalDate(dateObj, time, durationMin);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: details || "Friend Date 🎉",
    location: location || "",
    ctz: "America/Chicago",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ── Render event cards ──────────────────────────────────────────────
const grid = document.getElementById("events-grid");
WEEKLY.forEach((ev) => {
  const dateObj = nextDateInJune(ev.dow);
  const card = document.createElement("div");
  card.className = "event-card";
  card.innerHTML = `
    <span class="event-emoji">${ev.emoji}</span>
    <h3>${ev.title}</h3>
    <div class="event-when">${DAY_NAMES[ev.dow]}s · ${to12h(ev.time)}</div>
    ${ev.location ? `<div class="event-loc">${ev.location}</div>` : ""}
    <div class="event-join">Join me →</div>
  `;
  card.addEventListener("click", () => openModal(ev, dateObj));
  grid.appendChild(card);
});

function to12h(hhmm) {
  let [h, m] = hhmm.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2,"0")} ${ap}`;
}

// ── RSVP modal ──────────────────────────────────────────────────────
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDetail = document.getElementById("modal-detail");
const modalAdd = document.getElementById("modal-add");
const modalEmoji = document.getElementById("modal-emoji");
const rsvpName = document.getElementById("rsvp-name");
let currentEvent = null;

function openModal(ev, dateObj) {
  currentEvent = { ev, dateObj };
  if (modalEmoji) modalEmoji.textContent = ev.emoji;
  modalTitle.textContent = `Join me for ${ev.title}`;
  modalDetail.textContent = `${DAY_NAMES[ev.dow]} · ${to12h(ev.time)}${ev.location ? " · " + ev.location : ""}`;
  rsvpName.value = "";
  updateModalLink();
  modal.hidden = false;
}
function updateModalLink() {
  if (!currentEvent) return;
  const { ev, dateObj } = currentEvent;
  const who = rsvpName.value.trim();
  modalAdd.href = gcalLink({
    title: `Friend Date: ${ev.title}`,
    dateObj, time: ev.time, durationMin: ev.durationMin,
    location: ev.location,
    details: who ? `${who} is joining ${ev.title}! 🎉` : `Joining ${ev.title}! 🎉`,
  });
}
rsvpName.addEventListener("input", updateModalLink);
document.getElementById("modal-close").addEventListener("click", () => (modal.hidden = true));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.hidden = true; });

// ── Propose form ────────────────────────────────────────────────────
const typeSel = document.getElementById("type");
const otherField = document.getElementById("other-field");
typeSel.addEventListener("change", () => {
  otherField.hidden = typeSel.value !== "__other";
});

const form = document.getElementById("propose-form");
const hint = document.getElementById("form-hint");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const type = typeSel.value === "__other"
    ? (document.getElementById("type-other").value.trim() || "Friend Date")
    : typeSel.value;
  const date = document.getElementById("date").value;     // yyyy-mm-dd
  const time = document.getElementById("time").value;     // hh:mm
  const location = document.getElementById("location").value.trim();
  const note = document.getElementById("note").value.trim();
  const from = document.getElementById("from").value.trim();

  const dateObj = new Date(`${date}T00:00:00`);
  const details = `Proposed by ${from}.` + (note ? ` Note: ${note}` : "");
  const link = gcalLink({
    title: `Friend Date: ${type}`,
    dateObj, time, durationMin: 120, location, details,
  });

  // Open a prefilled Google Calendar event for review + offer email
  window.open(link, "_blank");

  if (PROPOSE_EMAIL) {
    const subject = encodeURIComponent(`Friend Date idea: ${type}`);
    const body = encodeURIComponent(
      `${from} proposed a friend date!\n\nType: ${type}\nDate: ${date}\nTime: ${to12h(time)}\nLocation: ${location}\nNote: ${note || "—"}`
    );
    window.location.href = `mailto:${PROPOSE_EMAIL}?subject=${subject}&body=${body}`;
  }

  hint.textContent = "Nice! I opened a calendar draft — review and save it. 🎉";
  form.reset();
  otherField.hidden = true;
});
