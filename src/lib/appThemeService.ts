import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { AppTheme, DEFAULT_APP_THEME } from "@/types/appTheme";

const THEME_DOC = doc(db, "app_config", "theme");

export class AppThemeService {
  static async getTheme(): Promise<AppTheme> {
    const snapshot = await getDoc(THEME_DOC);

    if (!snapshot.exists()) {
      return DEFAULT_APP_THEME;
    }

    const data = snapshot.data();

    return {
      backgroundColor: data.backgroundColor ?? DEFAULT_APP_THEME.backgroundColor,
      backgroundImage: data.backgroundImage ?? null,
    };
  }

  static async setTheme(theme: AppTheme) {
    await setDoc(THEME_DOC, theme);
  }
}
