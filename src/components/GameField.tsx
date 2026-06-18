"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Popup,
} from "react-leaflet";

import {
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  useEffect,
  useState,
} from "react";

interface FirebasePoint {
  lat: number;
  lng: number;
}

interface Flag {
  lat: number;
  lng: number;
}

interface Player {
  name: string;
  team?: string;
  host?: boolean;
  lat?: number;
  lng?: number;
}

export default function GameField() {
  const [playerPosition, setPlayerPosition] =
    useState<[number, number]>([
      52.045,
      4.5,
    ]);

  const [gpsReady, setGpsReady] =
    useState(false);

  const [playArea, setPlayArea] =
    useState<[number, number][]>([]);

  const [players, setPlayers] =
    useState<Player[]>([]);

  const [redFlag, setRedFlag] =
    useState<Flag | null>(null);

  const [blueFlag, setBlueFlag] =
    useState<Flag | null>(null);

  const [gpsTestMode, setGpsTestMode] =
    useState(false);

  useEffect(() => {
    const gameCode =
      localStorage.getItem(
        "gameCode"
      );

    const playerName =
      localStorage.getItem(
        "playerName"
      );

    if (!gameCode) return;

    const gameRef = doc(
      db,
      "games",
      gameCode
    );

    const unsubscribe =
      onSnapshot(
        gameRef,
        (snapshot) => {
          if (!snapshot.exists())
            return;

          const data =
            snapshot.data();

          const area =
            (
              data.playArea ||
              []
            ).map(
              (
                point: FirebasePoint
              ) =>
                [
                  point.lat,
                  point.lng,
                ] as [
                  number,
                  number
                ]
            );

          setPlayArea(area);

          setPlayers(
            data.players || []
          );

          setRedFlag(
            data.redFlag || null
          );

          setBlueFlag(
            data.blueFlag || null
          );

          setGpsTestMode(
            data.gpsTestMode ||
              false
          );

          if (
            data.gpsTestMode &&
            data.testPosition
          ) {
            setPlayerPosition([
              data.testPosition.lat,
              data.testPosition.lng,
            ]);

            setGpsReady(true);
          }
        }
      );

    if (
      navigator.geolocation
    ) {
      navigator.geolocation.watchPosition(
        async (
          position
        ) => {
          try {
            const snap =
              await getDoc(
                gameRef
              );

            if (
              !snap.exists()
            )
              return;

            const gameData =
              snap.data();

            if (
              gameData.gpsTestMode
            ) {
              return;
            }

            const lat =
              position.coords
                .latitude;

            const lng =
              position.coords
                .longitude;

            setPlayerPosition([
              lat,
              lng,
            ]);

            setGpsReady(true);

            const updatedPlayers =
              (
                gameData.players ||
                []
              ).map(
                (
                  player: Player
                ) => {
                  if (
                    player.name ===
                    playerName
                  ) {
                    return {
                      ...player,
                      lat,
                      lng,
                    };
                  }

                  return player;
                }
              );

            await updateDoc(
              gameRef,
              {
                players:
                  updatedPlayers,
              }
            );
          } catch (
            error
          ) {
            console.error(
              error
            );
          }
        },
        (error) => {
          console.error(
            error
          );
        },
        {
          enableHighAccuracy:
            true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }

    return () =>
      unsubscribe();
  }, []);

  const teleportToFlag =
    async (
      flag:
        | Flag
        | null
    ) => {
      try {
        if (!flag) {
          alert(
            "Vlag niet gevonden"
          );
          return;
        }

        setPlayerPosition([
          flag.lat,
          flag.lng,
        ]);

        setGpsReady(true);

        alert(
          "Teleport voltooid"
        );
      } catch (
        error
      ) {
        console.error(
          error
        );
      }
    };

  return (
    <div>
      {!gpsReady && (
        <div className="bg-yellow-600 text-white p-3 rounded-xl mb-4">
          GPS nog niet beschikbaar.
        </div>
      )}

      {gpsTestMode && (
        <div className="flex flex-col gap-3 mb-4">
          <button
            onClick={() =>
              teleportToFlag(
                redFlag
              )
            }
            className="bg-red-600 p-3 rounded-xl"
          >
            🚩 Naar Rode Vlag
          </button>

          <button
            onClick={() =>
              teleportToFlag(
                blueFlag
              )
            }
            className="bg-blue-600 p-3 rounded-xl"
          >
            🚩 Naar Blauwe Vlag
          </button>
        </div>
      )}

      <div
        style={{
          height: "700px",
          width: "100%",
        }}
      >
        <MapContainer
          center={
            playerPosition
          }
          zoom={18}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {playArea.length >=
            3 && (
            <Polygon
              positions={
                playArea
              }
            />
          )}

          {redFlag && (
            <Marker
              position={[
                redFlag.lat,
                redFlag.lng,
              ]}
            >
              <Popup>
                🚩 Rode Vlag
              </Popup>
            </Marker>
          )}

          {blueFlag && (
            <Marker
              position={[
                blueFlag.lat,
                blueFlag.lng,
              ]}
            >
              <Popup>
                🚩 Blauwe Vlag
              </Popup>
            </Marker>
          )}

          <Marker
            position={
              playerPosition
            }
          >
            <Popup>
              📍 Jij
            </Popup>
          </Marker>

          {players.map(
            (
              player,
              index
            ) => {
              if (
                !player.lat ||
                !player.lng
              )
                return null;

              return (
                <Marker
                  key={index}
                  position={[
                    player.lat,
                    player.lng,
                  ]}
                >
                  <Popup>
                    {player.name}
                    <br />
                    Team: {player.team}
                  </Popup>
                </Marker>
              );
            }
          )}
        </MapContainer>
      </div>
    </div>
  );
}