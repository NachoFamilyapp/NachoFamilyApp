export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-900 text-white">
      <h1 className="text-5xl font-bold mb-6">
        NachoFamilyApp
      </h1>

      <p className="mb-8">
        Family GPS Games
      </p>

      <button className="bg-blue-600 px-6 py-3 rounded-xl mb-4">
        Nieuw Spel
      </button>

      <button className="bg-red-600 px-6 py-3 rounded-xl">
        Spel Joinen
      </button>
    </main>
  );
}