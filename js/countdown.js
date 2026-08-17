/**
 * Eternal Bloom - Countdown Timer & Calendar Export Logic
 * Wedding of Theres & Midhun
 */

const WEDDING_CONFIG = {
  coupleNames: 'Theres & Midhun',
  title: 'Theres & Midhun’s Wedding Celebration',
  // Target: Saturday, November 21, 2026 at 10:00 AM IST (+05:30)
  date: new Date('2026-11-21T10:00:00+05:30'),
  location: 'St. Mary’s Forane Church, Alakode, Kannur, Kerala, India',
  description: 'The Wedding Ceremony of Theres & Midhun. St. Mary’s Forane Church, Alakode at 10:00 AM, followed by the Grand Reception.'
};

function initCountdown() {
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMins');
  const secsEl = document.getElementById('cdSecs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = WEDDING_CONFIG.date.getTime() - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      const label = document.querySelector('.countdown-header-note');
      if (label) label.textContent = 'Today is the Day! Celebrating Forever.';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// Export to Google Calendar (Nov 21, 2026 10:00 AM IST = 04:30 UTC)
function addToGoogleCalendar() {
  const startIso = '20261121T043000Z';
  const endIso = '20261121T123000Z';
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(WEDDING_CONFIG.title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(WEDDING_CONFIG.description)}&location=${encodeURIComponent(WEDDING_CONFIG.location)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Download iCal (.ics) file
function downloadIcsCalendar() {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Eternal Bloom//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'SUMMARY:' + WEDDING_CONFIG.title,
    'UID:wedding-theres-midhun-2026@eternalbloom.love',
    'DTSTART:20261121T043000Z',
    'DTEND:20261121T123000Z',
    'LOCATION:' + WEDDING_CONFIG.location,
    'DESCRIPTION:' + WEDDING_CONFIG.description,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'Theres-Midhun-Wedding.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();

  const gCalBtn = document.getElementById('btnGoogleCalendar');
  const icsBtn = document.getElementById('btnIcsCalendar');

  if (gCalBtn) gCalBtn.addEventListener('click', addToGoogleCalendar);
  if (icsBtn) icsBtn.addEventListener('click', downloadIcsCalendar);
});
