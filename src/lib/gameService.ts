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
      players: [
        {
          name: hostName,
          host: true,
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

  const data = gameSnap.data();

  await updateDoc(gameRef, {
    players: [
      ...(data.players || []),
      {
        name: playerName,
        host: false,
      },
    ],
  });
}