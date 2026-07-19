import { Game, Player } from "@/types/game";
import { GameEngine } from "./gameEngine";
import { FirebaseGame } from "./firebaseGame";

export class GameLoop {

  private timer: NodeJS.Timeout | null = null;

  start(
    game: Game,
    player: Player
  ) {

    this.stop();

    this.timer = setInterval(
      async () => {

        try {

          if (game.status !== "running") return;

          if (!GameEngine.playerAlive(player)) return;

          if (
            !GameEngine.isInsidePlayArea(
              game,
              { lat: player.lat, lng: player.lng }
            )
          ) {
            return;
          }

          // 1) Probeer de vlag van de tegenstander op te pakken
          const pickedUp = GameEngine.tryPickupFlag(game, player);

          if (pickedUp) {
            await FirebaseGame.setFlags(game.gameCode, pickedUp);
            return;
          }

          // 2) Probeer een opgepakte vlag te scoren op je eigen basis
          const scored = GameEngine.tryScoreFlag(game, player);

          if (scored) {
            const newScore = GameEngine.addScore(player, 1);

            await FirebaseGame.setFlags(game.gameCode, scored.flags);
            await FirebaseGame.updateScore(
              game.gameCode,
              player.id,
              newScore
            );

            const wouldBeGame: Game = {
              ...game,
              flags: scored.flags,
              players: {
                ...game.players,
                [player.id]: { ...player, score: newScore },
              },
            };

            const winner = GameEngine.checkWinner(wouldBeGame);

            if (winner) {
              await FirebaseGame.setWinner(game.gameCode, winner, player.id);
              await FirebaseGame.finishGame(game.gameCode);
            }

            return;
          }

          // 3) Probeer een tegenstander te tikken die jouw vlag draagt
          const tagged = GameEngine.tryTagCarrier(game, player);

          if (tagged) {
            await FirebaseGame.setFlags(game.gameCode, tagged);

            await FirebaseGame.updateLastTag(game.gameCode, {
              taggedPlayer: "",
              taggedBy: player.id,
              time: Date.now(),
            });

            return;
          }

        } catch (error) {
          console.error("GameLoop tick error:", error);
        }

      },

      1000

    );

  }

  stop() {

    if (this.timer) {

      clearInterval(
        this.timer
      );

      this.timer = null;

    }

  }

}
