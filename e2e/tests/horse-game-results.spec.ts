import { expect, test } from '@playwright/test'
import { generateProgram, navigateToGame, runFullRace } from '../helpers/game-actions'
import { sel } from '../helpers/selectors'

test.describe('Horse Game — Results', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToGame(page)
    await generateProgram(page)
  })

  test('after full race, 6 result tables are present', async ({ page }) => {
    await runFullRace(page)
    const results = page.locator(sel.roundResult)
    await expect(results).toHaveCount(6, { timeout: 10_000 })
  })

  test('each result shows positions 1–10', async ({ page }) => {
    await runFullRace(page)
    const results = page.locator(sel.roundResult)
    const count = await results.count()

    for (let i = 0; i < count; i++) {
      const rows = results.nth(i).locator('table tbody tr')
      await expect(rows).toHaveCount(10)
    }
  })

  test('horse names in results match horse list', async ({ page }) => {
    // Collect horse names from the list
    const horseNames = await page.locator(`${sel.horseList} table tbody tr td:nth-child(3)`).allTextContents()
    const nameSet = new Set(horseNames.map(n => n.trim()))

    await runFullRace(page)

    // Check that result names are in the horse list
    const resultNames = await page.locator(`${sel.roundResult} table tbody tr td:nth-child(3)`).allTextContents()
    for (const name of resultNames) {
      expect(nameSet.has(name.trim())).toBe(true)
    }
  })
})
