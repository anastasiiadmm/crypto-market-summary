# Crypto Market Summary (Vue 3 + Pinia + TS)

This is my take on the **Senior Vue 3 Developer** test. I built a compact but production-style app with Vue 3 (Composition API), Pinia, and TypeScript. It fetches currency configuration and crypto market data from the provided APIs, updates in real time, and offers search/sort/filter. I also render the currency list with icons (base64 SVGs from the API).

## Stack

- **Vue 3** (Composition API, `<script setup lang="ts">`)
- **TypeScript**
- **Pinia** for state and derived data
- **Vite** for dev/build
- **Zod v4** for runtime validation and resilient parsing of API responses

## Features

- Fetch currency configuration and market data
- Real-time updates via polling (interval is user-configurable)
- Search by symbol/name, sort by multiple fields
- Filter by quote currency (**Quote**)
- Currency icons (base64 SVG) rendered next to the quote selector and in a full currency list
- Defensive parsing with Zod and explicit mappers (stable domain types even if the API shape wobbles)
- Graceful handling when the mock API ignores `?quote=`:
  - I keep the user’s selection as-is and show a small notice if the server only has data for a different quote (e.g. AUD)

## Getting Started

```bash
npm i
npm run dev
```

## Deploy

- Local: npm i && npm run dev

- Vercel/Netlify: npm run build, publish dist/. No secrets or env vars required.

### Dependencies

- [Vue3](https://github.com/vuejs/core)
- [Pinia](https://github.com/vuejs/pinia/blob/v2/LICENSE)
- [Zod](https://github.com/colinhacks/zod/blob/main/LICENSE)
- [date-fns](https://github.com/date-fns/date-fns/blob/main/LICENSE.md)
- [VIte](https://github.com/vitejs/vite/blob/main/LICENSE)

### DevDependencies

- [Dev Dependencies](https://github.com/vitejs/vite-plugin-vue/blob/main/LICENSE)
- [TypeScript](https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt)

## Linting & Formatting

I use **ESLint v9 (Flat Config)** with type-aware rules and Prettier:

- `eslint.config.js` (Flat Config) with:
  - `@typescript-eslint` (incl. type-checked rules)
  - `eslint-plugin-vue` (Vue 3 SFC rules)
  - `eslint-plugin-import` (order, duplicates)
  - `eslint-plugin-unused-imports` (auto-clean)
  - `eslint-plugin-promise`, `eslint-plugin-sonarjs`
  - `eslint-config-prettier` (turns off conflicting rules)
- `tsconfig.eslint.json` enables typed linting for `.ts` and `.vue`.
- Prettier config in `.prettierrc.json`.

Scripts:
```bash
npm run lint         # strict lint (no warnings allowed)
npm run lint:fix     # fixable issues
npm run format       # prettier check
npm run format:fix   # prettier write
```

Author: Anastasiia Ponamareva (Frontend, Vue 3 + TypeScript)

I’ll include repository and deployment links in my submission email.
