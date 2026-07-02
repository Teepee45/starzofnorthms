// Single source of truth for shop hours + open/closed state.
// Schedule: Mon–Sat 9 AM – 6 PM (Central time). Sunday closed.
const OPEN_HOUR = 9; // 9 AM
const CLOSE_HOUR = 18; // 6 PM
const TZ = "America/Chicago";

// Read the current weekday/hour in the SHOP's timezone, so the status is
// correct no matter where the visitor is browsing from.
function shopNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const weekdayIndex = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const weekday = weekdayIndex[map.weekday];
  let hour = parseInt(map.hour, 10);
  if (hour === 24) hour = 0; // hour12:false can report 24 at midnight
  return { weekday, hour };
}

// True when the shop is currently open for walk-ins.
export function isOpenNow() {
  const { weekday, hour } = shopNow();
  if (weekday === 0) return false; // Sunday: closed
  return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

// Short label for the status pill.
export function hoursStatusLabel() {
  const { weekday } = shopNow();
  if (isOpenNow()) return "Open · Closes 6 PM";
  if (weekday === 0) return "Closed today · Opens Mon 9 AM";
  return "Closed · Opens 9 AM";
}

// When the shop is closed, walk-ins aren't possible — so the button asks the
// visitor to buy/reserve an appointment instead of "Book Now".
export function bookCtaLabel() {
  return isOpenNow() ? "Book Now" : "Buy Appointment";
}
