import { nextTick } from 'vue'

describe('useDarkMode', () => {
  const STORAGE_KEY = 'dark-mode'

  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('app-dark')
    vi.resetModules()
  })

  async function loadComposable() {
    const mod = await import('./useDarkMode')
    return mod.useDarkMode()
  }

  it('defaults to light mode when localStorage is empty', async () => {
    const { isDark } = await loadComposable()
    expect(isDark.value).toBe(false)
  })

  it('initializes as dark when localStorage has "true"', async () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    const { isDark } = await loadComposable()
    expect(isDark.value).toBe(true)
  })

  it('initializes as light when localStorage has "false"', async () => {
    localStorage.setItem(STORAGE_KEY, 'false')
    const { isDark } = await loadComposable()
    expect(isDark.value).toBe(false)
  })

  it('toggles isDark value', async () => {
    const { isDark, toggle } = await loadComposable()
    expect(isDark.value).toBe(false)

    toggle()
    expect(isDark.value).toBe(true)

    toggle()
    expect(isDark.value).toBe(false)
  })

  it('applies app-dark class to documentElement when dark', async () => {
    const { toggle } = await loadComposable()
    await nextTick()

    expect(document.documentElement.classList.contains('app-dark')).toBe(false)

    toggle()
    await nextTick()
    expect(document.documentElement.classList.contains('app-dark')).toBe(true)
  })

  it('removes app-dark class when toggled back to light', async () => {
    const { toggle } = await loadComposable()
    toggle()
    await nextTick()
    expect(document.documentElement.classList.contains('app-dark')).toBe(true)

    toggle()
    await nextTick()
    expect(document.documentElement.classList.contains('app-dark')).toBe(false)
  })

  it('persists dark mode to localStorage', async () => {
    const { toggle } = await loadComposable()
    toggle()
    await nextTick()

    expect(localStorage.getItem(STORAGE_KEY)).toBe('true')
  })

  it('persists light mode to localStorage after toggling back', async () => {
    const { toggle } = await loadComposable()
    toggle()
    await nextTick()
    toggle()
    await nextTick()

    expect(localStorage.getItem(STORAGE_KEY)).toBe('false')
  })
})
