<template>
  <header class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
    <!-- Mobile hamburger button -->
    <button
      @click="toggleMobileSidebar"
      class="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
    >
      <Bars3Icon class="w-6 h-6" />
    </button>

    <!-- Empty space on desktop (content is in breadcrumb) -->
    <div class="hidden lg:block"></div>

    <!-- Right side icons -->
    <div class="flex items-center space-x-3">
      <!-- Search -->
      <button
        @click="toggleSearch"
        class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 relative"
      >
        <MagnifyingGlassIcon class="w-5 h-5" />
      </button>

      <!-- Language -->
      <div class="relative">
        <button
          @click="toggleLanguage"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <GlobeAltIcon class="w-5 h-5" />
        </button>
        
        <!-- Language Dropdown -->
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="showLanguage"
            class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
          >
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="selectLanguage(lang)"
              class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <span class="text-lg mr-2">{{ lang.flag }}</span>
              {{ lang.name }}
            </button>
          </div>
        </transition>
      </div>

      <!-- Theme toggle -->
      <button
        @click="toggleTheme"
        class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
      >
        <SunIcon v-if="isDark" class="w-5 h-5" />
        <MoonIcon v-else class="w-5 h-5" />
      </button>

      <!-- Notifications -->
      <div class="relative">
        <button
          @click="toggleNotifications"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 relative"
        >
          <BellIcon class="w-5 h-5" />
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span class="text-xs text-white font-bold">3</span>
          </span>
        </button>

        <!-- Notifications Dropdown -->
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="showNotifications"
            class="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-gray-900 dark:text-white">通知</h3>
            </div>
            <div class="max-h-64 overflow-y-auto">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <p class="text-sm text-gray-900 dark:text-white">{{ notification.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ notification.time }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- User Avatar -->
      <div class="relative">
        <button
          @click="toggleUserMenu"
          class="flex items-center space-x-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <img
            src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff"
            alt="User Avatar"
            class="w-8 h-8 rounded-full"
          />
          <ChevronDownIcon class="w-4 h-4 hidden sm:block" />
        </button>

        <!-- User Dropdown -->
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="showUserMenu"
            class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
          >
            <NuxtLink
              to="/profile"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              @click="closeUserMenu"
            >
              個人資料
            </NuxtLink>
            <NuxtLink
              to="/settings"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              @click="closeUserMenu"
            >
              設定
            </NuxtLink>
            <hr class="my-1 border-gray-200 dark:border-gray-700" />
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              登出
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Search Modal -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showSearch"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
        @click="closeSearch"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4"
          @click.stop
        >
          <div class="p-4">
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="搜尋..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

const sidebarStore = useSidebarStore()
const { toggleMobileSidebar } = sidebarStore

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const showSearch = ref(false)
const showLanguage = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const languages = [
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
]

const notifications = [
  { id: 1, title: '新的系統更新可用', time: '5分鐘前' },
  { id: 2, title: '用戶註冊通知', time: '10分鐘前' },
  { id: 3, title: '每日報告已生成', time: '1小時前' }
]

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const closeSearch = () => {
  showSearch.value = false
  searchQuery.value = ''
}

const toggleLanguage = () => {
  showLanguage.value = !showLanguage.value
  showNotifications.value = false
  showUserMenu.value = false
}

const selectLanguage = (lang) => {
  console.log('Language selected:', lang)
  showLanguage.value = false
}

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showLanguage.value = false
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showLanguage.value = false
  showNotifications.value = false
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const logout = () => {
  console.log('Logout clicked')
  showUserMenu.value = false
}

// Close dropdowns when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showLanguage.value = false
      showNotifications.value = false
      showUserMenu.value = false
    }
  })
})
</script>