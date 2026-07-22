import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/user";

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
}
