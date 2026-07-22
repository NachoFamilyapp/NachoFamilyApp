export type ToegangCategorie = "groen" | "oranje" | "blauw" | "rood";

export interface AttractieToegang {
  nummer: number;
  naam: string;
  // Ondergrens per categorie, van laag naar hoog. Elke drempel is de
  // minimale lengte (cm) om in die categorie te vallen.
  // rood = geen toegang, oranje = onder begeleiding (begeleider 14+),
  // blauw = onder begeleiding (begeleider 18+), groen = vrije toegang.
  drempels: { vanaf: number; categorie: ToegangCategorie }[];
}

// Overgenomen van de Slagharen-lengtetabel (zomer 2026).
export const SLAGHAREN_ATTRACTIES: AttractieToegang[] = [
  { nummer: 1, naam: "Mine Train", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 90, categorie: "oranje" }, { vanaf: 120, categorie: "groen" }] },
  { nummer: 2, naam: "Ripsaw Falls", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 105, categorie: "oranje" }, { vanaf: 130, categorie: "groen" }] },
  { nummer: 3, naam: "The Passepartout Explorer (kleine baan)", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 110, categorie: "groen" }] },
  { nummer: 3, naam: "The Passepartout Explorer (grote baan)", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 140, categorie: "groen" }] },
  { nummer: 4, naam: "Enterprise", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 130, categorie: "oranje" }, { vanaf: 140, categorie: "groen" }] },
  { nummer: 5, naam: "Jumbo", drempels: [{ vanaf: 0, categorie: "oranje" }, { vanaf: 105, categorie: "groen" }] },
  { nummer: 6, naam: "Pioneer Express 63", drempels: [{ vanaf: 0, categorie: "oranje" }, { vanaf: 130, categorie: "groen" }] },
  { nummer: 7, naam: "Merry Go Mad", drempels: [{ vanaf: 0, categorie: "oranje" }, { vanaf: 120, categorie: "groen" }] },
  { nummer: 8, naam: "Fogg's Trouble", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 90, categorie: "oranje" }, { vanaf: 110, categorie: "groen" }] },
  { nummer: 9, naam: "Cable Car", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 100, categorie: "oranje" }, { vanaf: 130, categorie: "groen" }] },
  { nummer: 10, naam: "Expedition Nautilus", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 90, categorie: "oranje" }, { vanaf: 130, categorie: "groen" }] },
  { nummer: 11, naam: "Magic Bikes", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 90, categorie: "oranje" }, { vanaf: 120, categorie: "groen" }] },
  { nummer: 12, naam: "El Torito", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 120, categorie: "oranje" }, { vanaf: 130, categorie: "groen" }] },
  { nummer: 13, naam: "Free Fall", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 140, categorie: "oranje" }, { vanaf: 195, categorie: "groen" }] },
  { nummer: 14, naam: "Apollo", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 120, categorie: "groen" }] },
  { nummer: 15, naam: "Gallopers", drempels: [{ vanaf: 0, categorie: "oranje" }, { vanaf: 120, categorie: "groen" }] },
  { nummer: 16, naam: "Sky Tower", drempels: [{ vanaf: 0, categorie: "oranje" }, { vanaf: 130, categorie: "groen" }] },
  { nummer: 17, naam: "El Teatro", drempels: [{ vanaf: 0, categorie: "groen" }] },
  { nummer: 18, naam: "Big Wheel", drempels: [{ vanaf: 0, categorie: "blauw" }, { vanaf: 140, categorie: "groen" }] },
  { nummer: 19, naam: "White Water", drempels: [{ vanaf: 0, categorie: "oranje" }, { vanaf: 100, categorie: "groen" }] },
  { nummer: 20, naam: "Gold Rush", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 130, categorie: "groen" }] },
  { nummer: 21, naam: "Old Timers", drempels: [{ vanaf: 0, categorie: "oranje" }, { vanaf: 120, categorie: "groen" }] },
  { nummer: 22, naam: "Rosie's Tea Party", drempels: [{ vanaf: 0, categorie: "oranje" }, { vanaf: 100, categorie: "groen" }] },
  { nummer: 23, naam: "Convoy Race", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 70, categorie: "oranje" }, { vanaf: 120, categorie: "groen" }] },
  { nummer: 24, naam: "Chuck Wagon", drempels: [{ vanaf: 0, categorie: "oranje" }, { vanaf: 120, categorie: "groen" }] },
  { nummer: 25, naam: "Tomahawk", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 120, categorie: "oranje" }, { vanaf: 130, categorie: "groen" }] },
  { nummer: 26, naam: "The Pirate", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 100, categorie: "oranje" }, { vanaf: 120, categorie: "groen" }] },
  { nummer: 27, naam: "Red Bandits Adventure", drempels: [{ vanaf: 0, categorie: "oranje" }, { vanaf: 130, categorie: "groen" }] },
  { nummer: 28, naam: "Sky Sifter Zilver (schommelen)", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 120, categorie: "groen" }] },
  { nummer: 28, naam: "Sky Sifter Goud (over de kop)", drempels: [{ vanaf: 0, categorie: "rood" }, { vanaf: 130, categorie: "groen" }] },
];

export function categorieVoorLengte(
  attractie: AttractieToegang,
  lengteCm: number
): ToegangCategorie {
  let result: ToegangCategorie = attractie.drempels[0].categorie;

  for (const drempel of attractie.drempels) {
    if (lengteCm >= drempel.vanaf) {
      result = drempel.categorie;
    }
  }

  return result;
}

export const TOEGANG_LABELS: Record<
  ToegangCategorie,
  { label: string; kleur: string; emoji: string }
> = {
  groen: { label: "Vrije toegang", kleur: "bg-green-600", emoji: "✅" },
  oranje: {
    label: "Onder begeleiding (14+)",
    kleur: "bg-orange-500",
    emoji: "🟠",
  },
  blauw: {
    label: "Onder begeleiding (18+)",
    kleur: "bg-blue-600",
    emoji: "🔵",
  },
  rood: { label: "Geen toegang", kleur: "bg-red-700", emoji: "⛔" },
};
