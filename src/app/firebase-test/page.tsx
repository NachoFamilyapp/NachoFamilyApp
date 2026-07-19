"use client";

import { db } from "@/lib/firebase";

export default function FirebaseTest() {
  return (
    <main className="min-h-screen bg-black/30 backdrop-blur-sm text-white p-8">
      <h1 className="text-4xl">
        Firebase Verbonden
      </h1>

      <p className="mt-4">
        Firestore geladen:
        {db ? " JA" : " NEE"}
      </p>
    </main>
  );
}