export type BackgroundTheme = {
  id: string;
  name: string;
  icon: string;
  gradient: string;
};

export const Backgrounds: BackgroundTheme[] = [
  {
    id: "grasveld",
    name: "Grasveld",
    icon: "🌳",
    gradient: "from-green-500 via-green-400 to-blue-400",
  },
  {
    id: "strand",
    name: "Strand",
    icon: "🏖️",
    gradient: "from-yellow-300 via-orange-300 to-blue-400",
  },
  {
    id: "nacht",
    name: "Nacht",
    icon: "🌙",
    gradient: "from-indigo-900 via-purple-900 to-slate-900",
  },
  {
    id: "zonsondergang",
    name: "Zonsondergang",
    icon: "🌅",
    gradient: "from-orange-500 via-pink-500 to-purple-600",
  },
  {
    id: "sneeuw",
    name: "Sneeuw",
    icon: "❄️",
    gradient: "from-sky-200 via-blue-200 to-slate-300",
  },
  {
    id: "ruimte",
    name: "Ruimte",
    icon: "🪐",
    gradient: "from-slate-900 via-purple-950 to-black",
  },
];

export function getBackground(id: string | undefined): BackgroundTheme {
  return (
    Backgrounds.find((bg) => bg.id === id) ?? Backgrounds[0]
  );
}
