<script setup lang="ts">
import { useStore } from '../stores'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const store = useStore()
const route = useRoute()
const router = useRouter()

const deviceName = computed(() => store.devices.find(item => item.id === route.query.deviceId)?.label)

function goScreen() {
  router.push({
    path: '/center',
    query: {
      ...route.query
    }
  })
}

function goDetail() {
  router.push({
    path: '/detail',
    query: {
      ...route.query
    }
  })
}


onMounted(() => {
  if (!route.query.deviceId || !store.devices.some(item => item.id === route.query.deviceId)) {
    router.replace('/')
  }
})


</script>

<template>
  <div class="momps-wrapper">
    <div class="momps-title">MOMPS : Machine Operation Multidimensional Perception System </div>
    <div class="momps-time">
      <div class="date-wrapper">
        <div class="day-wrapper">
          {{ store.dateDay }}
        </div>
        <div class="weekday-wrapper">
          {{ store.dateWeekday }}
        </div>
        <div class="datetime-wrapper">{{ store.dateTime }}</div>
      </div>
    </div>
    <div class="momps-container">
      <div class="momps-name">
        <div>{{ deviceName }}</div>
        <div>设备运行</div>
        <div>多维度感知 </div>
        <div>MOMPS</div>
      </div>
      <div class="menu-item one">设备运行诊断 </div>
      <div class="menu-item two">生产情况 </div>
      <div class="menu-item three">智能决策平台 </div>
      <div class="menu-item four">
        传感器分布
        <div class="menu-item-list">
          <div class="menu-item-list__item" @click="goScreen">大屏预览</div>
          <div class="menu-item-list__item" @click="goDetail">运行情况</div>
        </div>
      </div>
      <div class="menu-item five">数据下载 </div>
      <div class="menu-item six">报警数据 </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.momps-wrapper {
  position: relative;
  margin: 0 auto;
  height: 1080px;
  width: 1920px;
  display: flex;
  flex-flow: column nowrap;
  background-image: url('../assets/images/menu_home_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;

  .momps-title {
    position: absolute;
    left: 50%;
    top: 34px;
    transform: translate(-50%, 0);
    font-size: 19px;
    color: #fff;
  }

  .momps-time {
    display: flex;
    margin-left: auto;
    position: absolute;
    right: 320px;
    top: 34px;
    font-size: 18px;
    font-weight: 700;

    .date-wrapper {
      display: flex;
      align-items: center;
      color: #fff;

      >div {
        margin-left: 10px;
      }
    }
  }

  .momps-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('../assets/images/menu_bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;

    .momps-name {
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: 20px;
      transform: translate(0, -50%);
      font-size: 58px;
      line-height: 1.2;
      color: #fff;

      >div {
        &:first-of-type {
          color: #900D10;
        }
      }
    }

    .menu-item {
      position: absolute;
      left: 552px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 36px;
      height: 106px;
      width: 320px;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        color: #900D10;
      }

      &.one {
        top: 166px;
      }

      &.two {
        left: 580px;
        top: 306px;
      }

      &.three {
        left: 640px;
        top: 470px;
      }

      &.four {
        left: 620px;
        top: 610px;

        &:hover {
          .menu-item-list {
            display: block;
          }
        }

        .menu-item-list {
          display: none;
          position: absolute;
          right: 0px;
          top: 50%;
          padding-left: 120px;
          transform: translate(100%, -50%);
          color: #fff;

          &__item {
            font-size: 28px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            padding-left: 30px;
            width: 645px;
            height: 60px;
            background-size: 100% 100%;
            background-image: url('../assets/images/menu-item_bg.png');
            cursor: pointer;

            font-weight: 600;

            &:hover {
              color: #900D10;
            }
          }
        }
      }

      &.five {
        left: 580px;
        top: 770px;
      }

      &.six {
        left: 490px;
        top: 920px;
      }
    }
  }
}
</style>