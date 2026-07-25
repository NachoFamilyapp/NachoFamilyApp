import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { PuntStreepSignaal } from "@/types/puntofstreep";

const SIGNAAL_DOC = doc(db, "puntofstreep", "signaal");

export class PuntStreepService {
  static async getSignaal(): Promise<PuntStreepSignaal> {
    const snapshot = await getDoc(SIGNAAL_DOC);

    if (!snapshot.exists()) {
      return { word: "", sentAt: 0 };
    }

    const data = snapshot.data();
    return { word: data.word ?? "", sentAt: data.sentAt ?? 0 };
  }

  static async stuurSignaal(word: string) {
    await setDoc(SIGNAAL_DOC, { word, sentAt: Date.now() });
  }

  static subscribeToSignaal(callback: (signaal: PuntStreepSignaal) => void) {
    return onSnapshot(SIGNAAL_DOC, (snapshot) => {
      if (!snapshot.exists()) {
        callback({ word: "", sentAt: 0 });
        return;
      }

      const data = snapshot.data();
      callback({ word: data.word ?? "", sentAt: data.sentAt ?? 0 });
    });
  }
}
