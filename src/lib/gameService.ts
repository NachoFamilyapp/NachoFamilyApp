import { FirebaseGame } from "@/lib/firebaseGame";
import {
  Game,
  Player,
  Team,
  LatLng,
  GameStatus,
} from "@/types/game";

export class GameService {
  static generateGameCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  static createPlayer(
    name: string,
    host = false
  ): Player {
    return {
      id: crypto.randomUUID(),
      name,
      team: "red",
      host,

      lat: 0,
      lng: 0,
      heading: 0,

      score: 0,

      status: "alive",

      online: true,
      alive: true,
      hasFlag: false,

      lastUpdate: Date.now(),
    };
  }

  static async createGame(
  playerName: string
): Promise<Game> {

  const code = this.generateGameCode();

  const host = this.createPlayer(playerName, true);

  const game: Game = {
    gameCode: code,
    gameName: "Capture The Flag",

    status: "waiting",

    createdAt: Date.now(),

    startTime: 0,
    endTime: 0,

    players: {
      [host.id]: host,
    },

    flags: [],

    playArea: [],

    settings: {
      gameDuration: 1800,
      respawnTime: 15,
      captureRadius: 15,
      tagRadius: 10,
      maxPlayers: 20,
      friendlyFire: false,
      gpsAccuracy: 20,
      scoreLimit: 3,
      theme: "grasveld",
    },

    winner: null,
    winnerPlayer: null,

    gpsTestMode: false,

    lastTag: null,
  };

    await FirebaseGame.createGame(game);

    localStorage.setItem("gameCode", code);
    localStorage.setItem("playerId", host.id);
    localStorage.setItem("playerName", host.name);

    return game;
  }

  static async joinGame(
    gameCode: string,
    playerName: string
  ): Promise<Game | null> {

    const game = await FirebaseGame.getGame(gameCode);

    if (!game) return null;

    const player = this.createPlayer(playerName);

    game.players[player.id] = player;

    await FirebaseGame.updatePlayer(
      gameCode,
      player
    );

    localStorage.setItem("gameCode", gameCode);
    localStorage.setItem("playerId", player.id);
    localStorage.setItem("playerName", player.name);

    return game;
  }

  static async getGame(
    gameCode: string
  ): Promise<Game | null> {

    return FirebaseGame.getGame(gameCode);
  }

  static listenToGame(
    gameCode: string,
    callback: (game: Game | null) => void
  ) {
    return FirebaseGame.listen(
      gameCode,
      callback
    );
  }

  static async startGame(
    gameCode: string
  ) {
    await FirebaseGame.startGame(gameCode);
  }

  static async pauseGame(
    gameCode: string
  ) {
    await FirebaseGame.pauseGame(gameCode);
  }

  static async finishGame(
    gameCode: string
  ) {
    await FirebaseGame.finishGame(gameCode);
  }

  static async setWinner(
    gameCode: string,
    winner: Team | null,
    winnerPlayer: string | null = null
  ) {
    await FirebaseGame.setWinner(gameCode, winner, winnerPlayer);
  }
    static async updatePosition(
    gameCode: string,
    playerId: string,
    position: LatLng
  ) {
    await FirebaseGame.updatePosition(
      gameCode,
      playerId,
      position
    );
  }

  static async updateHeading(
    gameCode: string,
    playerId: string,
    heading: number
  ) {
    await FirebaseGame.updateHeading(
      gameCode,
      playerId,
      heading
    );
  }

  static async updateScore(
    gameCode: string,
    playerId: string,
    score: number
  ) {
    await FirebaseGame.updateScore(
      gameCode,
      playerId,
      score
    );
  }

  static async changeTeam(
    gameCode: string,
    playerId: string,
    team: Team
  ) {

    const game = await FirebaseGame.getGame(gameCode);

    if (!game) return;

    const player = game.players[playerId];

    if (!player) return;

    player.team = team;

    player.lastUpdate = Date.now();

    await FirebaseGame.updatePlayer(
      gameCode,
      player
    );
  }

