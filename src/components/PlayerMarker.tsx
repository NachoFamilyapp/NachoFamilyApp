"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

import { Player } from "@/types/game";

type Props = {
  player: Player;
};

const redIcon = new L.DivIcon({
  html: "🔴",
  className: "",
  iconSize: [32, 32],
});

const blueIcon = new L.DivIcon({
  html: "🔵",
  className: "",
  iconSize: [32, 32],
});

const hostIcon = new L.DivIcon({
  html: "👑",
  className: "",
  iconSize: [32, 32],
});

const carrierIcon = new L.DivIcon({
  html: "🚩",
  className: "",
  iconSize: [32, 32],
});

export default function PlayerMarker({
  player,
}: Props) {

  let icon =
    player.team === "red"
      ? redIcon
      : blueIcon;

  if (player.host) {
    icon = hostIcon;
  }

  if (player.hasFlag) {
    icon = carrierIcon;
  }

  return (

    <Marker
      position={[
        player.lat,
        player.lng,
      ]}
      icon={icon}
    >

      <Popup>

        <strong>{player.name}</strong>

        <br />

        Team: {player.team}

        <br />

        Score: {player.score}

        {player.host && (
          <>
            <br />
            👑 Host
          </>
        )}

        {player.hasFlag && (
          <>
            <br />
            🚩 Vlagdrager
          </>
        )}

        {!player.alive && (
          <>
            <br />
            💀 Uitgeschakeld
          </>
        )}

      </Popup>

    </Marker>

  );

}