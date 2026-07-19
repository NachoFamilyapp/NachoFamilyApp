export type LatLng = {
  lat: number;
  lng: number;
};

export type TeamColor =
  | "red"
  | "blue"
  | "green"
  | "yellow";

export type PlayerStatus =
  | "alive"
  | "respawning"
  | "offline";

export interface Player {

  id: string;

  name: string;

  team: TeamColor;

  lat: number;

  lng: number;

  heading: number;

  accuracy: number;

  score: number;

  status: PlayerStatus;

  online: boolean;

  battery?: number;

  lastUpdate: number;

}

export interface Flag {

  id: string;

  team: TeamColor;

  position: LatLng;

  captured: boolean;

  capturedBy?: string;

}

export interface Checkpoint {

  id: string;

  name: string;

  position: LatLng;

  points: number;

  completedBy: string[];

}

export interface Mission {

  id: string;

  title: string;

  description: string;

  points: number;

  completed: boolean;

}

export interface PowerUp {

  id: string;

  type:
    | "shield"
    | "speed"
    | "radar"
    | "heal";

  position: LatLng;

  active: boolean;

}

export interface GameSettings {

  gameName: string;

  hostName: string;

  playerLimit: number;

  teamCount: number;

  captureRadius: number;

  captureTime: number;

  respawnTime: number;

  showEnemies: boolean;

  showCompass: boolean;

  showMap: boolean;

  allowPowerUps: boolean;

}

export interface Game {

  gameCode: string;

  status:
    | "lobby"
    | "running"
    | "paused"
    | "finished";

  createdAt: number;

  host: string;

  settings: GameSettings;

  players: Record<string, Player>;

  playArea: LatLng[];

  flags: Flag[];

  checkpoints: Checkpoint[];

  powerUps: PowerUp[];

}