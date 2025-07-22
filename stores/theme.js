export const useThemeStore = defineStore('theme', () => {
  const primaryColor = ref('#6366f1')
  const isDark = ref(false)
  
  const setPrimaryColor = (color) => {
    primaryColor.value = color
    document.documentElement.style.setProperty('--primary-color', color)
  }
  
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }
  
  return {
    primaryColor,
    isDark,
    setPrimaryColor,
    toggleTheme
  }
})