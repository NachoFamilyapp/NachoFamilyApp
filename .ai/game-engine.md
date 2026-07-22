# Game Engine

Version: 1.0

---

# Purpose

The Game Engine coordinates every interactive system inside NachoFamilyApp.

It is responsible for:

- Multiplayer
- GPS
- Ride Detection
- Missions
- Scoring
- Statistics
- Achievements
- Game State
- Synchronization

The Game Engine should remain modular so that new game modes can be added without changing existing systems.

---

# Core Principles

- Event Driven
- Modular
- Offline First
- Real-time Synchronization
- Mobile First
- Low Battery Usage
- Scalable

---

# High Level Flow

Player Opens App

↓

Login

↓

Join or Create Game

↓

Lobby

↓

Team Selection

↓

Game Start

↓

GPS Tracking

↓

Ride Detection

↓

Mission Engine

↓

Statistics Engine

↓

Achievements

↓

Leaderboard

↓

Game Finished

↓

Summary Screen

---

# Game States

Waiting

Lobby

Countdown

Running

Paused

Finished

Cancelled

Only one active state may exist at a time.

---

# Player Lifecycle

Player joins

↓

Receives Game Settings

↓

Selects Team

↓

Ready

↓

Game Starts

↓

Location Tracking

↓

Mission Progress

↓

Ride Tracking

↓

Statistics Update

↓

Game Ends

↓

Final Score

---

# GPS Engine

Responsible for

Current Position

Accuracy

Distance

Speed

Heading

Visited Locations

Route History

Current Zone

Nearest Ride

---

# Ride Detection

A ride visit begins when

Player enters ride radius

AND

Player remains inside radius for configured duration

A ride visit ends when

Player exits ride radius

OR

Ride timeout occurs

Track

Ride Name

Ride Duration

Visit Count

Wait Time

Timestamp

---

# Mission Engine

Mission Types

GPS

QR Code

Photo

Trivia

Multiple Choice

Compass

Morse Code

Cipher

Puzzle

Manual Checkpoint

Every mission contains

ID

Title

Description

Difficulty

Reward

Completion Rules

---

# Statistics Engine

Continuously calculates

Distance Walked

Ride Count

Ride Time

Waiting Time

Mission Count

Score

Average Speed

Calories (future)

Steps (future)

Family Ranking

Team Ranking

---

# Achievement Engine

Triggers when conditions are met.

Examples

First Ride

10 Rides

10000 Steps

Complete All Missions

Fast Walker

Explorer

Puzzle Master

Treasure Hunter

---

# Scoring Engine

Points may be awarded for

Mission Completion

Ride Visits

Bonus Objectives

Speed

Accuracy

Teamwork

Daily Challenges

Scoring rules should be configurable.

---

# Multiplayer Engine

Synchronizes

Players

Teams

Locations

Scores

Mission Status

Game State

Chat (future)

Uses Firebase as source of truth.

---

# Event System

Everything important generates an event.

Examples

Player Joined

Player Left

Ride Entered

Ride Exited

Mission Started

Mission Completed

Achievement Earned

Game Started

Game Finished

Events should be timestamped.

---

# Game Modes

Supported

Free Explore

Scavenger Hunt

Adventure

Competition

Family Day

Educational Tour

Photo Challenge

Future game modes should plug into the same engine.

---

# Game Loop

Repeat while game is running

Update GPS

↓

Update Ride Detection

↓

Check Mission Progress

↓

Update Statistics

↓

Award Achievements

↓

Sync Firebase

↓

Refresh UI

---

# Error Handling

If GPS unavailable

Continue game

Show warning

Retry automatically

If Firebase offline

Store locally

Synchronize later

Never lose player progress.

---

# AI Guidelines

When implementing new features

Do not bypass the Game Engine.

Always integrate with

Statistics

Events

Achievements

Multiplayer

Firebase

Avoid creating isolated systems.

Every new gameplay feature should become part of the Game Engine rather than existing as standalone logic.