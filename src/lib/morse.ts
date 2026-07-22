// Standaard internationale morsecode-tijdseenheden:
// punt = 1 eenheid, streep = 3 eenheden
// pauze binnen letter = 1 eenheid, tussen letters = 3 eenheden, tussen woorden = 7 eenheden

const MORSE_CODE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
};

export type FlashStep = { on: boolean; duration: number };

/**
 * Zet tekst om naar een reeks aan/uit-stappen (in milliseconden) die
 * de morsecode van die tekst als lichtsignaal weergeven.
 */
export function textToFlashSequence(text: string, unit = 180): FlashStep[] {
  const steps: FlashStep[] = [];

  const words = text.trim().toUpperCase().split(/\s+/);

  words.forEach((word, wordIndex) => {
    [...word].forEach((letter, letterIndex) => {
      const pattern = MORSE_CODE[letter];

      if (!pattern) return;

      [...pattern].forEach((symbol, symbolIndex) => {
        steps.push({ on: true, duration: symbol === "." ? unit : unit * 3 });

        const isLastSymbol = symbolIndex === pattern.length - 1;

        if (!isLastSymbol) {
          steps.push({ on: false, duration: unit });
        }
      });

      const isLastLetter = letterIndex === word.length - 1;

      if (!isLastLetter) {
        steps.push({ on: false, duration: unit * 3 });
      }
    });

    const isLastWord = wordIndex === words.length - 1;

    if (!isLastWord) {
      steps.push({ on: false, duration: unit * 7 });
    }
  });

  return steps;
}
