import { expect, test } from '@playwright/test'
import { navigateToGame } from '../helpers/game-actions'
import { sel } from '../helpers/selectors'

test.describe('Horse Game — Idle State', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToGame(page)
  })

  test('displays page title', async ({ page }) => {
    await expect(page.locator(sel.pageTitle)).toHaveText('Horse Racing Game')
  })

  test('Generate Program button is enabled', async ({ page }) => {
    await expect(page.locator(sel.generateBtn)).toBeEnabled()
  })

  test('Start button is enabled', async ({ page }) => {
    await expect(page.locator(sel.startBtn)).toBeEnabled()
  })

  test('horse list is empty', async ({ page }) => {
    // PrimeVue DataTable may render an empty-message row; check no data rows with actual content
    const dataCells = page.locator(`${sel.horseList} table tbody tr td[data-p-frozen-column]`)
    const rowCount = await dataCells.count()
    // If PrimeVue renders an empty-message row, there are no real data cells
    // Alternatively, check the table has no meaningful data
    const emptyMessage = page.locator(`${sel.horseList} table tbody tr td[colspan]`)
    const hasEmpty = await emptyMessage.count()
    expect(rowCount === 0 || hasEmpty > 0).toBe(true)
  })

  test('results section shows no results', async ({ page }) => {
    await expect(page.locator(sel.raceResults)).toContainText('No results yet')
  })
})
