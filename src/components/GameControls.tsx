"use client";

import { useState } from "react";

import GameService from "@/lib/gameService";
import { GameEngine } from "@/lib/gameEngine";
import { useGame } from "@/components/GameProvider";

export default function GameControls() {

  const { game } = useGame();

  const [loading, setLoading] = useState(false);

  async function handleStart() {

    const gameCode =
      GameService.getStoredGameCode();

    if (!gameCode) return;

    setLoading(true);

    try {

      await GameService.startGame(
        gameCode
      );

    } finally {

      setLoading(false);

    }

  }

  async function handlePause() {

    const gameCode =
      GameService.getStoredGameCode();

    if (!gameCode) return;

    setLoading(true);

    try {

      await GameService.pauseGame(
        gameCode
      );

    } finally {

      setLoading(false);

    }

  }

  async function handleFinish() {

    const gameCode =
      GameService.getStoredGameCode();

    if (!gameCode) return;

    setLoading(true);

    try {

      if (game) {
        const redScore = GameEngine.getTeamScore(game, "red");
        const blueScore = GameEngine.getTeamScore(game, "blue");

        const winner =
          redScore === blueScore
            ? null
            : redScore > blueScore
              ? "red"
              : "blue";

        await GameService.setWinner(gameCode, winner);
      }

      await GameService.finishGame(
        gameCode
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="mb-6 space-y-3 rounded-2xl bg-zinc-900 p-5">

      <h2 className="text-2xl font-bold">
        🎮 Game Controls
      </h2>

      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full rounded-xl bg-green-600 p-3 font-bold disabled:opacity-50"
      >
        ▶️ Start Game
      </button>

      <button
        onClick={handlePause}
        disabled={loading}
        className="w-full rounded-xl bg-yellow-600 p-3 font-bold disabled:opacity-50"
      >
        ⏸️ Pauzeer Game
      </button>

      <button
        onClick={handleFinish}
        disabled={loading}
        className="w-full rounded-xl bg-red-600 p-3 font-bold disabled:opacity-50"
      >
        🏁 Beëindig Game
      </button>

    </div>

  );

}