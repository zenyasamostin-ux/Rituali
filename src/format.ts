/** "четверг, 22 октября" → "Четверг, 22 октября". */
export function formatDay(date: Date, language: string, withTime = false): string {
  const text = date.toLocaleString(language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(withTime && { hour: '2-digit', minute: '2-digit' }),
  });
  return text.charAt(0).toLocaleUpperCase(language) + text.slice(1);
}
