<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import BackButton from './components/BackButton.vue'
dayjs.locale('zh-cn')
const route = useRoute()
</script>

<template>
  <ConfigProvider :locale="zhCN">
    <RouterView />
    <BackButton v-if="route.path !== '/'" />
  </ConfigProvider>
</template>
