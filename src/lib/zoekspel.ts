import { getDb } from "@/lib/firebaseAdmin";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { ZoekObject, Zoekspel, ZoekspelVoortgang } from "@/types/zoekspel";

const SPELLEN = "promises_zoekspellen";
const VOORTGANG = "promises_zoekspel_voortgang";

// Tolerantie: hoe dichtbij een tik moet zijn (in procentpunten van de
// afbeelding) om als "gevonden" te tellen.
const TOLERANTIE = 4;

function voortgangId(spelId: string, userId: string) {
  return `${spelId}__${userId}`;
}

export async function haalAlleSpellenOp(): Promise<Zoekspel[]> {
  const snapshot = await getDb().collection(SPELLEN).orderBy("aangemaaktOp", "asc").get();

  return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
    const data = doc.data();
    const objecten: ZoekObject[] = data.objecten ?? [];

    return {
      id: doc.id,
      titel: data.titel,
      afbeelding: data.afbeelding,
      objecten: objecten.map((o) => ({ naam: o.naam, emoji: o.emoji })),
      aantalObjecten: objecten.length,
      aangemaaktOp: data.aangemaaktOp,
    };
  });
}

export async function haalSpelOp(id: string): Promise<Zoekspel | null> {
  const snapshot = await getDb().collection(SPELLEN).doc(id).get();
  if (!snapshot.exists) return null;

  const data = snapshot.data()!;
  const objecten: ZoekObject[] = data.objecten ?? [];

  return {
    id: snapshot.id,
    titel: data.titel,
    afbeelding: data.afbeelding,
    objecten: objecten.map((o) => ({ naam: o.naam, emoji: o.emoji })),
    aantalObjecten: objecten.length,
    aangemaaktOp: data.aangemaaktOp,
  };
}

// Intern: MET x/y-coördinaten. Wordt nooit rechtstreeks naar de speler
// gestuurd, alleen server-side gebruikt om tikken te controleren.
async function haalSpelMetCoordinatenOp(
  id: string
): Promise<{ objecten: ZoekObject[] } | null> {
  const snapshot = await getDb().collection(SPELLEN).doc(id).get();
  if (!snapshot.exists) return null;
  return { objecten: snapshot.data()!.objecten ?? [] };
}

export async function maakSpelAan(
  titel: string,
  afbeelding: string,
  objectNamen: { naam: string; emoji: string }[]
): Promise<Zoekspel> {
  const ref = getDb().collection(SPELLEN).doc();

  const objecten: ZoekObject[] = objectNamen.map((o) => ({
    naam: o.naam,
    emoji: o.emoji,
    x: 50,
    y: 50,
    ingesteld: false,
  }));

  const spel = {
    titel,
    afbeelding,
    objecten,
    aangemaaktOp: Date.now(),
  };

  await ref.set(spel);

  return {
    id: ref.id,
    titel,
    afbeelding,
    objecten: objectNamen,
    aantalObjecten: objecten.length,
    aangemaaktOp: spel.aangemaaktOp,
  };
}

export async function haalLocatiesOp(id: string): Promise<ZoekObject[] | null> {
  const resultaat = await haalSpelMetCoordinatenOp(id);
  return resultaat?.objecten ?? null;
}

export async function zetLocaties(id: string, objecten: ZoekObject[]) {
  await getDb().collection(SPELLEN).doc(id).update({ objecten });
}

export async function verwijderSpel(id: string) {
  await getDb().collection(SPELLEN).doc(id).delete();
}

// --- Voortgang per speler ---

export async function haalVoortgangOp(
  spelId: string,
  userId: string
): Promise<ZoekspelVoortgang | null> {
  const snapshot = await getDb().collection(VOORTGANG).doc(voortgangId(spelId, userId)).get();
  if (!snapshot.exists) return null;
  return snapshot.data() as ZoekspelVoortgang;
}

export async function startSpel(
  spelId: string,
  userId: string,
  userName: string
): Promise<ZoekspelVoortgang> {
  const voortgang: ZoekspelVoortgang = {
    spelId,
    userId,
    userName,
    gevondenIndices: [],
    gestartOp: Date.now(),
    voltooidOp: null,
    tijdInSeconden: null,
  };

  await getDb().collection(VOORTGANG).doc(voortgangId(spelId, userId)).set(voortgang);

  return voortgang;
}

interface TikResultaat {
  voortgang: ZoekspelVoortgang;
  gevonden: boolean;
  object: { naam: string; emoji: string } | null;
  alleGevonden: boolean;
}

export async function verwerkTik(
  spelId: string,
  userId: string,
  x: number,
  y: number
): Promise<TikResultaat | null> {
  const [spel, voortgang] = await Promise.all([
    haalSpelMetCoordinatenOp(spelId),
    haalVoortgangOp(spelId, userId),
  ]);

  if (!spel || !voortgang) return null;
  if (voortgang.voltooidOp) {
    return { voortgang, gevonden: false, object: null, alleGevonden: true };
  }

  let gevondenIndex = -1;

  spel.objecten.forEach((object, index) => {
    if (gevondenIndex !== -1) return;
    if (voortgang.gevondenIndices.includes(index)) return;
    if (!object.ingesteld) return;

    const afstand = Math.hypot(object.x - x, object.y - y);

    if (afstand <= TOLERANTIE) {
      gevondenIndex = index;
    }
  });

  if (gevondenIndex === -1) {
    return { voortgang, gevonden: false, object: null, alleGevonden: false };
  }

  const nieuweIndices = [...voortgang.gevondenIndices, gevondenIndex];
  const alleGevonden = nieuweIndices.length >= spel.objecten.length;

  const nieuweVoortgang: ZoekspelVoortgang = {
    ...voortgang,
    gevondenIndices: nieuweIndices,
    voltooidOp: alleGevonden ? Date.now() : null,
    tijdInSeconden: alleGevonden
      ? Math.round((Date.now() - voortgang.gestartOp) / 1000)
      : null,
  };

  await getDb()
    .collection(VOORTGANG)
    .doc(voortgangId(spelId, userId))
    .set(nieuweVoortgang);

  return {
    voortgang: nieuweVoortgang,
    gevonden: true,
    object: { naam: spel.objecten[gevondenIndex].naam, emoji: spel.objecten[gevondenIndex].emoji },
    alleGevonden,
  };
}

export async function haalScoresOp(spelId: string): Promise<ZoekspelVoortgang[]> {
  const snapshot = await getDb()
    .collection(VOORTGANG)
    .where("spelId", "==", spelId)
    .where("voltooidOp", "!=", null)
    .get();

  const scores = snapshot.docs.map(
    (doc: QueryDocumentSnapshot) => doc.data() as ZoekspelVoortgang
  );

  return scores.sort(
    (a: ZoekspelVoortgang, b: ZoekspelVoortgang) =>
      (a.tijdInSeconden ?? 0) - (b.tijdInSeconden ?? 0)
  ).slice(0, 10);
}
