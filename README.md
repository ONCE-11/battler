# 🐮 Beef

Beef is a turn based PvP multiplayer game where your goal is to fight other players your knowledge of your player's kit. The application offers a grittier twist on the turn based RPGs with a variety of randomly-(ish) generated characters from lesser represented backgrounds and items thematic to New York City neighborhoods. This is still very much a work in progress but intended to offer an alternative to what has already been produced in the past within this space. The game is currently in an alpha stage.

## 🧑‍💻 Tech

- TypeScript
- ReactJS
- TailwindCSS
- Vite

## 🖥️ Production

The current url for the production build is [battler.onrender.com](http://battler.onrender.com).

## 👤 Players

There are 16 different usable players in the game. Each character utilizes three possible attacks. A weak, strong and special attack.

## ⚔️ Attacks

- Weak attacks generally have a good chance to hit but are weaker
- Strong attacks hit harder but have a chance to miss
- Special attacks can attack but generally provide other buffs such as healing or temporary improvements to attributes

## ⌛️ Future features

- Fluid animations
- Currency acquisition by winning battles
- Item acquisition through a shop
- Improved audio
- Unique scenarios
- Equipment
  - Weapons
  - Wearables
  - Rings

## 🔥 Want to test it for yourself?

### Installation

```
npm install
```

### Run locally

```
npm run dev
```

### Required Environment Variables

The following should be set in your `.env` file

```
VITE_SUPABASE_URL
VITE_SUPABASE_KEY
VITE_ENV=development
```
