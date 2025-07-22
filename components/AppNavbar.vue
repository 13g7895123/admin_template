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
          <span 
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
          >
            {{ unreadCount > 99 ? '99+' : unreadCount }}
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
            class="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('notifications.title') }}</h3>
              <div class="flex items-center space-x-2">
                <button
                  @click="markAllAsRead"
                  class="text-xs text-primary-500 hover:text-primary-600 transition-colors duration-200"
                >
                  {{ t('notifications.mark_all_read') }}
                </button>
              </div>
            </div>
            <div class="max-h-80 overflow-y-auto">
              <div
                v-for="notification in recentNotifications"
                :key="notification.id"
                class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                :class="{ 'bg-blue-50 dark:bg-blue-900/20': !notification.read }"
                @click="markAsRead(notification.id)"
              >
                <div class="flex items-start space-x-3">
                  <div 
                    class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    :class="{
                      'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400': notification.priority === 'high',
                      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400': notification.priority === 'medium',
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': notification.priority === 'low'
                    }"
                  >
                    <component :is="getNotificationIcon(notification.icon)" class="w-4 h-4" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ typeof notification.title === 'string' && notification.title.includes('.') ? t(notification.title) : notification.title }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ notification.message }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ notificationsStore.getTimeAgo(notification.time) }}</p>
                  </div>
                  <div class="flex-shrink-0">
                    <div
                      v-if="!notification.read"
                      class="w-2 h-2 bg-primary-500 rounded-full"
                    ></div>
                  </div>
                </div>
              </div>
              <div
                v-if="recentNotifications.length === 0"
                class="p-8 text-center text-gray-500 dark:text-gray-400"
              >
                {{ t('notifications.no_notifications') }}
              </div>
            </div>
            <div class="p-3 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="clearReadNotifications"
                class="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                {{ t('notifications.clear_all') }}
              </button>
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
              {{ t('common.profile') }}
            </NuxtLink>
            <NuxtLink
              to="/settings"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              @click="closeUserMenu"
            >
              {{ t('common.settings') }}
            </NuxtLink>
            <hr class="my-1 border-gray-200 dark:border-gray-700" />
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {{ t('common.logout') }}
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
              :placeholder="t('common.search') + '...'"
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
  ChevronDownIcon,
  ExclamationCircleIcon,
  UserPlusIcon,
  DocumentTextIcon,
  ShieldExclamationIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon
} from '@heroicons/vue/24/outline'

const { t, locale, locales } = useI18n()
const sidebarStore = useSidebarStore()
const { toggleMobileSidebar } = sidebarStore

const notificationsStore = useNotificationsStore()
const { recentNotifications, unreadCount, markAsRead, markAllAsRead, clearReadNotifications } = notificationsStore

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const showSearch = ref(false)
const showLanguage = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const languages = computed(() => locales.value)

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
  locale.value = lang.code
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

const getNotificationIcon = (iconName) => {
  const iconComponents = {
    ExclamationCircleIcon,
    UserPlusIcon,
    DocumentTextIcon,
    ShieldExclamationIcon,
    InformationCircleIcon,
    WrenchScrewdriverIcon
  }
  return iconComponents[iconName] || InformationCircleIcon
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
  
  // Start real-time notifications simulation
  notificationsStore.simulateRealTimeNotifications()
})
</script>