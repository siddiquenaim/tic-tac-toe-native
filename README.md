# Tic Tac Toe

A polished React Native Tic Tac Toe game built with Expo and Expo Router.

## Overview

This app is a modern single-screen Tic Tac Toe experience designed for mobile. It supports both local two-player gameplay and a bot opponent, with a lightweight settings menu instead of bottom navigation.

## Features

- `2 Players` mode for local pass-and-play
- `vs AI` mode with `easy`, `medium`, and `hard` difficulty levels
- Alternating first turn in bot mode between rounds
- Light and dark theme switching
- Sound effects toggle for tap, win, and draw sounds
- Hamburger settings menu for in-game controls
- Animated win line, cell pop interactions, and launch intro animation
- Reset and new round actions

## Tech Stack

- Expo
- React Native
- Expo Router
- TypeScript

## Run The App

```bash
yarn install
yarn start
```

Then open it in:

- Android emulator/device with `yarn android`
- iOS simulator/device with `yarn ios`
- Web with `yarn web`

## Project Notes

- App icon and splash are configured in `app.json`
- The app uses a custom one-screen layout with no bottom tab navigation
- Settings are currently in-memory and reset when the app restarts
