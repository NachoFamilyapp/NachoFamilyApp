import { KompasSpeurtocht } from "@/types/speurtocht";

// Middelpunt van attractiepark Slagharen — alleen als startpunt voor de
// kaart in het beheerscherm. De beheerder zet de echte punten van de
// attracties zelf op de kaart, dat is nauwkeuriger dan een vaste locatie.
export const SLAGHAREN_CENTER = {
  lat: 52.6244,
  lng: 6.5619,
};

export const DEFAULT_KOMPAS_SPEURTOCHT: KompasSpeurtocht = {
  title: "Speurtocht Slagharen",
  intro:
    "Start binnenkant van de ingang van Slagharen. Volg het kompas naar elke attractie en beantwoord de vraag bij aankomst!",
  startLat: SLAGHAREN_CENTER.lat,
  startLng: SLAGHAREN_CENTER.lng,
  active: true,
  checkpoints: [
    {
      id: "cp1",
      emoji: "🤠",
      question:
        "Welke attractie brengt je hoog de lucht in terwijl je in zwevende stoeltjes rondjes draait?",
      options: ["Jumbo", "Apollo", "Monorail"],
      correctIndex: 1,
      letter: "P",
      targetName: "Apollo",
      lat: null,
      lng: null,
      radius: 25,
    },
    {
      id: "cp2",
      emoji: "🐂",
      question:
        "Bij welke attractie probeer je een wilde stier zo lang mogelijk te berijden?",
      options: ["El Torito", "Mine Train", "Jumbo"],
      correctIndex: 0,
      letter: "O",
      targetName: "El Torito",
      lat: null,
      lng: null,
      radius: 25,
    },
    {
      id: "cp3",
      emoji: "🐘",
      question: "Welke attractie laat je vliegen op vriendelijke olifanten?",
      options: ["Monorail", "Jumbo", "Apollo"],
      correctIndex: 1,
      letter: "O",
      targetName: "Jumbo",
      lat: null,
      lng: null,
      radius: 25,
    },
    {
      id: "cp4",
      emoji: "🚂",
      question:
        "Welke attractie neemt je mee door een oude goudmijn in een rijdend treintje?",
      options: ["Mine Train", "Apollo", "El Torito"],
      correctIndex: 0,
      letter: "R",
      targetName: "Mine Train",
      lat: null,
      lng: null,
      radius: 25,
    },
    {
      id: "cp5",
      emoji: "🗼",
      question:
        "Welke attractie rijdt rustig boven het park en geeft je uitzicht over Slagharen?",
      options: ["Jumbo", "Sky Tower", "Mine Train"],
      correctIndex: 1,
      letter: "S",
      targetName: "Sky Tower",
      lat: null,
      lng: null,
      radius: 25,
    },
  ],
  finalWord: "SPOOR",
  finalMessage:
    "Goed gedaan, speurders! Volg het SPOOR naar de Arena van onze vrienden.",
};
