export type GameMode = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;

  settings: {
    captureRadius: number;
    captureTime: number;
    maxTeams: number;
    maxPlayers: number;
    showCompass: boolean;
    showMap: boolean;
    showEnemies: boolean;
    allowRespawn: boolean;
    allowPowerUps: boolean;
    allowGPS: boolean;
  };
};

export const GameModes: Record<string, GameMode> = {

  capture: {

    id: "capture",

    name: "Capture the Flag",

    description: "Verover de vlag van het andere team.",

    icon: "🚩",

    color: "#ef4444",

    settings: {

      captureRadius: 15,

      captureTime: 10,

      maxTeams: 2,

      maxPlayers: 20,

      showCompass: true,

      showMap: true,

      showEnemies: false,

      allowRespawn: true,

      allowPowerUps: true,

      allowGPS: true,

    },

  },

  detective: {

    id: "detective",

    name: "Detective",

    description: "Los samen mysterieuze opdrachten op.",

    icon: "🕵️",

    color: "#3b82f6",

    settings: {

      captureRadius: 0,

      captureTime: 0,

      maxTeams: 6,

      maxPlayers: 30,

      showCompass: true,

      showMap: true,

      showEnemies: false,

      allowRespawn: false,

      allowPowerUps: false,

      allowGPS: true,

    },

  },

  quiz: {

    id: "quiz",

    name: "Quiz",

    description: "Beantwoord vragen op locatie.",

    icon: "❓",

    color: "#f59e0b",

    settings: {

      captureRadius: 0,

      captureTime: 0,

      maxTeams: 8,

      maxPlayers: 50,

      showCompass: true,

      showMap: true,

      showEnemies: false,

      allowRespawn: false,

      allowPowerUps: false,

      allowGPS: true,

    },

  },

};