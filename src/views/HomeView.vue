<script setup lang="ts">
import { useStore } from '../stores'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHomeStatusData } from '../apis'

const store = useStore()
const route = useRoute()
const router = useRouter()
const showScreenLineState = ref(false)
const showDetailLineState = ref(false)
const isLoading = ref(false)

const deviceName = computed(
  () => store.devices.find((item) => item.id === route.query.deviceId)?.label
)

function goMomps() {
  router.push({
    path: '/status'
  })
}

function showScreenList() {
  showScreenLineState.value = !showScreenLineState.value
  showDetailLineState.value = false
}

function showDetailList() {
  showDetailLineState.value = !showDetailLineState.value
  showScreenLineState.value = false
}

function goScreen(id: string) {
  if (id === 'HE-05' || id.toLocaleUpperCase() === 'HE05') {
    router.push({
      path: '/center',
      query: {
        lineId: id
      }
    })
  } else {
    router.push({
      path: `/other_center/${id}`,
      query: {
        lineId: id
      }
    })
  }
}

function goDetail(id: string) {
  // const lineName = route.query.deviceId
  router.push({
    path: `/detail/${id}`,
    query: {
      lineId: id
    }
  })
}

onMounted(async () => {
  isLoading.value = true
  const res = await getHomeStatusData().finally(() => {
    isLoading.value = false
  })

  store.changeDevices(res)

  isLoading.value = false

  // console.log(res)
})
</script>

<template>
  <div class="momps-wrapper">
    <div class="momps-title">MOMPS : Machine Operation Multidimensional Perception System</div>
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
        <div>多维度感知</div>
        <div>MOMPS</div>
      </div>
      <div class="menu-item one" @click="goMomps">设备状态检测系统</div>
      <div class="menu-item two">生产情况</div>
      <div class="menu-item three">智能决策平台</div>
      <div class="menu-item four">
        传感器分布
        <div class="menu-item-list">
          <div class="menu-item-list-one">
            <div class="menu-item-list__item" @click="showScreenList">大屏预览</div>
            <div
              class="menu-children__item"
              v-show="showScreenLineState"
              v-for="item in store.devices"
              :key="item.id"
              @click="goScreen(item.id)"
            >
              {{ item.label }}
            </div>
          </div>
          <div>
            <div class="menu-item-list__item" @click="showDetailList">运行情况</div>
            <div
              class="menu-children__item"
              v-show="showDetailLineState"
              v-for="item in store.devices"
              :key="item.id"
              @click="goDetail(item.id)"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
      <div class="menu-item five">数据下载</div>
      <div class="menu-item six">报警数据</div>
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

      > div {
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

      > div {
        &:first-of-type {
          color: #900d10;
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
        color: #900d10;
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
              color: #900d10;
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

  .menu-children__item {
    width: 645px;
    line-height: 50px;
    cursor: pointer;
    padding-left: 30px;
    &:hover {
      color: #900d10;
      background-size: 100% 100%;
      background-image: url('../assets/images/menu-item_bg.png');
    }
  }
}
</style>
