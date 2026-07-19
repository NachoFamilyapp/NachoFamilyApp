export type Team = "red" | "blue";

export type GameStatus =
  | "waiting"
  | "running"
  | "paused"
  | "finished";

export type PlayerStatus =
  | "alive"
  | "tagged"
  | "respawning";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GameSettings {
  captureRadius: number;
  tagRadius: number;
  respawnTime: number;
  maxPlayers: number;
  gameDuration: number;
  friendlyFire: boolean;
  gpsAccuracy: number;
  scoreLimit: number;
  theme: string;
}

export interface Player {
  id: string;
  name: string;

  team: Team;

  host: boolean;

  lat: number;
  lng: number;

  heading: number;

  score: number;

  status: PlayerStatus;

  online: boolean;

  alive: boolean;

  hasFlag: boolean;

  lastUpdate: number;
}

export interface Flag {
  id: string;

  team: Team;

  position: LatLng;

  basePosition: LatLng;

  carriedBy: string | null;

  captured: boolean;
}

export interface TagEvent {
  taggedPlayer: string;

  taggedBy: string;

  time: number;
}

export interface Game {

  gameCode: string;

  gameName: string;

  status: GameStatus;

  createdAt?: unknown;

  startTime: number | null;

  endTime: number | null;

  players: Record<string, Player>;

  flags: Flag[];

  playArea: LatLng[];

  settings: GameSettings;

  winner: Team | null;

  winnerPlayer: string | null;

  gpsTestMode: boolean;

  lastTag: TagEvent | null;
}