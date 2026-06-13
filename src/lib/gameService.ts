import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function createGame(
  gameCode: string,
  hostName: string
) {
  await setDoc(
    doc(db, "games", gameCode),
    {
      gameCode,
      hostName,

      status: "lobby",

      playArea: [],

      redFlag: null,

      blueFlag: null,

      players: [
        {
          name: hostName,
          host: true,
          team: "",
        },
      ],
    }
  );
}

export async function joinGame(
  gameCode: string,
  playerName: string
) {
  const gameRef = doc(
    db,
    "games",
    gameCode
  );

  const gameSnap =
    await getDoc(gameRef);

  if (!gameSnap.exists()) {
    throw new Error(
      "Game bestaat niet"
    );
  }

  const data =
    gameSnap.data();

  const players =
    data.players || [];

  const playerExists =
    players.some(
      (player: any) =>
        player.name === playerName
    );

  if (playerExists) {
    throw new Error(
      "Naam is al in gebruik"
    );
  }

  await updateDoc(
    gameRef,
    {
      players: [
        ...players,
        {
          name: playerName,
          host: false,
          team: "",
        },
      ],
    }
  );
}