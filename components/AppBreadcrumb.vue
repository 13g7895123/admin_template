<template>
  <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Current Page Title -->
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ currentPageTitle }}
        </h1>
        <div class="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
        
        <!-- Breadcrumb Navigation -->
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <NuxtLink
                to="/"
                class="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
              >
                Home
              </NuxtLink>
            </li>
            <li v-for="(item, index) in breadcrumbItems" :key="index" class="flex items-center">
              <ChevronRightIcon class="w-4 h-4 mx-2 text-gray-400" />
              <NuxtLink
                v-if="item.href && index < breadcrumbItems.length - 1"
                :to="item.href"
                class="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
              >
                {{ item.name }}
              </NuxtLink>
              <span
                v-else
                class="text-gray-900 dark:text-white font-medium"
              >
                {{ item.name }}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Optional: Action buttons can go here -->
      <div class="flex items-center space-x-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/24/solid'

const route = useRoute()

const pageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/dashboard/analytics': '分析概覽',
    '/dashboard/crm': 'CRM',
    '/dashboard/ecommerce': 'eCommerce',
    '/settings': 'Settings',
    '/settings/general': '一般設定',
    '/settings/theme': '主題設定', 
    '/settings/users': '用戶管理',
    '/help': 'Help Center',
    '/help/faq': 'FAQ',
    '/help/support': '聯絡支援',
    '/help/docs': '文件'
  }
  return titles[route.path] || '頁面'
})

const currentPageTitle = computed(() => pageTitle.value)

const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(segment => segment)
  const items = []
  
  let currentPath = ''
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += '/' + pathSegments[i]
    
    const segmentTitles = {
      '/dashboard': 'Dashboards',
      '/dashboard/analytics': '分析概覽',
      '/dashboard/crm': 'CRM', 
      '/dashboard/ecommerce': 'eCommerce',
      '/settings': 'Settings',
      '/settings/general': '一般設定',
      '/settings/theme': '主題設定',
      '/settings/users': '用戶管理',
      '/help': 'Help Center',
      '/help/faq': 'FAQ',
      '/help/support': '聯絡支援',
      '/help/docs': '文件'
    }
    
    const title = segmentTitles[currentPath] || pathSegments[i]
    
    items.push({
      name: title,
      href: currentPath
    })
  }
  
  return items
})
</script>