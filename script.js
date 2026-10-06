"use strict";

/* =========================================================
   Ubah hanya dua baris di bawah untuk mengatur jadwal.
   Format ISO 8601 dengan zona waktu (WIB = +07:00).
   ========================================================= */
const MAINTENANCE_START = new Date("2026-10-06T20:00:00+07:00");
const MAINTENANCE_END = new Date("2026-10-30T21:00:00+07:00");
/* ========================================================= */

const unitEls = {
  days: document.querySelector('[data-unit="days"]'),
  hours: document.querySelector('[data-unit="hours"]'),
  minutes: document.querySelector('[data-unit="minutes"]'),
  seconds: document.querySelector('[data-unit="seconds"]'),
};

const progressFill = document.getElementById("progress-fill");
const progressTrack = document.getElementById("progress-track");
const progressValue = document.getElementById("progress-value");
const progressNote = document.getElementById("progress-note");
const etaStamp = document.getElementById("eta-stamp");

const pad = (value) => String(Math.max(0, value)).padStart(2, "0");

function setUnit(el, value) {
  const next = pad(value);
  if (!el || el.textContent === next) return;
  el.textContent = next;
  el.classList.remove("is-tick");
  void el.offsetWidth;
  el.classList.add("is-tick");
}

function formatStamp(date) {
  try {
    const formatted = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(date);
    return formatted + " WIB";
  } catch (error) {
    return date.toISOString();
  }
}

function updateProgress(now) {
  const span = MAINTENANCE_END.getTime() - MAINTENANCE_START.getTime();
  let percent = 100;

  if (span > 0) {
    percent = Math.round(((now - MAINTENANCE_START.getTime()) / span) * 100);
    percent = Math.min(100, Math.max(0, percent));
  }

  progressFill.style.width = percent + "%";
  progressTrack.setAttribute("aria-valuenow", String(percent));
  progressValue.textContent = percent + "%";
  return percent;
}

function tick() {
  const now = Date.now();
  const remaining = Math.max(0, MAINTENANCE_END.getTime() - now);

  setUnit(unitEls.days, Math.floor(remaining / 86400000));
  setUnit(unitEls.hours, Math.floor(remaining / 3600000) % 24);
  setUnit(unitEls.minutes, Math.floor(remaining / 60000) % 60);
  setUnit(unitEls.seconds, Math.floor(remaining / 1000) % 60);

  const percent = updateProgress(now);

  if (remaining === 0) {
    progressNote.textContent = "Pemeriksaan selesai. Halaman ini menyusul diperbarui.";
    if (percent >= 100) {
      etaStamp.textContent = "Selesai";
    }
  }
}

etaStamp.textContent = formatStamp(MAINTENANCE_END);
tick();
setInterval(tick, 1000);

/* ---------- Form notifikasi (tampilan saja, tanpa backend) ---------- */
const form = document.getElementById("notify-form");
const emailInput = document.getElementById("email");
const message = document.getElementById("notify-msg");

function clearMessage() {
  if (!emailInput.hasAttribute("aria-invalid")) return;
  emailInput.removeAttribute("aria-invalid");
  message.textContent = "";
  delete message.dataset.state;
}

emailInput.addEventListener("input", clearMessage);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = emailInput.value.trim();

  if (value === "" || !emailInput.checkValidity()) {
    emailInput.setAttribute("aria-invalid", "true");
    message.dataset.state = "error";
    message.textContent = "Masukkan alamat email yang valid, contoh nama@domain.com.";
    emailInput.focus();
    return;
  }

  emailInput.removeAttribute("aria-invalid");
  message.dataset.state = "success";
  message.textContent = "Siap. Kami kabari lewat " + value + " begitu situs kembali online.";
  form.reset();
});
