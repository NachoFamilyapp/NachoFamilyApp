import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { LijstConfig, LijstInzending, LijstSoort } from "@/types/lijstUitdaging";

const CONFIG_COL = collection(db, "speurtocht_lijst_config");
const INZENDINGEN_COL = collection(db, "speurtocht_lijst_inzendingen");

function standaardConfig(soort: LijstSoort): LijstConfig {
  if (soort === "geheimschrift") {
    return { aantalRegels: 1, puntenPerRegel: 15 };
  }

  if (soort === "puntofstreep") {
    return { aantalRegels: 0, puntenPerRegel: 1, woorden: [] };
  }

  return { aantalRegels: 6, puntenPerRegel: 1 };
}

function inzendingId(soort: LijstSoort, userId: string) {
  return `${soort}__${userId}`;
}

export class LijstUitdagingService {
  static async getConfig(soort: LijstSoort): Promise<LijstConfig> {
    const snapshot = await getDoc(doc(CONFIG_COL, soort));

    if (!snapshot.exists()) {
      return standaardConfig(soort);
    }

    return { ...standaardConfig(soort), ...snapshot.data() } as LijstConfig;
  }

  static async setConfig(soort: LijstSoort, config: LijstConfig) {
    await setDoc(doc(CONFIG_COL, soort), config);
  }

  static async submitRegels(
    soort: LijstSoort,
    userId: string,
    userName: string,
    team: string,
    regels: string[]
  ) {
    const inzending: LijstInzending = {
      soort,
      userId,
      userName,
      team,
      regels,
      goedgekeurd: regels.map(() => false),
      submittedAt: Date.now(),
    };

    await setDoc(doc(INZENDINGEN_COL, inzendingId(soort, userId)), inzending);
  }

  static async getEigenInzending(
    soort: LijstSoort,
    userId: string
  ): Promise<LijstInzending | null> {
    const snapshot = await getDoc(doc(INZENDINGEN_COL, inzendingId(soort, userId)));

    if (!snapshot.exists()) return null;

    return snapshot.data() as LijstInzending;
  }

  static async getInzendingen(soort: LijstSoort): Promise<LijstInzending[]> {
    const snapshot = await getDocs(
      query(INZENDINGEN_COL, where("soort", "==", soort))
    );

    return snapshot.docs.map((d) => d.data() as LijstInzending);
  }

  static async setGoedkeuring(
    soort: LijstSoort,
    userId: string,
    goedgekeurd: boolean[]
  ) {
    await setDoc(
      doc(INZENDINGEN_COL, inzendingId(soort, userId)),
      { goedgekeurd },
      { merge: true }
    );
  }

  static async getTeamPunten(soort: LijstSoort, team: string): Promise<number> {
    const [config, inzendingen] = await Promise.all([
      this.getConfig(soort),
      this.getInzendingen(soort),
    ]);

    return inzendingen
      .filter((i) => i.team === team)
      .reduce(
        (sum, i) =>
          sum + i.goedgekeurd.filter(Boolean).length * config.puntenPerRegel,
        0
      );
  }

  static async getUserPunten(soort: LijstSoort, userId: string): Promise<number> {
    const [config, inzending] = await Promise.all([
      this.getConfig(soort),
      this.getEigenInzending(soort, userId),
    ]);

    if (!inzending) return 0;

    return inzending.goedgekeurd.filter(Boolean).length * config.puntenPerRegel;
  }
}
