# Ride Engine

Version: 1.0

---

# Purpose

The Ride Engine is responsible for managing every attraction inside a park.

It provides:

- Ride information
- Ride detection
- Queue tracking
- Visit history
- Favorites
- Statistics
- Mission integration

The Ride Engine works closely with the GPS Engine.

---

# Ride Categories

Supported categories

Roller Coaster

Water Ride

Family Ride

Thrill Ride

Kids Ride

Dark Ride

Transport Ride

Show

Restaurant

Shop

Playground

Photo Point

Service

---

# Ride Model

Each ride contains

id

parkId

name

shortName

category

latitude

longitude

radius

queueRadius

exitRadius

minimumHeight

maximumHeight

duration

capacity

theme

status

enabled

image

description

tags

---

# Ride Status

Possible values

Open

Closed

Maintenance

Temporarily Closed

Seasonal

Unknown

Future support

Live status updates.

---

# Ride Detection

A ride visit starts when

Player enters ride radius

AND

GPS accuracy is acceptable

AND

Minimum dwell time is reached

Ride visit ends when

Player exits exit radius

OR

Ride timeout occurs

---

# Queue Detection

Player enters queue radius

↓

Queue timer starts

↓

Ride begins

↓

Queue timer stops

Store

Queue Start

Queue End

Total Wait

Average Wait

---

# Visit Tracking

Every ride visit stores

Ride ID

Entry Time

Exit Time

Ride Duration

Queue Time

Distance Walked

GPS Accuracy

Mission Triggered

Points Earned

---

# Ride Statistics

Track

Visit Count

Total Ride Time

Average Ride Time

Longest Ride

Shortest Ride

Average Queue

Fastest Queue

Longest Queue

Favorite Ride

Most Visited Ride

---

# Ride Achievements

Examples

First Ride

5 Rides

10 Rides

25 Rides

50 Rides

Ride Every Coaster

Ride Every Water Ride

Ride Every Attraction

Night Rider

Early Bird

Park Explorer

---

# Favorite Rides

Players can

Favorite rides

Rate rides

Add notes

Upload photos

Future

Share favorites with family.

---

# Ride Photos

Optional

Store

Photo

Timestamp

Ride

Caption

Location

Mission

---

# Ride Missions

A ride may trigger

Mission Start

Mission Completion

QR Challenge

Trivia

Photo Challenge

Puzzle

Timed Challenge

Ride Badge

---

# Ride Events

Events generated

Ride Detected

Ride Started

Ride Finished

Queue Started

Queue Finished

Ride Favorited

Ride Rated

---

# Map Integration

Display

Ride Marker

Queue Status

Current Ride

Visited Ride

Favorite Ride

Mission Ride

---

# Family Features

Track

Who rode together

Who skipped

Family ride history

Team ride count

---

# Future Features

Live queue estimates

Crowd prediction

Ride recommendations

Smart route planner

Accessibility filters

Weather impact

Ride reservations

Virtual queue support

---

# AI Guidelines

Never hardcode ride information.

Ride locations must come from park configuration.

All ride logic must use the GPS Engine.

Ride visits should automatically update

Statistics

Achievements

Missions

Leaderboards

Firebase

The Ride Engine should remain independent of park-specific data so new parks can be added without changing application logic.