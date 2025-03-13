<template>
  <div class="button-group">
    <div class="home-button" @click="handleHome">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    </div>
    <div class="back-button" @click="handleBack">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path
          fill="currentColor"
          d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.back()
}

const handleHome = () => {
  router.push('/')
}
</script>

<style scoped>
.button-group {
  position: fixed;
  right: 30px;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.back-button,
.home-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #4c4c4a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.back-button:hover,
.home-button:hover {
  background-color: #666;
  transform: scale(1.05);
}
</style>
