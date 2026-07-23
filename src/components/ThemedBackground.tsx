"use client";

import { ReactNode, useEffect, useState } from "react";

import { AppThemeService } from "@/lib/appThemeService";
import { AppTheme, DEFAULT_APP_THEME } from "@/types/appTheme";

type Props = {
  children: ReactNode;
};

export default function ThemedBackground({ children }: Props) {
  const [theme, setTheme] = useState<AppTheme>(DEFAULT_APP_THEME);

  useEffect(() => {
    AppThemeService.getTheme().then(setTheme);
  }, []);

  return (
    <div
      className="min-h-screen transition-colors duration-700"
      style={{
        backgroundColor: theme.backgroundColor,
        backgroundImage: theme.backgroundImage
          ? `url(${theme.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {children}
    </div>
  );
}
