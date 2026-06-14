const ISTANBUL_TZ = "Europe/Istanbul";

export function getIstanbulNow(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: ISTANBUL_TZ }),
  );
}

export function formatTurkishDate(date = getIstanbulNow()): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ISTANBUL_TZ,
  }).format(date);
}

export function formatTurkishDateShort(date = getIstanbulNow()): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: ISTANBUL_TZ,
  }).format(date);
}

export function getTodayIso(): string {
  const now = getIstanbulNow();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isDutyDayChanged(): boolean {
  const now = getIstanbulNow();
  return now.getHours() >= 9;
}
