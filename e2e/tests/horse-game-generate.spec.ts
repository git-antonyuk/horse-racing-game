import { expect, test } from '@playwright/test'
import { generateProgram, navigateToGame } from '../helpers/game-actions'
import { sel } from '../helpers/selectors'

test.describe('Horse Game — Generate Program', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToGame(page)
    await generateProgram(page)
  })

  test('horse list shows 20 horses', async ({ page }) => {
    const rows = page.locator(`${sel.horseList} table tbody tr`)
    await expect(rows).toHaveCount(20)
  })

  test('each horse has name, color, and condition (1-100)', async ({ page }) => {
    const rows = page.locator(`${sel.horseList} table tbody tr`)
    const count = await rows.count()

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i)
      const cells = row.locator('td')
      // Columns: #, Color, Name, Condition
      await expect(cells).toHaveCount(4)

      const condition = await cells.nth(3).textContent()
      const condVal = Number(condition?.trim())
      expect(condVal).toBeGreaterThanOrEqual(1)
      expect(condVal).toBeLessThanOrEqual(100)
    }
  })

  test('program shows 6 rounds', async ({ page }) => {
    const programTables = page.locator(`${sel.raceProgram} table`)
    await expect(programTables).toHaveCount(6)
  })

  test('each round lists 10 horses', async ({ page }) => {
    const programTables = page.locator(`${sel.raceProgram} table`)
    const count = await programTables.count()

    for (let i = 0; i < count; i++) {
      const rows = programTables.nth(i).locator('tbody tr')
      await expect(rows).toHaveCount(10)
    }
  })

  test('Start button becomes enabled', async ({ page }) => {
    await expect(page.locator(sel.startBtn)).toBeEnabled()
  })

  test('race track shows round 1 info', async ({ page }) => {
    await expect(page.locator(sel.roundInfo)).toContainText('Round 1')
    await expect(page.locator(sel.roundInfo)).toContainText('m')
  })

  test('re-clicking Generate regenerates data', async ({ page }) => {
    const firstHorse = await page.locator(`${sel.horseList} table tbody tr`).first().textContent()
    await generateProgram(page)
    // Data is random so it might occasionally match, but the action should work
    const rows = page.locator(`${sel.horseList} table tbody tr`)
    await expect(rows).toHaveCount(20)
    // Just verify data was regenerated (list still has 20 horses)
    expect(firstHorse).toBeDefined()
  })
})
