import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { MorseWoordBroadcast } from "@/types/morse";

const WOORD_DOC = doc(db, "morse", "woord");

export class MorseGameService {
  static async getWoord(): Promise<MorseWoordBroadcast> {
    const snapshot = await getDoc(WOORD_DOC);

    if (!snapshot.exists()) {
      return { word: "", sentAt: 0, eenheid: 180 };
    }

    const data = snapshot.data();
    return {
      word: data.word ?? "",
      sentAt: data.sentAt ?? 0,
      eenheid: data.eenheid ?? 180,
    };
  }

  static async stuurWoord(word: string, eenheid: number) {
    await setDoc(WOORD_DOC, { word, sentAt: Date.now(), eenheid });
  }

  static subscribeToWoord(
    callback: (broadcast: MorseWoordBroadcast) => void
  ) {
    return onSnapshot(WOORD_DOC, (snapshot) => {
      if (!snapshot.exists()) {
        callback({ word: "", sentAt: 0, eenheid: 180 });
        return;
      }

      const data = snapshot.data();
      callback({
        word: data.word ?? "",
        sentAt: data.sentAt ?? 0,
        eenheid: data.eenheid ?? 180,
      });
    });
  }
}
