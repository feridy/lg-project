<script setup lang="ts">
import itemIcon from '../assets/images/home-tip-icon.png'
import { useStore } from '../stores'
import { useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { getHomeStatusData } from '../apis'
import { Spin } from 'ant-design-vue'

const store = useStore()

const router = useRouter()

const isLoading = ref(false)

const deviceState = ref<{
  alarm: string[],
  emergency: string[],
  warning: string[]
}>({
  alarm: [],
  emergency: [],
  warning: []
})

const waringNum = computed(() => {
  // let num = 0
  const list = new Set([...deviceState.value.alarm, ...deviceState.value.emergency, ...deviceState.value.warning])
  return list.size
})


function onDeviceClick(id: string) {
  router.push({
    path: '/momps',
    query: {
      deviceId: id
    }
  })

  store.changeCurrentDeviceLabel(id)
}

onMounted(async () => {
  isLoading.value = true
  const res = await getHomeStatusData()

  store.changeDevices(res)

  isLoading.value = false

  deviceState.value = {
    alarm: res.alarm,
    emergency: res.emergency,
    warning: res.warning
  }

  // console.log(res)
})

</script>

<template>
  <div class="home">
    <div class="header-wrapper">
      <div class="logo-wrapper">
        <div class="logo"></div>
        <div class="logo-second"></div>
      </div>
      <div class="title-wrapper">LG 设备状态监测系统</div>

      <div class="right-wrapper">
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
    </div>
    <div class="main-wrapper">
      <div class="main-list">
        <div class="main-list-item" :class="{ 'no-allow': item.runningHours <= 0 }" v-for="item in store.devices"
          :key="item.id" @click="onDeviceClick(item.id)">
          <div class="main-list-item__name">{{ item.label }}</div>
          <div class="main-list-item__info">
            <img class="main-list-item__icon" :src="itemIcon" />
            <div class="main-list-item__content">
              <div class="main-list-item__top">本月运行<span>{{ item.runningHours }}</span>H</div>
              <div class="main-list-item__bottom">24H报警<span>{{ item.alarmCount }}</span>条</div>
            </div>
          </div>
        </div>
      </div>
      <div class="main-column">
        <div class="main-column-title">今日告警<span>{{ waringNum }}</span>台</div>
        <div class="main-column-item">
          <div class="main-column-item__img one">
            <span>危险告警</span>
          </div>
          <div class="main-column-item__list">
            <span v-for="(item, index) in deviceState.alarm" :key="index">{{ item }}</span>
            <!-- <span>HE-05 Bearing 1#</span>
            <span>HE-05 Bearing 1#</span> -->
          </div>
        </div>
        <div class="main-column-item">
          <div class="main-column-item__img two">
            <span>报警</span>
          </div>
          <div class="main-column-item__list">
            <span v-for="(item, index) in deviceState.emergency" :key="index">{{ item }}</span>
            <!-- <span>HE-05 Bearing 1#</span>
            <span>HE-05 Bearing 1#</span> -->
          </div>
        </div>
        <div class="main-column-item">
          <div class="main-column-item__img three">
            <span>预警</span>
          </div>
          <div class="main-column-item__list">
            <span v-for="(item, index) in deviceState.warning" :key="index">{{ item }}</span>
            <!-- <span>HE-05 Bearing 1#</span>
            <span>HE-05 Bearing 1#</span> -->
          </div>
        </div>
      </div>

      <div class="loading" v-if="isLoading">
        <Spin />
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.home {
  margin: 0 auto;
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  background-image: url('../assets/images/home-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;

  .header-wrapper {
    position: relative;
    display: flex;
    width: calc(100% - 30px);
    height: 121px;
    margin: auto;
    background-image: url('../assets/images/header-bg.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    .logo-wrapper {
      position: absolute;
      left: 30px;
      top: 10px;
      display: flex;
      height: 27px;
      justify-content: center;
      align-items: center;

      .logo {
        width: 27px;
        height: 27px;
        background-image: url('../assets/images/logo.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }

      .logo-second {
        margin-left: 10px;
        width: 137px;
        height: 17px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../assets/images/logo-name.png');
      }

    }

    .title-wrapper {
      position: absolute;
      left: 51%;
      top: 50%;
      text-align: center;
      transform: translate(-50%, -50%);
      width: 495px;
      font-size: 34px;
      font-weight: 600;
      color: #ffffff;
      /* background: linear-gradient(0deg, #b9cfff 0%, #ffffff 99.0478515625%);
      background-clip: text;
      -webkit-text-fill-color: transparent; */
    }

    .right-wrapper {
      display: flex;
      margin-left: auto;
      position: absolute;
      right: 120px;
      top: 10px;
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

  }

  .main-wrapper {
    position: relative;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;

    .main-list {
      display: flex;
      flex-wrap: wrap;
      width: 1050px;

      &-item {
        margin-right: 20px;
        margin-bottom: 10px;
        padding: 0px 25px;
        width: 500px;
        height: 195px;
        cursor: pointer;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../assets/images/box-bg.png');

        &.no-allow {
          pointer-events: none;
          filter: grayscale(0.9);
        }

        &__name {
          padding-top: 20px;
          margin-bottom: 20px;
          color: #fff;
          line-height: 40px;
          font-size: 34px;
          transition: all .3s ease;
        }

        &__info {
          display: flex;
          align-items: center;
          width: 100%;
        }

        &__icon {
          margin-right: 30px;
          width: 135px;
          height: 95px;
        }

        &__content {
          color: #fff;
          font-size: 22px;
          flex: 1;

          >div {
            display: flex;
            padding-right: 30px;
            line-height: 40px;
            align-items: center;

            &:first-of-type {
              transform: translateY(-25px);
            }

            &:last-of-type {
              transform: translateY(-15px);
            }

            span {
              margin-left: auto;
              margin-right: 5px;
              font-size: 44px;
              font-weight: 700;
            }
          }


        }

        &:hover {
          .main-list-item__name {
            color: #F30808;
          }
        }
      }
    }

    .main-column {
      padding: 24px;
      width: 373px;
      height: 608px;
      color: #fff;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-image: url('../assets/images/column-bg.png');

      &-title {
        display: flex;
        font-size: 32px;
        line-height: 30px;
        margin-bottom: 20px;

        >span {
          width: 80px;
          font-size: 40px;
          font-weight: 600;
          text-align: right;
        }
      }

      &-item {
        margin-bottom: 90px;
        display: flex;
        align-items: center;

        &__img {
          position: relative;
          font-size: 15px;
          color: #FFFFFF;

          >span {
            position: absolute;
            top: 3px;
            left: 50%;
            transform: translate(-50%, 0);
          }

          width: 135px;
          height: 105px;
          background-size: cover;
          background-position: center;

          &.one {
            background-image: url('../assets/images/column_one-icon.png');
          }

          &.two {
            background-image: url('../assets/images/column_two-icon.png');
          }

          &.three {
            background-image: url('../assets/images/column_three-icon.png');
          }
        }

        &__list {
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          margin-left: 16px;
          height: 105px;
          font-size: 17px;
          line-height: 20px;
          color: #fff;
          /* overflow-y: auto; */
        }
      }


    }
  }

  .loading {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba($color: #000000, $alpha: 0.3);
  }
}
</style>