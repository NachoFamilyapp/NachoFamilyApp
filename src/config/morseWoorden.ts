export const MORSE_WOORDEN: string[] = [
  "ZON",
  "STRAND",
  "TENT",
  "TREIN",
  "VLAG",
  "KOMPAS",
  "ZWEMBAD",
  "ACHTBAAN",
  "PIRAAT",
  "COWBOY",
  "SCHAT",
  "KAMPVUUR",
];

export function randomWoorden(count: number, exclude: string): string[] {
  const pool = MORSE_WOORDEN.filter((w) => w !== exclude);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
