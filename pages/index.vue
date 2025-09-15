<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg-custom shadow-sm p-6">
      <div class="flex items-center justify-center space-x-2">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <span class="text-gray-600 dark:text-gray-300">載入數據中...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg-custom p-6">
      <div class="flex items-center">
        <ExclamationTriangleIcon class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
        <span class="text-red-600 dark:text-red-400">{{ error }}</span>
        <button @click="refreshDashboard()" class="ml-4 text-sm text-red-600 hover:text-red-800 underline">
          重試
        </button>
      </div>
    </div>

    <!-- Welcome Section -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg-custom shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            管理儀表板
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            遊戲伺服器推廣平台 - 數據概覽與管理中心
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Period Selector -->
          <select
            v-model="selectedPeriod"
            @change="onPeriodChange"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7 days">過去7天</option>
            <option value="30 days">過去30天</option>
            <option value="90 days">過去90天</option>
          </select>
          <!-- Refresh Button -->
          <button
            @click="refreshDashboard()"
            :disabled="loading"
            class="flex items-center px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
            刷新
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in formattedStats"
        :key="stat.name"
        class="bg-white dark:bg-gray-800 rounded-lg-custom shadow-sm p-6 transition-all hover:shadow-md"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-primary-100 dark:bg-primary-900">
              <component :is="getIcon(stat.icon)" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.name }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
            </div>
          </div>
          <div class="text-right">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                stat.positive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              ]"
            >
              <component
                :is="stat.positive ? 'ArrowUpIcon' : 'ArrowDownIcon'"
                class="w-3 h-3 mr-1"
              />
              {{ stat.growth }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Promotion Trends -->
      <div class="bg-white dark:bg-gray-800 rounded-lg-custom shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            推廣趨勢
          </h3>
          <span class="text-sm text-gray-500 dark:text-gray-400">最近30天</span>
        </div>
        <div class="h-64">
          <LineChart
            v-if="chartData.promotion_trends.labels.length > 0"
            :data="chartData.promotion_trends"
            :options="lineChartOptions"
            :responsive="true"
            class="w-full h-full"
          />
          <div v-else class="h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span class="text-gray-500 dark:text-gray-400">暫無數據</span>
          </div>
        </div>
      </div>

      <!-- Reward Distribution -->
      <div class="bg-white dark:bg-gray-800 rounded-lg-custom shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            獎勵分佈
          </h3>
          <span class="text-sm text-gray-500 dark:text-gray-400">過去7天</span>
        </div>
        <div class="h-64">
          <BarChart
            v-if="chartData.reward_distribution.labels.length > 0"
            :data="chartData.reward_distribution"
            :options="barChartOptions"
            :responsive="true"
            class="w-full h-full"
          />
          <div v-else class="h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span class="text-gray-500 dark:text-gray-400">暫無數據</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activities -->
      <div class="bg-white dark:bg-gray-800 rounded-lg-custom shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            最新活動
          </h3>
          <button class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            查看全部
          </button>
        </div>
        <div class="space-y-4">
          <div
            v-for="activity in recentActivities.slice(0, 5)"
            :key="activity.id"
            class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div class="w-2 h-2 mt-2 bg-primary-500 rounded-full flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white font-medium">{{ activity.title }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ activity.description }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatTime(activity.created_at) }}</p>
            </div>
          </div>
          <div v-if="recentActivities.length === 0" class="text-center py-8">
            <span class="text-gray-500 dark:text-gray-400">暫無最新活動</span>
          </div>
        </div>
      </div>

      <!-- Top Performers -->
      <div class="bg-white dark:bg-gray-800 rounded-lg-custom shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            頂級推廣員
          </h3>
          <button class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            查看排行榜
          </button>
        </div>
        <div class="space-y-3">
          <div
            v-for="(performer, index) in topPerformers.slice(0, 5)"
            :key="performer.id"
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div class="flex-shrink-0">
              <span
                :class="[
                  'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                  index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                  index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                ]"
              >
                {{ index + 1 }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ performer.username || performer.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ performer.conversions }} 次轉換
              </p>
            </div>
            <div class="flex-shrink-0">
              <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {{ formatCurrency(performer.total_rewards || 0) }}
              </span>
            </div>
          </div>
          <div v-if="topPerformers.length === 0" class="text-center py-8">
            <span class="text-gray-500 dark:text-gray-400">暫無數據</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  UsersIcon,
  CurrencyDollarIcon,
  GiftIcon,
  CursorArrowRaysIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline'
import LineChart from '~/components/charts/LineChart.vue'
import BarChart from '~/components/charts/BarChart.vue'

// Composables
const {
  loading,
  error,
  chartData,
  recentActivities,
  topPerformers,
  formattedStats,
  refreshDashboard,
  formatCurrency
} = useDashboard()

// Period selection
const selectedPeriod = ref('30 days')

// Icon components mapping
const iconComponents = {
  UsersIcon,
  CurrencyDollarIcon,
  GiftIcon,
  CursorArrowRaysIcon
}

const getIcon = (iconName) => {
  return iconComponents[iconName] || UsersIcon
}

// Chart options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return value >= 1000 ? (value / 1000) + 'K' : value
        }
      }
    }
  }
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// Methods
const onPeriodChange = () => {
  refreshDashboard({ period: selectedPeriod.value })
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}分鐘前`
  } else if (hours < 24) {
    return `${hours}小時前`
  } else {
    return `${days}天前`
  }
}

// Initialize dashboard data
onMounted(async () => {
  await refreshDashboard({ period: selectedPeriod.value })
})

// Set up auto-refresh every 5 minutes
let refreshInterval
onMounted(() => {
  refreshInterval = setInterval(() => {
    refreshDashboard({ period: selectedPeriod.value })
  }, 5 * 60 * 1000)
})

onBeforeUnmount(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>