"use client";

import LijstSpelerFormulier from "@/components/speurtocht/LijstSpelerFormulier";

export default function GeheimschriftPage() {
  return (
    <LijstSpelerFormulier
      soort="geheimschrift"
      titel="Geheimschrift"
      icoon="📜"
      uitleg="Typ de geheime boodschap die jullie hebben ontdekt."
    />
  );
}
