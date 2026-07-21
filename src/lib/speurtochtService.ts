import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { DEFAULT_KOMPAS_SPEURTOCHT } from "@/config/speurtochtDefault";
import {
  KompasSpeurtocht,
  FotoUitdaging,
  FotoInzending,
  OnderdelenSettings,
} from "@/types/speurtocht";

const KOMPAS_DOC = doc(db, "speurtocht", "kompas");
const ONDERDELEN_DOC = doc(db, "speurtocht", "onderdelen");
const UITDAGINGEN_COL = collection(db, "speurtocht_uitdagingen");
const INZENDINGEN_COL = collection(db, "speurtocht_inzendingen");

export class SpeurtochtService {

  // ---------- Kompas speurtocht ----------

  static async getKompasSpeurtocht(): Promise<KompasSpeurtocht> {
    const snapshot = await getDoc(KOMPAS_DOC);

    if (!snapshot.exists()) {
      return DEFAULT_KOMPAS_SPEURTOCHT;
    }

    return snapshot.data() as KompasSpeurtocht;
  }

  static async saveKompasSpeurtocht(
    hunt: KompasSpeurtocht
  ) {
    await setDoc(KOMPAS_DOC, hunt);
  }

  // ---------- Onderdelen zichtbaarheid ----------

  static async getOnderdelenSettings(): Promise<OnderdelenSettings> {
    const snapshot = await getDoc(ONDERDELEN_DOC);

    if (!snapshot.exists()) {
      return { kompas: true, foto: false };
    }

    const data = snapshot.data();

    return {
      kompas: data.kompas ?? true,
      foto: data.foto ?? false,
    };
  }

  static async setOnderdeelActive(
    onderdeel: keyof OnderdelenSettings,
    active: boolean
  ) {
    const current = await this.getOnderdelenSettings();
    await setDoc(ONDERDELEN_DOC, { ...current, [onderdeel]: active });
  }

  // ---------- Foto-uitdagingen (beheerder) ----------

  static async getUitdagingen(): Promise<FotoUitdaging[]> {
    const snapshot = await getDocs(
      query(UITDAGINGEN_COL, orderBy("createdAt", "asc"))
    );

    return snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as FotoUitdaging)
    );
  }

  static async addUitdaging(
    data: Omit<FotoUitdaging, "id" | "createdAt">
  ) {
    await addDoc(UITDAGINGEN_COL, {
      ...data,
      createdAt: Date.now(),
    });
  }

  static async deleteUitdaging(id: string) {
    await deleteDoc(doc(UITDAGINGEN_COL, id));
  }

  // ---------- Inzendingen (spelers + beheerder) ----------

  static async submitInzending(
    data: Omit<FotoInzending, "id" | "status" | "submittedAt">
  ) {
    await addDoc(INZENDINGEN_COL, {
      ...data,
      status: "pending",
      submittedAt: Date.now(),
    });
  }

  static async getInzendingen(): Promise<FotoInzending[]> {
    const snapshot = await getDocs(
      query(INZENDINGEN_COL, orderBy("submittedAt", "desc"))
    );

    return snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as FotoInzending)
    );
  }

  static async reviewInzending(
    id: string,
    status: "approved" | "rejected"
  ) {
    await updateDoc(doc(INZENDINGEN_COL, id), { status });
  }

  static async getPlayerScore(playerName: string): Promise<number> {
    const uitdagingen = await this.getUitdagingen();
    const inzendingen = await this.getInzendingen();

    const pointsByChallenge = new Map(
      uitdagingen.map((u) => [u.id, u.points])
    );

    return inzendingen
      .filter(
        (i) =>
          i.playerName === playerName &&
          i.status === "approved"
      )
      .reduce(
        (sum, i) => sum + (pointsByChallenge.get(i.challengeId) ?? 1),
        0
      );
  }
}
