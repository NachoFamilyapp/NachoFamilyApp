"use client";

import { useEffect, useState } from "react";
import { Account, PermissieNiveau } from "@/types/account";

interface HuidigeGebruikerState {
  gebruiker: Account | null;
  rechten: Record<string, PermissieNiveau>;
  laden: boolean;
  verversen: () => Promise<void>;
}

export function useHuidigeGebruiker(): HuidigeGebruikerState {
  const [gebruiker, setGebruiker] = useState<Account | null>(null);
  const [rechten, setRechten] = useState<Record<string, PermissieNiveau>>({});
  const [laden, setLaden] = useState(true);

  async function verversen() {
    setLaden(true);
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      setGebruiker(data.gebruiker ?? null);
      setRechten(data.rechten ?? {});
    } finally {
      setLaden(false);
    }
  }

  useEffect(() => {
    verversen();
  }, []);

  return { gebruiker, rechten, laden, verversen };
}
