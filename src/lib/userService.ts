import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/user";

const USERS_COL = collection(db, "users");

export class UserService {
  static async getProfile(uid: string): Promise<UserProfile | null> {
    const snapshot = await getDoc(doc(db, "users", uid));

    if (!snapshot.exists()) return null;

    return snapshot.data() as UserProfile;
  }

  static async createProfile(uid: string, name: string): Promise<UserProfile> {
    const profile: UserProfile = {
      uid,
      name,
      createdAt: Date.now(),
    };

    await setDoc(doc(db, "users", uid), profile);

    return profile;
  }

  static async getAllUsers(): Promise<UserProfile[]> {
    const snapshot = await getDocs(query(USERS_COL, orderBy("createdAt", "asc")));

    return snapshot.docs.map((d) => d.data() as UserProfile);
  }

  static async renameUser(uid: string, name: string) {
    await setDoc(doc(db, "users", uid), { name }, { merge: true });
  }

  static async deleteUser(uid: string) {
    await deleteDoc(doc(db, "users", uid));
  }
}
