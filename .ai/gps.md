# GPS Engine

Version: 1.0

---

# Purpose

The GPS Engine is responsible for all location-based functionality inside NachoFamilyApp.

It provides:

- Live Position
- Route Recording
- Ride Detection
- Zone Detection
- Distance Tracking
- Speed Calculation
- Navigation
- Mission Progress

The GPS Engine is one of the core systems of the application.

---

# Goals

- Accurate
- Battery Efficient
- Reliable
- Offline Friendly
- Real-time
- Modular

---

# GPS Update Cycle

Default interval

Every 5 seconds

Future

Adaptive interval based on movement speed.

Example

Standing still

15 seconds

Walking

5 seconds

Fast movement

2 seconds

---

# GPS Data

Each update contains

latitude

longitude

accuracy

altitude

speed

heading

timestamp

provider

---

# Player Route

Every GPS update is added to the current route.

Store

Position

Timestamp

Accuracy

Routes can later be used for

Replay

Heatmaps

Distance

Statistics

Achievements

---

# Accuracy

Preferred accuracy

< 10 meters

Acceptable

10–25 meters

Poor

> 25 meters

Poor accuracy should never trigger ride detection.

---

# Battery Optimization

Avoid continuous high accuracy when unnecessary.

Rules

Reduce updates while stationary.

Increase updates while moving.

Ignore duplicate positions.

Ignore GPS jumps.

---

# Ride Detection

Every ride contains

id

name

latitude

longitude

radius

category

minimumDuration

---

# Ride Detection Algorithm

Every GPS update

↓

Find nearby rides

↓

Calculate distance

↓

Inside radius?

↓

Yes

↓

Start ride timer

↓

Remain inside minimum duration?

↓

Yes

↓

Ride Started

↓

Track duration

↓

Player exits radius

↓

Ride Finished

---

# Ride Visit

Store

Ride ID

Entry Time

Exit Time

Duration

Waiting Time

Distance Walked

GPS Accuracy

---

# False Positives

Prevent

GPS spikes

Fast drive-by

Brief radius crossings

Poor GPS accuracy

Require minimum dwell time before confirming a ride.

---

# Waiting Time

Waiting begins when

Player enters queue area.

Waiting ends when

Ride starts.

Store

Start

End

Total Wait

Average Wait

---

# Zones

Each park may contain zones.

Examples

Entrance

Kids Area

Western Area

Pirate Area

Restaurants

Shows

Parking

Shops

Benefits

Statistics

Mission Triggers

Navigation

Heatmaps

---

# Navigation

Future features

Navigate to attraction

Navigate to mission

Nearest toilet

Nearest restaurant

Nearest first aid

Nearest family area

---

# Route Recording

Store

Latitude

Longitude

Timestamp

Accuracy

Heading

Speed

Routes can be exported later.

---

# Statistics

Calculate

Distance Walked

Average Speed

Maximum Speed

Stationary Time

Ride Time

Waiting Time

Park Coverage

Visited Zones

---

# Heatmap

Future feature

Generate heatmaps showing

Popular attractions

Walking routes

Crowded areas

Mission hotspots

---

# Offline Support

Continue recording GPS.

Queue updates locally.

Synchronize automatically when online.

Never lose location history.

---

# Privacy

GPS belongs to the player.

Only share

Current location

When participating in multiplayer.

Historical routes remain private unless explicitly shared.

---

# Future Features

Indoor positioning

Bluetooth beacons

Ride auto-detection improvements

Live crowd estimation

Smart route planning

AR navigation

Wearables

Apple Watch

Android Watch

---

# AI Guidelines

When implementing GPS features

Always prioritize

Accuracy

Battery life

Privacy

Performance

Never hardcode coordinates.

Always use park configuration data.

GPS should integrate with

Ride Engine

Mission Engine

Statistics Engine

Achievements

Maps

Firebase

Avoid duplicate GPS logic in multiple components.