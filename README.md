# Horse Racing Game

Vue 3 + TypeScript + Vite application built with **Feature Slice Design** architecture. Hosts interactive games starting with a horse racing simulator.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Language | TypeScript (strict) |
| Build | Vite 7 |
| UI | PrimeVue 4 + Tailwind CSS 4 |
| State | Pinia + composables |
| Routing | Vue Router 4 |
| Testing | Vitest (unit) + Playwright (e2e) |
| Linting | ESLint (`@antfu/eslint-config`) |

## Architecture

The project follows **Feature Slice Design (FSD)** — code is organized by domain, not by technical role. Each feature is self-contained with its own components, stores, composables, and tests.

```
src/
├── app/                  # App shell: layout, router, plugins, styles
├── features/             # Domain features (independent slices)
│   └── horse-game/       # Horse racing feature
│       ├── components/   #   UI components
│       ├── composables/  #   Reusable logic hooks
│       ├── stores/       #   Pinia stores
│       ├── engine/       #   Game engine
│       ├── pages/        #   Route pages
│       └── assets/       #   Feature-specific assets
├── shared/               # Cross-feature utilities and types
└── tests/                # Test setup and helpers
```

New features are added as independent slices under `src/features/`.

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10

## Quick Start

```sh
make install   # Install dependencies
make dev       # Start dev server (port 3333)
```

## Make Targets

Run `make help` to list all targets.

| Target | Description |
|--------|-------------|
| `make install` | Install project dependencies via pnpm |
| `make dev` | Start Vite dev server with HMR |
| `make build` | Type-check with vue-tsc then build for production |
| `make preview` | Serve the production build locally |
| `make test` | Run unit tests in watch mode (Vitest) |
| `make test-coverage` | Run tests once and generate coverage report |
| `make lint` | Check code for linting errors |
| `make lint-fix` | Auto-fix linting errors where possible |
| `make e2e` | Run Playwright e2e tests (headless) |
| `make e2e-ui` | Open Playwright e2e tests in UI mode |
| `make e2e-headed` | Run Playwright e2e tests in headed browser |

## Testing

Unit tests use **Vitest** with jsdom. Test files are colocated with source (`*.spec.ts`). Coverage thresholds: 80% across branches, lines, functions, and statements.

E2E tests use **Playwright**. Config lives in `e2e/playwright.config.ts`.

## Claude Code Commands

This project includes custom [Claude Code](https://claude.ai/code) slash commands in `.claude/commands/` to streamline common workflows:

| Command | Description |
|---------|-------------|
| `/unit-test [target]` | Write or fix Vitest unit tests following the composable test pattern |
| `/e2e-test [description]` | Write or fix Playwright e2e tests using centralized selectors and helpers |
| `/architecture [feature]` | Scaffold a new feature following Feature Slice Design structure |
| `/review [scope]` | Run a code review checking style, architecture, and test compliance |

**Examples:**
```sh
/unit-test useHorseGameStore        # Generate/improve unit tests for the store
/e2e-test add dark mode persistence # Create a new e2e test scenario
/architecture coin-flip game        # Scaffold a new game feature
/review horse-game feature          # Review the entire horse-game feature
```

## License

Proprietary © [antoniuk.dev](https://antoniuk.dev)