  static async setOnline(
    gameCode: string,
    playerId: string,
    online: boolean
  ) {

    const game = await FirebaseGame.getGame(gameCode);

    if (!game) return;

    const player = game.players[playerId];

    if (!player) return;

    player.online = online;
    player.lastUpdate = Date.now();

    await FirebaseGame.updatePlayer(
      gameCode,
      player
    );
  }

  static async setAlive(
    gameCode: string,
    playerId: string,
    alive: boolean
  ) {

    const game = await FirebaseGame.getGame(gameCode);

    if (!game) return;

    const player = game.players[playerId];

    if (!player) return;

    player.alive = alive;
    player.status = alive ? "alive" : "tagged";
    player.lastUpdate = Date.now();

    await FirebaseGame.updatePlayer(
      gameCode,
      player
    );
  }

  static async setHasFlag(
    gameCode: string,
    playerId: string,
    hasFlag: boolean
  ) {

    const game = await FirebaseGame.getGame(gameCode);

    if (!game) return;

    const player = game.players[playerId];

    if (!player) return;

    player.hasFlag = hasFlag;
    player.lastUpdate = Date.now();

    await FirebaseGame.updatePlayer(
      gameCode,
      player
    );
  }

  static getStoredGameCode() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("gameCode") || "";
  }

  static getStoredPlayerId() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("playerId") || "";
  }

  static getStoredPlayerName() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("playerName") || "";
  }

  static clearStorage() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("gameCode");
    localStorage.removeItem("playerId");
    localStorage.removeItem("playerName");
  }
    static isHost(game: Game | null): boolean {

    if (!game) return false;

    const playerId = this.getStoredPlayerId();

    const player = game.players[playerId];

    return player?.host ?? false;
  }

  static getCurrentPlayer(
    game: Game | null
  ): Player | null {

    if (!game) return null;

    const playerId = this.getStoredPlayerId();

    return game.players[playerId] ?? null;
  }

  static getPlayers(
    game: Game | null
  ): Player[] {

    if (!game) return [];

    return Object.values(game.players);
  }

  static getTeamPlayers(
    game: Game | null,
    team: Team
  ): Player[] {

    return this
      .getPlayers(game)
      .filter((p) => p.team === team);
  }

  static getPlayerCount(
    game: Game | null
  ): number {

    return this.getPlayers(game).length;
  }

  static getStatus(
    game: Game | null
  ): GameStatus {

    return game?.status ?? "waiting";
  }

  static canStartGame(
    game: Game | null
  ): boolean {

    if (!game) return false;

    const players = this.getPlayers(game);

    if (players.length < 2) return false;

    if (game.playArea.length < 3) return false;

    const hasRed = players.some(
      (p) => p.team === "red"
    );

    const hasBlue = players.some(
      (p) => p.team === "blue"
    );

    return hasRed && hasBlue;
  }

  static getWinner(
    game: Game | null
  ): Team | null {

    return game?.winner ?? null;
  }

  static getWinnerPlayer(
    game: Game | null
  ): string | null {

    return game?.winnerPlayer ?? null;
  }

  static async refreshPlayer(
    gameCode: string
  ) {

    const game = await FirebaseGame.getGame(gameCode);

    if (!game) return;

    const player = this.getCurrentPlayer(game);

    if (!player) return;

    player.online = true;
    player.lastUpdate = Date.now();

    await FirebaseGame.updatePlayer(
      gameCode,
      player
    );
  }

  static async heartbeat(
    gameCode: string
  ) {

    const game = await FirebaseGame.getGame(gameCode);

    if (!game) return;

    const player = this.getCurrentPlayer(game);

    if (!player) return;

    player.lastUpdate = Date.now();

    await FirebaseGame.updatePlayer(
      gameCode,
      player
    );
  }

  static sortPlayersByScore(
    players: Player[]
  ): Player[] {

    return [...players].sort(
      (a, b) => b.score - a.score
    );
  }

  static getHost(
    game: Game | null
  ): Player | null {

    if (!game) return null;

    return (
      Object.values(game.players).find(
        (p) => p.host
      ) ?? null
    );
  }
}

export default GameService;