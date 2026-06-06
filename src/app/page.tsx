import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-900 text-white">
      <h1 className="text-5xl font-bold mb-6">
        NachoFamilyApp
      </h1>

      <p className="mb-10 text-xl">
        Family GPS Games
      </p>

      <div className="flex flex-col gap-4">
        <Link
          href="/create-game"
          className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-center font-bold"
        >
          Nieuw Spel
        </Link>

        <Link
          href="/join-game"
          className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl text-center font-bold"
        >
          Spel Joinen
        </Link>

        <Link
          href="/admin"
          className="bg-yellow-600 hover:bg-yellow-700 px-8 py-4 rounded-xl text-center font-bold"
        >
          Beheer
        </Link>
      </div>
    </main>
  );
}