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
        }
      );

    if (
      navigator.geolocation
    ) {
      navigator.geolocation.watchPosition(
        async (
          position
        ) => {
          const lat =
            position.coords.latitude;

          const lng =
            position.coords.longitude;

          setPlayerPosition([
            lat,
            lng,
          ]);

          setGpsReady(true);

          try {
            const snap =
              await import(
                "firebase/firestore"
              );

            const docSnap =
              await snap.getDoc(
                gameRef
              );

            if (
              !docSnap.exists()
            )
              return;

            const data =
              docSnap.data();

            const updatedPlayers =
              (
                data.players ||
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
          alert(
            "GPS fout\n\nCode: " +
              error.code +
              "\n\nBericht:\n" +
              error.message
          );

          console.error(
            error
          );

          setGpsReady(false);
        },
        {
          enableHighAccuracy:
            true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert(
        "Geolocatie wordt niet ondersteund door deze browser."
      );
    }

    return () =>
      unsubscribe();
  }, []);

  return (
    <div>
      {!gpsReady && (
        <div className="bg-yellow-600 text-white p-3 rounded-xl mb-4">
          GPS nog niet beschikbaar.
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
              pathOptions={{
                color:
                  "blue",
                fillColor:
                  "blue",
                fillOpacity:
                  0.25,
                weight: 4,
              }}
            />
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
                    {
                      player.name
                    }
                    <br />
                    Team:{" "}
                    {
                      player.team
                    }
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