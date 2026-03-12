import { expect, test } from '@playwright/test'
import { sel } from '../helpers/selectors'

test.describe('Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays header and footer', async ({ page }) => {
    await expect(page.locator(sel.header)).toBeVisible()
    await expect(page.locator(sel.footer)).toBeVisible()
  })

  test('dark mode toggle works', async ({ page }) => {
    const html = page.locator('html')
    const toggle = page.locator(sel.darkModeToggle)

    const wasDark = await html.evaluate(el => el.classList.contains('app-dark'))
    await toggle.click()
    const isDarkAfter = await html.evaluate(el => el.classList.contains('app-dark'))
    expect(isDarkAfter).toBe(!wasDark)
  })

  test('root / redirects to /horse-game', async ({ page }) => {
    await page.waitForURL('**/horse-game')
    expect(page.url()).toContain('/horse-game')
  })
})
