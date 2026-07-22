# Coding Standards

Version: 1.0

---

# Purpose

This document defines the coding standards for NachoFamilyApp.

Every contributor, AI assistant, and developer should follow these standards.

The goals are

- Readable code
- Consistent architecture
- Maintainability
- Performance
- Reusability
- Scalability

---

# General Principles

Always write code that is

Simple

Readable

Reusable

Testable

Maintainable

Predictable

---

# Before Writing Code

Always

Understand the existing architecture

Search for existing components

Search for existing hooks

Search for existing utilities

Reuse before creating

Avoid duplication

---

# Project Structure

Feature-based organization is preferred.

Example

components/

hooks/

services/

contexts/

types/

utils/

app/

Do not create random folders.

---

# Components

Each component should have a single responsibility.

Prefer

Small components

Reusable components

Composable components

Avoid components larger than approximately 300 lines.

Split large components into logical pieces.

---

# Naming

Components

PascalCase

Example

RideCard.tsx

MissionList.tsx

PlayerMarker.tsx

Hooks

camelCase

Example

useGPS.ts

useRideDetection.ts

useStatistics.ts

Utilities

camelCase

Example

calculateDistance.ts

formatDuration.ts

Types

PascalCase

Example

Player

Mission

Ride

GameSettings

Enums

PascalCase

Example

GameState

MissionType

RideCategory

---

# TypeScript

Always use strict typing.

Never use

any

unless absolutely unavoidable.

Prefer

interfaces

for objects.

Use

type

for unions and utility types.

Always type

props

functions

hooks

context values

Firestore models

API responses

---

# React

Prefer

Functional Components

React Hooks

Memoization only when beneficial.

Avoid unnecessary re-renders.

Keep state as local as possible.

Avoid prop drilling when Context is more appropriate.

---

# State Management

Local State

useState

Shared State

Context

Server State

Firebase

Avoid duplicated state.

---

# Hooks

Hooks should contain business logic.

Components should contain presentation logic.

Custom hooks should be reusable.

---

# Services

Business logic belongs in services.

Examples

Firebase

GPS

Ride Detection

Mission Engine

Statistics

Components should never directly contain complex business logic.

---

# Styling

Use Tailwind CSS.

Avoid inline styles.

Avoid duplicated utility classes.

Create reusable UI components when patterns repeat.

---

# Colors

Never hardcode colors.

Use design tokens or Tailwind theme.

Support dark mode.

---

# Magic Numbers

Never write

15

100

5000

without explanation.

Create constants.

Example

GPS_UPDATE_INTERVAL

RIDE_RADIUS

MISSION_TIMEOUT

---

# Constants

Store shared constants in

constants/

Never duplicate constant values.

---

# Error Handling

Handle expected failures.

Examples

GPS unavailable

Firebase offline

Network timeout

Missing permissions

Provide meaningful user feedback.

Never silently ignore errors.

---

# Logging

Use structured logging.

Avoid random console.log statements.

Temporary debugging should be removed before commit.

---

# Firebase

Never duplicate collections.

Never duplicate queries.

Reuse services.

Batch writes where possible.

Limit Firestore reads.

Use server timestamps.

---

# GPS

Never duplicate GPS calculations.

Centralize location logic.

Always consider battery usage.

Validate GPS accuracy before using location data.

---

# Performance

Avoid unnecessary renders.

Memoize expensive calculations.

Lazy load large components.

Virtualize long lists if needed.

Keep bundle size small.

---

# Accessibility

Buttons must have labels.

Interactive elements should be keyboard accessible.

Provide alt text for images.

Use semantic HTML.

Maintain sufficient color contrast.

---

# Testing

Every new feature should be tested for

Desktop

Mobile

Offline

Firebase

GPS

Edge cases

---

# Documentation

Every major feature should update

Architecture

Roadmap

Relevant AI documentation

if behavior changes.

---

# Pull Request Checklist

Before merging

Code builds successfully

TypeScript passes

Lint passes

No duplicate logic

Documentation updated

No unnecessary files

Performance considered

Mobile tested

---

# AI Guidelines

When generating code

Always look for existing implementations first.

Prefer extending existing systems over creating new ones.

Never rewrite working code without a clear reason.

If uncertain, ask rather than assume.

Every change should make the project easier to maintain.