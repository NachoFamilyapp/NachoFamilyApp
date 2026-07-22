import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { AppModules, DEFAULT_APP_MODULES } from "@/types/appModules";

const MODULES_DOC = doc(db, "app_config", "modules");

export class AppModulesService {
  static async getModules(): Promise<AppModules> {
    const snapshot = await getDoc(MODULES_DOC);

    if (!snapshot.exists()) {
      return DEFAULT_APP_MODULES;
    }

    const data = snapshot.data();

    return {
      map: data.map ?? true,
      vlag: data.vlag ?? true,
      speurtocht: data.speurtocht ?? true,
    };
  }

  static async setModuleActive(key: keyof AppModules, active: boolean) {
    const current = await this.getModules();
    await setDoc(MODULES_DOC, { ...current, [key]: active });
  }
}
