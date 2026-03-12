import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'dark-mode'

const isDark = ref(localStorage.getItem(STORAGE_KEY) === 'true')

export function useDarkMode() {
  function toggle() {
    isDark.value = !isDark.value
  }

  watchEffect(() => {
    document.documentElement.classList.toggle('app-dark', isDark.value)
    localStorage.setItem(STORAGE_KEY, String(isDark.value))
  })

  return { isDark, toggle }
}
