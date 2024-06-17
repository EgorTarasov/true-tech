export const getTimeDifference = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} ${declineWord(years, "год", "года", "лет")} назад`;
  }
  if (months > 0) {
    return `${months} ${declineWord(months, "месяц", "месяца", "месяцев")} назад`;
  }
  if (days > 0) {
    return `${days} ${declineWord(days, "день", "дня", "дней")} назад`;
  }
  if (hours > 0) {
    return `${hours} ${declineWord(hours, "час", "часа", "часов")} назад`;
  }
  if (minutes > 0) {
    return `${minutes} ${declineWord(minutes, "минута", "минуты", "минут")} назад`;
  }
  return `${seconds} ${declineWord(seconds, "секунда", "секунды", "секунд")} назад`;
};

function declineWord(number: number, one: string, two: string, five: string): string {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
}
