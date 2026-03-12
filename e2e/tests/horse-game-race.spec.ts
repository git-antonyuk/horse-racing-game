import { expect, test } from '@playwright/test'
import { clickStartPause, generateProgram, navigateToGame } from '../helpers/game-actions'
import { sel } from '../helpers/selectors'

test.describe('Horse Game — Race Flow', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToGame(page)
    await generateProgram(page)
  })

  test('Start → button changes to Pause, Generate disabled', async ({ page }) => {
    await clickStartPause(page)
    await expect(page.locator(sel.startBtn)).toContainText('Pause')
    await expect(page.locator(sel.generateBtn)).toBeDisabled()
  })

  test('Pause → button changes to Resume', async ({ page }) => {
    await clickStartPause(page) // Start
    await expect(page.locator(sel.startBtn)).toContainText('Pause')
    await clickStartPause(page) // Pause
    await expect(page.locator(sel.startBtn)).toContainText('Resume')
  })

  test('Resume → race continues', async ({ page }) => {
    await clickStartPause(page) // Start
    await clickStartPause(page) // Pause
    await expect(page.locator(sel.startBtn)).toContainText('Resume')
    await clickStartPause(page) // Resume
    await expect(page.locator(sel.startBtn)).toContainText('Pause')
  })

  test('all 6 rounds complete and controls reset', async ({ page }) => {
    await clickStartPause(page)
    // Wait for race to finish — Generate becomes enabled again
    await expect(page.locator(sel.generateBtn)).toBeEnabled({ timeout: 30_000 })
    // After finish: Start disabled, Generate re-enabled
    await expect(page.locator(sel.startBtn)).toBeDisabled()
    await expect(page.locator(sel.generateBtn)).toBeEnabled()
  })
})
