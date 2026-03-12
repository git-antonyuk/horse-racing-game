.DEFAULT_GOAL := help

.PHONY: help dev build preview test test-coverage lint lint-fix install e2e e2e-ui e2e-headed

help: ## Show this help message
	@echo ""
	@echo "  Horse Racing Game"
	@echo "  ─────────────────"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
	@echo ""

install: ## Install project dependencies via pnpm
	pnpm install

dev: ## Start Vite dev server with HMR
	pnpm dev

build: ## Type-check with vue-tsc then build for production
	pnpm build

preview: ## Serve the production build locally
	pnpm preview

test: ## Run tests in watch mode via Vitest
	pnpm test

test-coverage: ## Run tests once and generate coverage report
	pnpm test:coverage

lint: ## Check code for linting errors (ESLint)
	pnpm lint

lint-fix: ## Auto-fix linting errors where possible
	pnpm lint:fix

e2e: ## Run Playwright e2e tests (headless)
	pnpm e2e

e2e-ui: ## Run Playwright e2e tests in UI mode
	pnpm e2e:ui

e2e-headed: ## Run Playwright e2e tests in headed browser
	pnpm e2e:headed
