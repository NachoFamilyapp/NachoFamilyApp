import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { NoodBroadcast } from "@/types/noodbericht";

const NOOD_DOC = doc(db, "noodbericht", "broadcast");

export class NoodberichtService {
  static async getBroadcast(): Promise<NoodBroadcast> {
    const snapshot = await getDoc(NOOD_DOC);

    if (!snapshot.exists()) {
      return { message: "", sentAt: 0, targetType: "alle", targetUids: [] };
    }

    return snapshot.data() as NoodBroadcast;
  }

  static async stuurBericht(
    message: string,
    targetType: "alle" | "specifiek",
    targetUids: string[]
  ) {
    await setDoc(NOOD_DOC, {
      message,
      sentAt: Date.now(),
      targetType,
      targetUids,
    });
  }

  static subscribeToBroadcast(callback: (broadcast: NoodBroadcast) => void) {
    return onSnapshot(NOOD_DOC, (snapshot) => {
      if (!snapshot.exists()) {
        callback({ message: "", sentAt: 0, targetType: "alle", targetUids: [] });
        return;
      }

      callback(snapshot.data() as NoodBroadcast);
    });
  }
}
