import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  deleteField,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  Game,
  Player,
  LatLng,
} from "@/types/game";

export class FirebaseGame {

  static gameRef(
    gameCode: string
  ) {
    return doc(
      db,
      "games",
      gameCode
    );
  }

  static async createGame(
    game: Game
  ) {

    await setDoc(
      this.gameRef(
        game.gameCode
      ),
      {
        ...game,
        createdAt: serverTimestamp(),
      }
    );
  }

  static async getGame(
    gameCode: string
  ): Promise<Game | null> {

    const snap = await getDoc(
      this.gameRef(gameCode)
    );

    if (!snap.exists()) {
      return null;
    }

    return snap.data() as Game;

  }

  static listen(
    gameCode: string,
    callback: (
      game: Game
    ) => void
  ) {

    return onSnapshot(
      this.gameRef(gameCode),
      (snapshot) => {

        if (!snapshot.exists()) {
          return;
        }

        callback(
          snapshot.data() as Game
        );

      }
    );

  }

  static async updatePlayer(
    gameCode: string,
    player: Player
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        [`players.${player.id}`]: player,
      }
    );

  }

  static async removePlayer(
    gameCode: string,
    playerId: string
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        [`players.${playerId}`]:
          deleteField(),
      }
    );

  }
    static async updatePosition(
    gameCode: string,
    playerId: string,
    position: LatLng
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        [`players.${playerId}.lat`]:
          position.lat,

        [`players.${playerId}.lng`]:
          position.lng,

        [`players.${playerId}.lastUpdate`]:
          Date.now(),
      }
    );

  }

  static async updateHeading(
    gameCode: string,
    playerId: string,
    heading: number
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        [`players.${playerId}.heading`]:
          heading,

        [`players.${playerId}.lastUpdate`]:
          Date.now(),
      }
    );

  }

  static async updateScore(
    gameCode: string,
    playerId: string,
    score: number
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        [`players.${playerId}.score`]:
          score,
      }
    );

  }

  static async updateStatus(
    gameCode: string,
    status: Game["status"]
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        status,
      }
    );

  }

  static async updateGame(
    gameCode: string,
    data: Partial<Game>
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      data
    );

  }

  static async setPlayArea(
    gameCode: string,
    playArea: LatLng[]
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        playArea,
      }
    );

  }

  static async setFlags(
    gameCode: string,
    flags: Game["flags"]
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        flags,
      }
    );

  }

  static async setWinner(
    gameCode: string,
    winner: Game["winner"],
    winnerPlayer: string | null = null
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        winner,
        winnerPlayer,
      }
    );

  }
    static async startGame(
    gameCode: string
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        status: "running",
        startTime: Date.now(),
      }
    );

  }

  static async pauseGame(
    gameCode: string
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        status: "paused",
      }
    );

  }

  static async finishGame(
    gameCode: string
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        status: "finished",
        endTime: Date.now(),
      }
    );

  }

  static async setGpsTestMode(
    gameCode: string,
    enabled: boolean
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        gpsTestMode: enabled,
      }
    );

  }

  static async updateLastTag(
    gameCode: string,
    lastTag: Game["lastTag"]
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        lastTag,
      }
    );

  }

  static async updateSettings(
    gameCode: string,
    settings: Game["settings"]
  ) {

    await updateDoc(
      this.gameRef(gameCode),
      {
        settings,
      }
    );

  }

  static async gameExists(
    gameCode: string
  ): Promise<boolean> {

    const snap = await getDoc(
      this.gameRef(gameCode)
    );

    return snap.exists();

  }

}