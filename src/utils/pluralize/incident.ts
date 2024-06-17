export function pluralizeIncident(count: number): string {
  const singular = "событии";
  const few = "событиях";

  if (count % 10 === 1 && count % 100 !== 11) {
    return singular;
  }
  return few;
}
