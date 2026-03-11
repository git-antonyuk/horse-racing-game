# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 3 + TypeScript + Vite application designed to host multiple games/pages. The first feature is an interactive horse racing game. Structure code so new features (games, pages) can be added independently.

## Architecture

**Design pattern:** Feature Slice Design (FSD) — organize code by feature/domain slices, not by technical role. Each feature lives in `src/features/{feature-name}/` and should contain its own `CLAUDE.md` with domain rules and feature-specific context.

**UI framework:** PrimeVue 4 with Tailwind CSS 4. PrimeVue components are auto-imported via `unplugin-vue-components` with `PrimeVueResolver` — no manual component imports needed.

**State management:** Use composables or Pinia for state. Vue 3 Composition API with `<script setup>`.

**Path alias:** `@` maps to `./src`.

## Commands

| Task | Command |
|------|---------|
| Install deps | `pnpm install` |
| Dev server | `pnpm dev` (port 3333) |
| Build | `pnpm build` (type-checks via vue-tsc, then vite build) |
| Lint | `pnpm lint` |
| Lint fix | `pnpm lint:fix` |
| Run all tests (watch) | `pnpm test` |
| Run single test | `pnpm test -- src/path/to/file.spec.ts` |
| Coverage report | `pnpm test:coverage` |

A `Makefile` wraps these commands (e.g., `make dev`, `make test`).

## Testing

- **Framework:** Vitest with jsdom environment
- **Globals:** enabled (`describe`, `it`, `expect` available without imports)
- **Setup file:** `src/tests/vitest.setup.ts`
- **Test file convention:** `*.spec.ts` colocated with source files
- **Coverage thresholds:** 90% for branches, lines, functions, and statements
- **Coverage output:** `test-results/coverage/` (JSON + HTML)

## Code Style

- ESLint via `@antfu/eslint-config` (flat config in `eslint.config.mjs`)
- Vue SFCs use `<script setup lang="ts">` with Composition API
- Strict TypeScript: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` enabled
- Use `type` instead of `interface` — no interfaces in this codebase
- SCSS available via `sass-embedded`

## Documentation References

Fetch these on-demand when working with the relevant technology:

- **PrimeVue index:** https://primevue.org/llms/llms.txt
- **PrimeVue full:** https://primevue.org/llms/llms-full.txt
- **PrimeVue per-component:** `https://primevue.org/llms/{component-name}.txt`
- **Vue 3:** https://context7.com/vuejs/docs/llms.txt?tokens=10000
- **Pinia:** https://context7.com/vuejs/pinia/llms.txt?tokens=10000
- **Vitest:** https://context7.com/vitest-dev/vitest/llms.txt?tokens=10000
