# Firebase Architecture

Version: 1.0

---

# Philosophy

Firebase is the single source of truth for all online data.

Rules:

- Never duplicate data.
- Keep documents small.
- Prefer references over copied data.
- Use server timestamps.
- Design for offline support.
- Optimize for minimal Firestore reads.

---

# Collections

users

games

teams

players

parks

rides

missions

statistics

events

photos

achievements

leaderboards

settings

logs

---

# users

One document per user.

Example

users/{userId}

Fields

uid

displayName

photoURL

email

role

createdAt

lastLogin

favoriteParks

settings

statistics

---

# games

games/{gameId}

Fields

id

name

parkId

status

hostId

createdAt

startedAt

endedAt

gameMode

settings

teamIds

playerCount

---

# teams

teams/{teamId}

Fields

id

gameId

name

color

score

members

createdAt

---

# players

players/{playerId}

Fields

userId

gameId

teamId

displayName

avatar

online

ready

location

currentRide

statistics

lastSeen

---

# parks

parks/{parkId}

Fields

id

name

country

city

mapCenter

mapZoom

rides

zones

missions

settings

---

# rides

rides/{rideId}

Fields

id

parkId

name

category

latitude

longitude

radius

estimatedDuration

minimumHeight

waitTime

tags

enabled

---

# missions

missions/{missionId}

Fields

id

parkId

type

title

description

difficulty

reward

gps

qr

photo

question

enabled

---

# statistics

statistics/{playerId}

Fields

distanceWalked

rideCount

rideTime

waitingTime

steps

missionsCompleted

points

photosTaken

lastUpdated

---

# events

events/{eventId}

Used for:

Game Started

Ride Entered

Ride Finished

Mission Completed

Achievement Unlocked

GPS Update

Player Joined

Player Left

---

# achievements

achievements/{achievementId}

Fields

id

name

description

icon

points

requirements

hidden

---

# photos

photos/{photoId}

Fields

owner

gameId

missionId

storagePath

thumbnail

createdAt

---

# leaderboards

leaderboards/{parkId}

Stores

Daily

Weekly

Monthly

All Time

---

# settings

Application settings.

Examples

GPS interval

Ride detection radius

Theme

Notifications

Feature flags

---

# logs

Developer logging.

Examples

Errors

Warnings

Performance

GPS diagnostics

Sync diagnostics

---

# Storage

Organize Firebase Storage as

avatars/

missions/

parks/

rides/

photos/

temp/

exports/

---

# Security Rules

Users may only edit their own profile.

Hosts may edit their own game.

Admins manage parks and rides.

Statistics are append/update only.

Never trust client validation.

Always validate ownership.

---

# Naming Convention

Collections

camelCase

Documents

random Firestore IDs

Fields

camelCase

Dates

Timestamp

Coordinates

latitude

longitude

---

# Offline Strategy

Firestore offline enabled.

Queue writes while offline.

Sync automatically.

Resolve conflicts using server timestamps.

---

# Future Collections

badges

friends

chat

notifications

inventory

marketplace

quests

seasonPass

analytics

deviceInfo

feedback

supportTickets

---

# AI Guidelines

When generating code:

- Reuse existing collections.
- Never invent new field names.
- Never duplicate data.
- Prefer references.
- Keep reads inexpensive.
- Design for scalability.