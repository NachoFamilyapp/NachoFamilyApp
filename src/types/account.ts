export type PermissieNiveau = "geen" | "lezen" | "schrijven";

export interface Account {
  uid: string;
  username: string;
  displayName: string;
  isAdmin: boolean;
  createdAt: number;
  heeftFaceId: boolean;
}

export interface ModuleDefinitie {
  id: string;
  naam: string;
  icoon: string;
  route: string;
}

// Centraal register van de nieuwe, met echte accounts beveiligde
// onderdelen. Nieuwe onderdelen komen hier simpelweg bij, en
// verschijnen dan automatisch in de rechtenmatrix.
export const MODULES: ModuleDefinitie[] = [
  { id: "archief", naam: "Archief (oude Vakantie App)", icoon: "🗄️", route: "/archief" },
  { id: "games", naam: "Games", icoon: "🎮", route: "/games" },
];

export function heeftToegang(
  niveau: PermissieNiveau | undefined,
  benodigd: "lezen" | "schrijven"
): boolean {
  if (!niveau || niveau === "geen") return false;
  if (benodigd === "lezen") return niveau === "lezen" || niveau === "schrijven";
  return niveau === "schrijven";
}
