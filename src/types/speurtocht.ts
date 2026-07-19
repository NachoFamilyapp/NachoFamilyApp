export interface SpeurtochtCheckpoint {
  id: string;
  emoji: string;
  question: string;
  options: string[];
  correctIndex: number;
  letter: string;
  targetName: string;
  lat: number | null;
  lng: number | null;
  radius: number;
}

export interface KompasSpeurtocht {
  title: string;
  intro: string;
  startLat: number;
  startLng: number;
  checkpoints: SpeurtochtCheckpoint[];
  finalWord: string;
  finalMessage: string;
  active: boolean;
  updatedAt?: unknown;
}

export interface FotoUitdaging {
  id: string;
  title: string;
  hint: string;
  referenceImage: string;
  points: number;
  createdAt: number;
}

export interface FotoInzending {
  id: string;
  challengeId: string;
  playerName: string;
  photoImage: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: number;
}

export interface FotospelSettings {
  active: boolean;
}
