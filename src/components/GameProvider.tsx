"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import GameService from "@/lib/gameService";
import { GameLoop } from "@/lib/gameLoop";

import {
  Game,
  Player,
  LatLng,
} from "@/types/game";

type GameContextType = {
  game: Game | null;
  player: Player | null;
  position: LatLng | null;
  heading: number;
  loading: boolean;
};

const GameContext =
  createContext<GameContextType>({
    game: null,
    player: null,
    position: null,
    heading: 0,
    loading: true,
  });

export function useGame() {
  return useContext(GameContext);
}

type Props = {
  children: ReactNode;
};

export default function GameProvider({
  children,
}: Props) {

  const router = useRouter();

  const [game, setGame] =
    useState<Game | null>(null);

  const [player, setPlayer] =
    useState<Player | null>(null);

  const [position, setPosition] =
    useState<LatLng | null>(null);

  const [heading, setHeading] =
    useState(0);

  const [loading, setLoading] =
    useState(() => {
      if (typeof window === "undefined") return true;

      const gameCode = GameService.getStoredGameCode();
      const playerId = GameService.getStoredPlayerId();

      return Boolean(gameCode && playerId);
    });

  const gameLoop =
    useRef(new GameLoop());

  useEffect(() => {

    const gameCode =
      GameService.getStoredGameCode();

    const playerId =
      GameService.getStoredPlayerId();

    if (
      !gameCode ||
      !playerId
    ) {
      return;
    }

    const unsubscribe =
      GameService.listenToGame(
        gameCode,
        (gameData) => {

          if (!gameData) {
            setLoading(false);
            return;
          }

          setGame(gameData);

          const currentPlayer =
            gameData.players[playerId];

          if (currentPlayer) {
            setPlayer(currentPlayer);
          }

          setLoading(false);

        }
      );

    return unsubscribe;

  }, []);
    useEffect(() => {

    if (!navigator.geolocation) {
      return;
    }

    const watch =
      navigator.geolocation.watchPosition(

        async (gps) => {

          const current: LatLng = {

            lat: gps.coords.latitude,
            lng: gps.coords.longitude,

          };

          setPosition(current);

          if (
            game &&
            player
          ) {

            await GameService.updatePosition(

              game.gameCode,

              player.id,

              current

            );

          }

        },

        console.error,

        {

          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 10000,

        }

      );

    return () => {

      navigator.geolocation.clearWatch(
        watch
      );

    };

  }, [game, player]);
    useEffect(() => {

    function orientation(
      event: DeviceOrientationEvent
    ) {

      if (event.alpha == null) {
        return;
      }

      setHeading(event.alpha);

      if (
        game &&
        player
      ) {

        GameService.updateHeading(

          game.gameCode,

          player.id,

          event.alpha

        ).catch(console.error);

      }

    }

    window.addEventListener(
      "deviceorientation",
      orientation
    );

    return () => {

      window.removeEventListener(
        "deviceorientation",
        orientation
      );

    };

  }, [game, player]);

  useEffect(() => {

    if (
      game &&
      player
    ) {

      gameLoop.current.start(
        game,
        player
      );

    }

    return () => {

      gameLoop.current.stop();

    };

  }, [game, player]);

  useEffect(() => {

    if (game?.status === "finished") {
      router.replace("/results");
    }

  }, [game?.status, router]);
    return (

    <GameContext.Provider
      value={{

        game,

        player,

        position,

        heading,

        loading,

      }}
    >

      {children}

    </GameContext.Provider>

  );

}