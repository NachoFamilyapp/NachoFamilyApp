export type LijstSoort = "herinner" | "puntofstreep" | "geheimschrift";

export interface LijstConfig {
  aantalRegels: number;
  puntenPerRegel: number;
  woorden?: string[]; // alleen gebruikt bij "puntofstreep"
  hintFotos?: string[]; // optionele hint-afbeeldingen voor spelers
}

export type LijstRegelStatus = "onbeoordeeld" | "goedgekeurd" | "afgekeurd";

export interface LijstInzending {
  soort: LijstSoort;
  userId: string;
  userName: string;
  team: string;
  regels: string[];
  status: LijstRegelStatus[];
  submittedAt: number;
}
