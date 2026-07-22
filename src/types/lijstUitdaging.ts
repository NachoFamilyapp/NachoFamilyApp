export type LijstSoort = "herinner" | "puntofstreep" | "geheimschrift";

export interface LijstConfig {
  aantalRegels: number;
  puntenPerRegel: number;
  woorden?: string[]; // alleen gebruikt bij "puntofstreep"
}

export interface LijstInzending {
  soort: LijstSoort;
  userId: string;
  userName: string;
  team: string;
  regels: string[];
  goedgekeurd: boolean[];
  submittedAt: number;
}
