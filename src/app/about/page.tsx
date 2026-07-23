"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black/30 backdrop-blur-sm text-white p-6">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">📖</div>
          <h1 className="text-4xl font-bold">Handleiding</h1>
        </div>

        <Card className="text-white space-y-5">
          <div>
            <h2 className="text-2xl font-bold mb-2">🗺️ Slagharen app</h2>
            <p className="opacity-90">
              Vul de lengte van je kind in en zie meteen bij welke attracties
              van Slagharen ze wel of niet naar binnen mogen.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">🚩 Vlag Veroveren</h2>
            <p className="opacity-90">
              Twee teams (rood en blauw) proberen elkaars vlag te veroveren en
              veilig naar hun eigen basis te brengen. Een team wint zodra het
              genoeg vlaggen heeft binnengebracht, of als de tijd om is (dan
              wint het team met de meeste punten).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">📱 Zo speel je Vlag Veroveren</h2>
            <ol className="list-decimal list-inside space-y-1 opacity-90">
              <li>Eén speler maakt een spel aan en wordt host.</li>
              <li>Andere spelers joinen met de 4-cijferige code.</li>
              <li>Kies een team in de lobby.</li>
              <li>De host stelt bij Instellingen het speelgebied en de vlaggen in.</li>
              <li>Sta dicht bij de vlag van de tegenstander om hem op te pakken.</li>
              <li>Breng de vlag terug naar je eigen basis om te scoren.</li>
              <li>Tik de drager van jouw vlag om hem terug te sturen.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">🔒 Veilig voor kinderen</h2>
            <p className="opacity-90">
              Er is geen chatfunctie en locaties worden alleen binnen het
              spel gebruikt om afstand te bepalen — niet gedeeld buiten de
              groep.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">🧭 Speurtocht</h2>
            <p className="opacity-90">
              Vijf sub-onderdelen die de beheerder één voor één kan
              activeren: Speurtocht (kompas-tocht), Waar ben ik?
              (fotospel), Herinner de objecten, Punt of streep spel, en
              Geheimschrift.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">💡 Morse Spel</h2>
            <p className="opacity-90">
              De beheerder stuurt een woord naar alle telefoons; het licht
              knippert de morsecode ervan. Typ het antwoord in met het
              toetsenbord op het scherm.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">🚨 Noodbericht</h2>
            <p className="opacity-90">
              De beheerder kan een moorse noodbericht sturen naar alle
              spelers, of alleen naar gekozen spelers.
            </p>
          </div>
        </Card>

        <Link
          href="/"
          className="block text-center mt-6 underline opacity-90"
        >
          🏠 Terug naar Home
        </Link>
      </div>
    </main>
  );
}
