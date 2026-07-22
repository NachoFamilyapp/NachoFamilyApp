# Statistics Engine

Version: 1.0

---

# Purpose

The Statistics Engine records and analyzes everything that happens during gameplay.

Its goals are to:

- Track player activity
- Measure game progress
- Generate leaderboards
- Award achievements
- Create insights
- Power dashboards
- Support future analytics

Statistics should be accurate, lightweight, and continuously updated.

---

# Core Principles

- Automatic
- Real-time
- Offline capable
- Low overhead
- Event-driven
- Easy to expand

---

# Categories

The engine tracks statistics in several categories.

- Player
- Team
- Family
- Game
- Park
- Ride
- Mission
- GPS
- Achievements

---

# Player Statistics

Track

Games Played

Games Won

Games Lost

Time Played

Total Score

Current Score

Average Score

Highest Score

Achievements Earned

Badges

---

# GPS Statistics

Track

Distance Walked

Current Speed

Average Speed

Maximum Speed

Walking Time

Standing Time

Park Coverage

Visited Zones

GPS Accuracy

Location Updates

---

# Ride Statistics

Track

Ride Count

Unique Rides

Favorite Ride

Most Visited Ride

Ride Time

Queue Time

Average Queue

Longest Queue

Shortest Queue

Ride Completion Rate

---

# Mission Statistics

Track

Missions Started

Missions Completed

Completion Rate

Average Completion Time

Skipped Missions

Failed Missions

Perfect Missions

Mission Points

---

# Team Statistics

Track

Total Score

Team Members

Completed Missions

Ride Count

Distance Walked

Achievements

Ranking

Average Performance

---

# Family Statistics

Track

Combined Distance

Combined Ride Count

Combined Missions

Combined Score

Combined Time

Family Achievements

Family Ranking

---

# Park Statistics

Track

Park Visits

Visit Duration

Visited Attractions

Visited Zones

Completed Challenges

Average Walking Distance

Favorite Park

---

# Game Statistics

Track

Start Time

End Time

Game Duration

Player Count

Team Count

Winner

Total Points

Events Generated

---

# Event Statistics

Track

Ride Started

Ride Finished

Mission Started

Mission Completed

Achievement Earned

QR Scanned

Photo Taken

GPS Update

Player Joined

Player Left

---

# Achievement Statistics

Track

Achievements Earned

Completion Percentage

Rare Achievements

Secret Achievements

Current Progress

---

# Daily Statistics

Store

Daily Distance

Daily Ride Count

Daily Missions

Daily Score

Daily Walking Time

Daily Photos

---

# Weekly Statistics

Store

Weekly Distance

Weekly Score

Weekly Ride Count

Weekly Missions

Weekly Park Visits

---

# Monthly Statistics

Store

Monthly Score

Monthly Distance

Monthly Ride Count

Monthly Missions

Monthly Achievements

---

# Lifetime Statistics

Store

Lifetime Distance

Lifetime Score

Lifetime Ride Count

Lifetime Missions

Lifetime Parks

Lifetime Play Time

Lifetime Achievements

---

# Leaderboards

Support

Current Game

Current Park

Family

Friends

Daily

Weekly

Monthly

All Time

---

# Analytics

Future analytics include

Most Popular Ride

Least Visited Ride

Heatmaps

Walking Paths

Peak Hours

Ride Popularity

Mission Difficulty

Average Queue Times

---

# Reports

Generate

Player Summary

Family Summary

Game Summary

Park Summary

Ride Summary

Mission Summary

Season Summary

---

# Data Sources

Statistics are updated by

GPS Engine

Ride Engine

Mission Engine

Achievement Engine

Game Engine

Firebase Events

Manual Admin Updates

Statistics should never be entered manually during gameplay.

---

# Performance

Statistics should

Update incrementally

Avoid expensive recalculations

Use cached values when possible

Batch Firebase writes

Avoid duplicate calculations

---

# Future Features

Trend Analysis

Charts

Personal Bests

Season Statistics

Yearly Statistics

Export to PDF

CSV Export

Heatmaps

AI Insights

Personal Recommendations

---

# AI Guidelines

Every new gameplay feature should integrate with the Statistics Engine.

When adding new systems

Update statistics automatically.

Never duplicate existing statistics.

Prefer deriving values from events instead of storing redundant data.

Statistics should remain consistent across

Players

Teams

Families

Games

Parks

Leaderboards