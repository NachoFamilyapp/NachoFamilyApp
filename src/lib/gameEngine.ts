import {
  Game,
  Player,
  Flag,
  LatLng,
  Team,
} from "@/types/game";

import {
  distanceBetween,
  pointInPolygon,
} from "./gps";

export class GameEngine {

  static isInsidePlayArea(
    game: Game,
    position: LatLng
  ) {
    return pointInPolygon(
      position,
      game.playArea
    );
  }

  static getNearestFlag(
    game: Game,
    player: Player
  ): Flag | null {

    if (game.flags.length === 0)
      return null;

    let nearest = game.flags[0];

    let nearestDistance =
      distanceBetween(
        {
          lat: player.lat,
          lng: player.lng,
        },
        nearest.position
      );

    for (const flag of game.flags) {

      const distance =
        distanceBetween(
          {
            lat: player.lat,
            lng: player.lng,
          },
          flag.position
        );

      if (
        distance <
        nearestDistance
      ) {
        nearestDistance =
          distance;

        nearest = flag;
      }
    }

    return nearest;
  }

  static getDistanceToFlag(
    player: Player,
    flag: Flag
  ) {

    return distanceBetween(
      {
        lat: player.lat,
        lng: player.lng,
      },
      flag.position
    );

  }

  static canCaptureFlag(
    player: Player,
    flag: Flag,
    radius: number
  ) {

    if (
      player.team === flag.team
    )
      return false;

    const distance =
      this.getDistanceToFlag(
        player,
        flag
      );

    return distance <= radius;

  }

  static getEnemyPlayers(
    game: Game,
    player: Player
  ) {

    return Object.values(
      game.players
    ).filter(
      (p) =>
        p.team !== player.team
    );

  }

  static getFriendlyPlayers(
    game: Game,
    player: Player
  ) {

    return Object.values(
      game.players
    ).filter(
      (p) =>
        p.team === player.team
    );

  }

  static addScore(
    player: Player,
    points: number
  ) {

    player.score += points;

    return player.score;

  }

  static playerAlive(
    player: Player
  ) {

    return (
      player.status ===
      "alive"
    );

  }

  static playerOnline(
    player: Player
  ) {

    return player.online;

  }

  static getWinner(
    game: Game
  ) {

    const players =
      Object.values(
        game.players
      );

    if (
      players.length === 0
    )
      return null;

    return players.sort(
      (a, b) =>
        b.score - a.score
    )[0];

  }

  static getTeamScore(
    game: Game,
    team: string
  ) {

    return Object.values(
      game.players
    )

      .filter(
        (p) =>
          p.team === team
      )

      .reduce(
        (sum, p) =>
          sum + p.score,
        0
      );

  }

  /**
   * Pak de vlag van de tegenstander op als je er dichtbij genoeg bent.
   * Geeft de bijgewerkte flags-array terug, of null als er niets veranderde.
   */
  static tryPickupFlag(
    game: Game,
    player: Player
  ): Flag[] | null {

    if (!this.playerAlive(player)) return null;

    let changed = false;

    const flags = game.flags.map((flag) => {

      if (
        flag.team === player.team ||
        flag.carriedBy ||
        flag.captured
      )
        return flag;

      const distance = distanceBetween(
        { lat: player.lat, lng: player.lng },
        flag.position
      );

      if (distance <= game.settings.captureRadius) {
        changed = true;
        return {
          ...flag,
          carriedBy: player.id,
          captured: true,
        };
      }

      return flag;
    });

    return changed ? flags : null;
  }

  /**
   * Breng de opgepakte vlag naar je eigen basis om een punt te scoren.
   * Geeft { flags, scoringPlayerId } terug als er gescoord is, anders null.
   */
  static tryScoreFlag(
    game: Game,
    player: Player
  ): { flags: Flag[]; scoringTeam: Player["team"] } | null {

    const carried = game.flags.find(
      (flag) => flag.carriedBy === player.id
    );

    if (!carried) return null;

    const homeFlag = game.flags.find(
      (flag) => flag.team === player.team
    );

    if (!homeFlag) return null;

    const distance = distanceBetween(
      { lat: player.lat, lng: player.lng },
      homeFlag.basePosition
    );

    if (distance > game.settings.captureRadius) return null;

    const flags = game.flags.map((flag) =>
      flag.id === carried.id
        ? {
            ...flag,
            carriedBy: null,
            captured: false,
            position: flag.basePosition,
          }
        : flag
    );

    return { flags, scoringTeam: player.team };
  }

  /**
   * Tik de tegenstander die jouw vlag draagt, zodat hij terugkeert naar de basis.
   * Geeft de bijgewerkte flags-array terug, of null als er niets veranderde.
   */
  static tryTagCarrier(
    game: Game,
    player: Player
  ): Flag[] | null {

    let changed = false;

    const flags = game.flags.map((flag) => {

      if (
        flag.team !== player.team ||
        !flag.carriedBy
      )
        return flag;

      const carrier = game.players[flag.carriedBy];

      if (!carrier) return flag;

      const distance = distanceBetween(
        { lat: player.lat, lng: player.lng },
        { lat: carrier.lat, lng: carrier.lng }
      );

      if (distance <= game.settings.tagRadius) {
        changed = true;
        return {
          ...flag,
          carriedBy: null,
          captured: false,
          position: flag.basePosition,
        };
      }

      return flag;
    });

    return changed ? flags : null;
  }

  static checkWinner(game: Game): Team | null {

    const teams: Team[] = ["red", "blue"];

    for (const team of teams) {
      if (this.getTeamScore(game, team) >= game.settings.scoreLimit) {
        return team;
      }
    }

    return null;
  }

}