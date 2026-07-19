"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Popup,
  useMap,
} from "react-leaflet";

import PlayerMarker from "@/components/PlayerMarker";

import {
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  useEffect,
  useRef,
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

interface FlagCarrier {
  playerName: string;
  playerTeam: string;
  flagTeam: string;
}

const CAPTURE_DISTANCE = 20;
const TAG_DISTANCE = 10;

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const earthRadius = 6371000;

  const toRadians = (degrees: number) =>
    (degrees * Math.PI) / 180;

  const latDifference =
    toRadians(lat2 - lat1);

  const lngDifference =
    toRadians(lng2 - lng1);

  const a =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(lngDifference / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}
function FollowPlayer({
  position,
}: {
  position: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [position, map]);

  return null;
}
export default function GameField() {
  const [
    playerPosition,
    setPlayerPosition,
  ] = useState<[number, number]>([
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

  const [
    gpsTestMode,
    setGpsTestMode,
  ] = useState(false);

  const [
    flagCarrier,
    setFlagCarrier,
  ] = useState<FlagCarrier | null>(
    null
  );

  const [winner, setWinner] =
    useState<string | null>(null);

  const [
    canTagCarrier,
    setCanTagCarrier,
  ] = useState(false);

  const [
    carrierDistance,
    setCarrierDistance,
  ] = useState<number | null>(null);

  const actionBusy =
    useRef(false);
const winSound =
  useRef<HTMLAudioElement | null>(null);

const flagSound =
  useRef<HTMLAudioElement | null>(null);

  const positionRef =
    useRef<[number, number]>([
      52.045,
      4.5,
    ]);

  const updateLocalPosition = (
    lat: number,
    lng: number
  ) => {
    const newPosition:
      [number, number] = [
        lat,
        lng,
      ];

    positionRef.current =
      newPosition;

    setPlayerPosition(
      newPosition
    );

    setGpsReady(true);
  };

  const checkCarrierDistance = (
    currentPlayers: Player[],
    currentCarrier:
      | FlagCarrier
      | null,
    myPosition: [number, number]
  ) => {
    const playerName =
      localStorage.getItem(
        "playerName"
      );

    if (
      !playerName ||
      !currentCarrier ||
      currentCarrier.playerName ===
        playerName
    ) {
      setCanTagCarrier(false);
      setCarrierDistance(null);
      return;
    }

    const me =
      currentPlayers.find(
        (player) =>
          player.name ===
          playerName
      );

    const carrier =
      currentPlayers.find(
        (player) =>
          player.name ===
          currentCarrier.playerName
      );

    if (
      !me?.team ||
      !carrier?.team ||
      me.team === carrier.team ||
      carrier.lat === undefined ||
      carrier.lng === undefined
    ) {
      setCanTagCarrier(false);
      setCarrierDistance(null);
      return;
    }

    const distance =
      calculateDistance(
        myPosition[0],
        myPosition[1],
        carrier.lat,
        carrier.lng
      );

    setCarrierDistance(
      distance
    );

    setCanTagCarrier(
      distance <= TAG_DISTANCE
    );
  };

  const savePlayerPosition =
    async (
      lat: number,
      lng: number
    ) => {
      const gameCode =
        localStorage.getItem(
          "gameCode"
        );

      const playerName =
        localStorage.getItem(
          "playerName"
        );

      if (
        !gameCode ||
        !playerName
      ) {
        return;
      }

      const gameRef = doc(
        db,
        "games",
        gameCode
      );

      const gameSnap =
        await getDoc(gameRef);

      if (!gameSnap.exists()) {
        return;
      }

      const data =
        gameSnap.data();

      const updatedPlayers:
        Player[] =
        (
          data.players || []
        ).map(
          (player: Player) => {
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
    };

  const checkGameAction =
    async (
      lat: number,
      lng: number
    ) => {
      if (
        actionBusy.current
      ) {
        return;
      }

      const gameCode =
        localStorage.getItem(
          "gameCode"
        );

      const playerName =
        localStorage.getItem(
          "playerName"
        );

      if (
        !gameCode ||
        !playerName
      ) {
        return;
      }

      try {
        const gameRef = doc(
          db,
          "games",
          gameCode
        );

        const gameSnap =
          await getDoc(
            gameRef
          );

        if (
          !gameSnap.exists()
        ) {
          return;
        }

        const data =
          gameSnap.data();

        if (
          data.status ===
          "finished"
        ) {
          return;
        }

        const currentPlayer:
          | Player
          | undefined =
          (
            data.players || []
          ).find(
            (
              player: Player
            ) =>
              player.name ===
              playerName
          );

        if (
          !currentPlayer?.team
        ) {
          return;
        }

        const currentCarrier:
          | FlagCarrier
          | null =
          data.flagCarrier ||
          null;

        if (
          currentCarrier &&
          currentCarrier.playerName ===
            playerName
        ) {
          const homeFlag:
            | Flag
            | null =
            currentPlayer.team ===
            "blue"
              ? data.blueFlag ||
                null
              : data.redFlag ||
                null;

          if (!homeFlag) {
            return;
          }

          const distanceToHome =
            calculateDistance(
              lat,
              lng,
              homeFlag.lat,
              homeFlag.lng
            );

          console.log(
            `Afstand tot eigen vlag: ${Math.round(
              distanceToHome
            )} meter`
          );

          if (
            distanceToHome <=
            CAPTURE_DISTANCE
          ) {
            actionBusy.current =
              true;

            await updateDoc(
              gameRef,
              {
                status:
                  "finished",
                winner:
                  currentPlayer.team,
                winnerPlayer:
                  currentPlayer.name,
                endTime:
                  Date.now(),
              }
            );

            alert(
              `🏆 TEAM ${
                currentPlayer.team ===
                "blue"
                  ? "BLAUW"
                  : "ROOD"
              } WINT!`
            );
          }

          return;
        }

        if (currentCarrier) {
          return;
        }

        let enemyFlag:
          | Flag
          | null = null;

        let enemyFlagTeam = "";

        if (
          currentPlayer.team ===
          "blue"
        ) {
          enemyFlag =
            data.redFlag ||
            null;

          enemyFlagTeam =
            "red";
        } else {
          enemyFlag =
            data.blueFlag ||
            null;

          enemyFlagTeam =
            "blue";
        }

        if (!enemyFlag) {
          return;
        }

        const distanceToEnemy =
          calculateDistance(
            lat,
            lng,
            enemyFlag.lat,
            enemyFlag.lng
          );

        console.log(
          `Afstand tot vijandelijke vlag: ${Math.round(
            distanceToEnemy
          )} meter`
        );

        if (
          distanceToEnemy <=
          CAPTURE_DISTANCE
        ) {
          actionBusy.current =
            true;

          await updateDoc(
            gameRef,
            {
              flagCarrier: {
                playerName:
                  currentPlayer.name,
                playerTeam:
                  currentPlayer.team,
                flagTeam:
                  enemyFlagTeam,
              },
            }
          );

          alert(
            `🚩 ${currentPlayer.name} heeft de ${
              enemyFlagTeam ===
              "red"
                ? "RODE"
                : "BLAUWE"
            } vlag gepakt!`
          );

          actionBusy.current =
            false;
        }
      } catch (error) {
        console.error(
          "Fout bij spelcontrole:",
          error
        );

        actionBusy.current =
          false;
      }
    };

  const moveTestPlayer =
    async (
      lat: number,
      lng: number
    ) => {
      try {
        updateLocalPosition(
          lat,
          lng
        );

        await savePlayerPosition(
          lat,
          lng
        );

        await checkGameAction(
          lat,
          lng
        );
      } catch (error) {
        console.error(
          "Testpositie verplaatsen mislukt:",
          error
        );

        alert(
          "Testpositie verplaatsen mislukt"
        );
      }
    };

  const teleportToFlag =
    async (
      flag: Flag | null
    ) => {
      if (!flag) {
        alert(
          "Vlag niet gevonden"
        );

        return;
      }

      await moveTestPlayer(
        flag.lat,
        flag.lng
      );
    };

  const moveNearCarrier =
    async () => {
      if (!flagCarrier) {
        alert(
          "Er is geen vlagdrager"
        );

        return;
      }

      const carrier =
        players.find(
          (player) =>
            player.name ===
            flagCarrier.playerName
        );

      if (
        !carrier ||
        carrier.lat ===
          undefined ||
        carrier.lng ===
          undefined
      ) {
        alert(
          "Positie van de vlagdrager is nog niet beschikbaar"
        );

        return;
      }

      await moveTestPlayer(
        carrier.lat,
        carrier.lng
      );
    };

  const tagFlagCarrier =
    async () => {
      if (
        actionBusy.current ||
        !canTagCarrier ||
        !flagCarrier
      ) {
        return;
      }

      const gameCode =
        localStorage.getItem(
          "gameCode"
        );

      const playerName =
        localStorage.getItem(
          "playerName"
        );

      if (
        !gameCode ||
        !playerName
      ) {
        return;
      }

      try {
        actionBusy.current =
          true;

        const gameRef = doc(
          db,
          "games",
          gameCode
        );

        const gameSnap =
          await getDoc(
            gameRef
          );

        if (
          !gameSnap.exists()
        ) {
          actionBusy.current =
            false;

          return;
        }

        const data =
          gameSnap.data();

        const currentCarrier:
          | FlagCarrier
          | null =
          data.flagCarrier ||
          null;

        if (
          !currentCarrier
        ) {
          actionBusy.current =
            false;

          return;
        }

        const currentPlayers:
          Player[] =
          data.players || [];

        const me =
          currentPlayers.find(
            (player) =>
              player.name ===
              playerName
          );

        const carrier =
          currentPlayers.find(
            (player) =>
              player.name ===
              currentCarrier.playerName
          );

        if (
          !me?.team ||
          !carrier?.team ||
          me.team ===
            carrier.team ||
          carrier.lat ===
            undefined ||
          carrier.lng ===
            undefined
        ) {
          actionBusy.current =
            false;

          return;
        }

        const distance =
          calculateDistance(
            positionRef.current[0],
            positionRef.current[1],
            carrier.lat,
            carrier.lng
          );

        if (
          distance >
          TAG_DISTANCE
        ) {
          alert(
            "De vlagdrager is te ver weg om te tikken."
          );

          actionBusy.current =
            false;

          return;
        }

        await updateDoc(
          gameRef,
          {
            flagCarrier: null,

            lastTag: {
              taggedPlayer:
                currentCarrier.playerName,

              taggedBy:
                playerName,

              time:
                Date.now(),
            },
          }
        );

        alert(
          `✋ ${currentCarrier.playerName} is getikt! De vlag is terug.`
        );

        setCanTagCarrier(
          false
        );

        setCarrierDistance(
          null
        );

        actionBusy.current =
          false;
      } catch (error) {
        console.error(
          "Fout bij tikken:",
          error
        );

        actionBusy.current =
          false;
      }
    };

  useEffect(() => {
    const gameCode =
      localStorage.getItem(
        "gameCode"
      );

    const playerName =
      localStorage.getItem(
        "playerName"
      );

    if (!gameCode) {
      return;
    }

    const gameRef = doc(
      db,
      "games",
      gameCode
    );

    const unsubscribe =
      onSnapshot(
        gameRef,
        (snapshot) => {
          if (
            !snapshot.exists()
          ) {
            return;
          }

          const data =
            snapshot.data();

          const area =
            (
              data.playArea || []
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

          const currentPlayers:
            Player[] =
            data.players || [];

          const currentCarrier:
            | FlagCarrier
            | null =
            data.flagCarrier ||
            null;

          setPlayArea(area);

          setPlayers(
            currentPlayers
          );

          setRedFlag(
            data.redFlag ||
              null
          );

          setBlueFlag(
            data.blueFlag ||
              null
          );

          setGpsTestMode(
            data.gpsTestMode ||
              false
          );

          setFlagCarrier(
            currentCarrier
          );

          setWinner(
            data.winner ||
              null
          );

          const me =
            currentPlayers.find(
              (player) =>
                player.name ===
                playerName
            );

          if (
            data.gpsTestMode &&
            me?.lat !==
              undefined &&
            me?.lng !==
              undefined
          ) {
            updateLocalPosition(
              me.lat,
              me.lng
            );
          }

          checkCarrierDistance(
            currentPlayers,
            currentCarrier,
            positionRef.current
          );
        }
      );

    let watchId:
      | number
      | undefined;

    if (
      navigator.geolocation
    ) {
      watchId =
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
              ) {
                return;
              }

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

              updateLocalPosition(
                lat,
                lng
              );

              await savePlayerPosition(
                lat,
                lng
              );

              await checkGameAction(
                lat,
                lng
              );
            } catch (error) {
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

            timeout:
              10000,

            maximumAge:
              0,
          }
        );
    }
useEffect(() => {
  winSound.current = new Audio("/sounds/win.mp3");
  flagSound.current = new Audio("/sounds/flag.mp3");
}, []);

useEffect(() => {
  if (winner) {
    winSound.current?.play();
  }
}, [winner]);

useEffect(() => {
  if (flagCarrier) {
    flagSound.current?.play();
  }
}, [flagCarrier]);

    return () => {
      unsubscribe();

      if (
        watchId !==
        undefined
      ) {
        navigator.geolocation.clearWatch(
          watchId
        );
      }
    };
  }, []);

  return (
    <div>
      {winner && (
        <div className="mb-4 rounded-2xl bg-yellow-400 p-8 text-center text-black">
          <div className="mb-3 text-6xl">
            🏆
          </div>

          <div className="text-4xl font-bold">
            TEAM{" "}
            {winner === "blue"
              ? "BLAUW"
              : "ROOD"}{" "}
            WINT!
          </div>
        </div>
      )}

      {!gpsReady && (
        <div className="mb-4 rounded-xl bg-yellow-600 p-3 text-white">
          GPS nog niet beschikbaar.
        </div>
      )}

      {flagCarrier &&
        !winner && (
          <div className="mb-4 rounded-xl bg-yellow-500 p-4 text-center text-xl font-bold text-black">
            🚩{" "}
            {
              flagCarrier.playerName
            }{" "}
            heeft de{" "}
            {flagCarrier.flagTeam ===
            "red"
              ? "RODE"
              : "BLAUWE"}{" "}
            vlag!
          </div>
        )}

      {flagCarrier &&
        carrierDistance !==
          null &&
        !winner && (
          <div className="mb-4 rounded-xl bg-green-800 p-3 text-center">
            Afstand tot
            vlagdrager:{" "}
            <strong>
              {Math.round(
                carrierDistance
              )}{" "}
              meter
            </strong>
          </div>
        )}

      {canTagCarrier &&
        !winner && (
          <button
            type="button"
            onClick={
              tagFlagCarrier
            }
            className="mb-4 w-full rounded-2xl bg-orange-600 p-5 text-xl font-bold"
          >
            ✋ Tik vlagdrager
          </button>
        )}

      {gpsTestMode &&
        !winner && (
          <div className="mb-4 rounded-2xl bg-purple-900 p-4">
            <div className="mb-3 text-center text-xl font-bold">
              🧪 GPS Test Mode
            </div>

            <div className="mb-3 text-center text-sm text-purple-100">
              Deze knoppen
              verplaatsen alleen jouw
              eigen speler.
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() =>
                  teleportToFlag(
                    redFlag
                  )
                }
                className="rounded-xl bg-red-600 p-3 font-bold"
              >
                🚩 Naar Rode
                Vlag
              </button>

              <button
                type="button"
                onClick={() =>
                  teleportToFlag(
                    blueFlag
                  )
                }
                className="rounded-xl bg-blue-600 p-3 font-bold"
              >
                🚩 Naar Blauwe
                Vlag
              </button>

              {flagCarrier && (
                <button
                  type="button"
                  onClick={
                    moveNearCarrier
                  }
                  className="rounded-xl bg-orange-600 p-3 font-bold"
                >
                  🏃 Naar
                  Vlagdrager
                </button>
              )}
            </div>
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
                player.lat ===
                  undefined ||
                player.lng ===
                  undefined
              ) {
                return null;
              }

              return (
                <Marker
                  key={`${player.name}-${index}`}
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

                    {flagCarrier?.playerName ===
                      player.name && (
                      <>
                        <br />
                        🚩
                        Vlagdrager
                      </>
                    )}
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