import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { MorseWoordBroadcast } from "@/types/morse";

const WOORD_DOC = doc(db, "morse", "woord");

export class MorseGameService {
  static async getWoord(): Promise<MorseWoordBroadcast> {
    const snapshot = await getDoc(WOORD_DOC);

    if (!snapshot.exists()) {
      return { word: "", sentAt: 0 };
    }

    return snapshot.data() as MorseWoordBroadcast;
  }

  static async stuurWoord(word: string) {
    await setDoc(WOORD_DOC, { word, sentAt: Date.now() });
  }

  static subscribeToWoord(
    callback: (broadcast: MorseWoordBroadcast) => void
  ) {
    return onSnapshot(WOORD_DOC, (snapshot) => {
      if (!snapshot.exists()) {
        callback({ word: "", sentAt: 0 });
        return;
      }

      callback(snapshot.data() as MorseWoordBroadcast);
    });
  }
}
