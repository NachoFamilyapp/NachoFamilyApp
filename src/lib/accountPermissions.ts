import { getDb } from "@/lib/firebaseAdmin";
import { PermissieNiveau } from "@/types/account";

export async function haalRechtenOp(
  uid: string
): Promise<Record<string, PermissieNiveau>> {
  const snapshot = await getDb().collection("promises_permissions").doc(uid).get();

  if (!snapshot.exists) return {};

  return (snapshot.data()?.modules ?? {}) as Record<string, PermissieNiveau>;
}

export async function zetRecht(
  uid: string,
  moduleId: string,
  niveau: PermissieNiveau
) {
  const ref = getDb().collection("promises_permissions").doc(uid);
  await ref.set({ modules: { [moduleId]: niveau } }, { merge: true });
}

export async function haalBeheerWachtwoordHashOp(): Promise<string | null> {
  const snapshot = await getDb().collection("promises_admin_config").doc("beheer").get();
  if (!snapshot.exists) return null;
  return (snapshot.data()?.passwordHash as string) ?? null;
}

export async function zetBeheerWachtwoordHash(hash: string) {
  await getDb().collection("promises_admin_config").doc("beheer").set({ passwordHash: hash });
}
