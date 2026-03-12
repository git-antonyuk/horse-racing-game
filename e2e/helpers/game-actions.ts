import type { Page } from '@playwright/test'
import { sel } from './selectors'

export async function navigateToGame(page: Page) {
  await page.goto('/')
  await page.waitForSelector(sel.pageTitle)
}

export async function generateProgram(page: Page) {
  await page.click(sel.generateBtn)
  await page.waitForSelector(`${sel.horseList} table tbody tr`)
}

export async function clickStartPause(page: Page) {
  await page.click(sel.startBtn)
}

export async function runFullRace(page: Page) {
  await clickStartPause(page)
  // Wait for all 6 rounds to complete — the start button becomes disabled
  // and generate button becomes enabled again when finished
  await page.waitForSelector(`${sel.generateBtn}:not([disabled])`, { timeout: 30_000 })
}
