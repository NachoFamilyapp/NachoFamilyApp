export interface ZoekObject {
  naam: string;
  emoji: string;
  x: number; // percentage (0-100) van de afbeeldingsbreedte
  y: number; // percentage (0-100) van de afbeeldingshoogte
  ingesteld: boolean; // false zolang de beheerder de locatie nog niet heeft gezet
}

export interface Zoekspel {
  id: string;
  titel: string;
  afbeelding: string;
  objecten: { naam: string; emoji: string }[]; // zonder x/y, voor de speler-checklist
  aantalObjecten: number;
  aangemaaktOp: number;
}

export interface ZoekspelVoortgang {
  spelId: string;
  userId: string;
  userName: string;
  gevondenIndices: number[];
  gestartOp: number;
  voltooidOp: number | null;
  tijdInSeconden: number | null;
}
