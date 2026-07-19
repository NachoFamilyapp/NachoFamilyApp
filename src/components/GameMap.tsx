"use client";

import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
} from "react-leaflet";

import { useGame } from "@/components/GameProvider";
import PlayerMarker from "@/components/PlayerMarker";

export default function GameMap() {

  const {
    game,
    player,
  } = useGame();

  if (!game || !player) {

    return (

      <div className="flex h-[700px] items-center justify-center rounded-xl border">

        Spel laden...

      </div>

    );

  }

  return (

    <div
      style={{
        width: "100%",
        height: "700px",
      }}
    >

      <MapContainer
        center={[player.lat, player.lng]}
        zoom={18}
        style={{
          width: "100%",
          height: "100%",
        }}
      >

        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {game.playArea.length >= 3 && (

          <Polygon
            positions={game.playArea.map((point) => [
              point.lat,
              point.lng,
            ])}
          />

        )}

        {game.flags.map((flag) => (

          <Marker
            key={flag.id}
            position={[
              flag.position.lat,
              flag.position.lng,
            ]}
          >

            <Popup>

              🚩 {flag.team}

            </Popup>

          </Marker>

        ))}

        {Object.values(game.players).map((currentPlayer) => (

          <PlayerMarker
            key={currentPlayer.id}
            player={currentPlayer}
          />

        ))}

      </MapContainer>

    </div>

  );

}