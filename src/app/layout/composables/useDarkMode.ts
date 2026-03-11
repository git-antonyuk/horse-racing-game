import { ref, watchEffect } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  function toggle() {
    isDark.value = !isDark.value
  }

  watchEffect(() => {
    document.documentElement.classList.toggle('app-dark', isDark.value)
  })

  return { isDark, toggle }
}
