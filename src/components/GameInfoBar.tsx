"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function GameInfoBar() {
  const [gameCode, setGameCode] =
    useState("");

  const [playerName, setPlayerName] =
    useState("");

  const [team, setTeam] =
    useState("");

  const [timeLeft, setTimeLeft] =
    useState("");

  const [status, setStatus] =
    useState("lobby");

  useEffect(() => {
    const storedGameCode =
      localStorage.getItem(
        "gameCode"
      ) || "";

    const storedPlayerName =
      localStorage.getItem(
        "playerName"
      ) || "";

    const storedTeam =
      localStorage.getItem(
        "team"
      ) || "";

    setGameCode(
      storedGameCode
    );

    setPlayerName(
      storedPlayerName
    );

    setTeam(
      storedTeam
    );

    if (!storedGameCode)
      return;

    const gameRef = doc(
      db,
      "games",
      storedGameCode
    );

    const unsubscribe =
      onSnapshot(
        gameRef,
        (snapshot) => {
          if (
            !snapshot.exists()
          )
            return;

          const data =
            snapshot.data();

          setStatus(
            data.status ||
              "lobby"
          );

          if (
            !data.startTime ||
            data.gameDuration ===
              null
          ) {
            setTimeLeft(
              "♾️"
            );
            return;
          }

          const updateTimer =
            () => {
              const endTime =
                data.startTime +
                data.gameDuration *
                  1000;

              const remaining =
                Math.max(
                  0,
                  endTime -
                    Date.now()
                );

              const minutes =
                Math.floor(
                  remaining /
                    60000
                );

              const seconds =
                Math.floor(
                  (
                    remaining %
                    60000
                  ) / 1000
                );

              setTimeLeft(
                `${minutes}:${seconds
                  .toString()
                  .padStart(
                    2,
                    "0"
                  )}`
              );
            };

          updateTimer();

          const interval =
            setInterval(
              updateTimer,
              1000
            );

          return () =>
            clearInterval(
              interval
            );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  return (
    <div className="bg-green-800 rounded-2xl p-4 shadow-lg">
      <div className="grid md:grid-cols-4 gap-3 text-center">
        <div className="bg-green-700 rounded-xl p-3">
          <div className="text-sm">
            Game
          </div>

          <div className="font-bold text-xl">
            {gameCode ||
              "-"}
          </div>
        </div>

        <div className="bg-green-700 rounded-xl p-3">
          <div className="text-sm">
            Speler
          </div>

          <div className="font-bold">
            {playerName ||
              "-"}
          </div>
        </div>

        <div className="bg-green-700 rounded-xl p-3">
          <div className="text-sm">
            Team
          </div>

          <div className="font-bold">
            {team === "red" &&
              "🔴 Rood"}

            {team ===
              "blue" &&
              "🔵 Blauw"}

            {team ===
              "green" &&
              "🟢 Groen"}

            {team ===
              "yellow" &&
              "🟡 Geel"}

            {!team &&
              "⚪ Geen"}
          </div>
        </div>

        <div className="bg-green-700 rounded-xl p-3">
          <div className="text-sm">
            Timer
          </div>

          <div className="font-bold text-xl">
            {timeLeft}
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        {status ===
          "lobby" && (
          <span>
            ⏳ Lobby
          </span>
        )}

        {status ===
          "playing" && (
          <span>
            ▶️ Actief Spel
          </span>
        )}

        {status ===
          "finished" && (
          <span>
            🏁 Spel Beëindigd
          </span>
        )}
      </div>
    </div>
  );
}