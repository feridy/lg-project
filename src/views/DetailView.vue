<script setup lang="ts">
import itemIcon from '../assets/images/home-tip-icon.png'
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
let timer: number
const dateTime = ref('')
const dateWeekday = ref('')
const dateDay = ref('')
const echartsRef = ref<HTMLDivElement | null>(null)
let echartInstance: echarts.ECharts | null = null

function calcDate() {
  const date = new Date()
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')
  const second = `${date.getSeconds()}`.padStart(2, '0')
  const weekday = date.toLocaleDateString('zh-CN', {
    weekday: 'long'
  })
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  dateDay.value = `${year}.${month}.${day}`
  // const day = date.toLocaleDateString('zh-CN', {
  //   month: 'long',
  //   day: 'numeric'
  // })
  dateTime.value = `${hour}:${minute}:${second}`
  // dateDay.value = `${day}`
  dateWeekday.value = `${weekday}`
}

function initChart() {
  if (!echartsRef.value) {
    return
  }
  echartInstance = echarts.init(echartsRef.value)
  echartInstance.on('datazoom', () => {
    echartInstance?.dispatchAction({
      type: "takeGlobalCursor",
      key: "dataZoomSelect",
      dataZoomSelectActive: !1
    })
  });

  echartInstance.setOption({
    color: ["#409EFF"],
    toolbox: {
      show: !1,
      height: 0,
      top: 5,
      right: 60,
      feature: {
        dataZoom: {
          yAxisIndex: "none"
        },
        saveAsImage: {
          pixelRatio: 2,
          backgroundColor: "#1c1c1E"
        }
      },
      itemSize: 18,
      iconStyle: {
        borderColor: "#FFFFFF",
        borderWidth: 1
      }
    },
    dataZoom: [{
      type: "inside",
      show: !0
    }],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      },
      showContent: !0
    },
    xAxis: [{
      type: "category",
      interval: 300,
      min: 0,
      max: 16384,
      axisTick: {
        alignWithLabel: !0,
        lineStyle: {
          color: "#8291A9"
        },
        interval: 100
      },
      axisLabel: {
        color: "#8291A9",
        textStyle: {
          fontSize: 14,
          fontFamily: "PingFangSC"
        }
      },
      axisLine: {
        show: !0,
        lineStyle: {
          color: "rgba(130, 145, 169, 0.25)"
        }
      },
      splitLine: {
        lineStyle: {
          color: "rgba(130, 145, 169, 0.25)"
        }
      },
      axisPointer: {
        lineStyle: {
          color: "#F56C6C"
        },
        label: {
          formatter: function (t: any) {
            return t.seriesData[0].data ? "[x]" + t.value : null
          },
          padding: [5, 14],
          margin: 0,
          backgroundColor: "#409EFF"
        }
      }
    }],
    yAxis: {
      type: "value",
      boundaryGap: ["20%", "20%"],
      splitLine: {
        lineStyle: {
          color: "rgba(130, 145, 169, 0.25)"
        }
      },
      axisLine: {
        show: !0,
        lineStyle: {
          color: "rgba(130, 145, 169, 0.25)"
        }
      },
      axisLabel: {
        inside: !0,
        color: "#8291A9",
        textStyle: {
          fontSize: 14,
          fontFamily: "PingFangSC"
        }
      },
      axisPointer: {
        lineStyle: {
          color: "#F56C6C"
        },
        label: {
          backgroundColor: "#409EFF"
        }
      },
      axisTick: {
        inside: !0
      }
    },
    grid: {
      top: 20,
      bottom: 0,
      left: 0,
      right: 0,
      containLabel: !0
    },
    series: [{
      type: "line",
      symbol: "none",
      itemStyle: {
        color: "#F56C6C"
      },
      xAxisIndex: 0,
      lineStyle: {
        width: 1,
        color: "#409EFF"
      },
      markLine: {
        symbol: "circle",
        label: {
          normal: {
            position: "end",
            formatter: function (t: any) {
              var e = t.name;
              return "" !== e && t.dataIndex,
                e
            },
            textStyle: {
              fontSize: 14,
              fontFamily: "PingFangSC",
              color: "#ffffff"
            }
          }
        },
        data: []
      }
    }]
  })

}

function loadChartData(splitNumber: number, data: {
  dataX: number[],
  dataY: number[]
}, min: number, max: number) {
  const chartData = {
    splitNumber,
    dataX: data.dataX,
    dataY: data.dataY,
    min,
    max,
  }

  const chartMin = (min - min / 4).toFixed(3);
  const chartMax = (max + max / 10).toFixed(3);
  console.log("min:" + min + ";max:" + max + ";chartMin:" + chartMin + ";chartMax:" + chartMax);

  if (echartInstance) {
    const options = echartInstance.getOption();
    (options.xAxis as any)[0].splitNumber = splitNumber;
    (options.xAxis as any)[0].data = data.dataX;
    (options.xAxis as any)[0].max = data.dataX.length;
    (options.yAxis as any)[0].min = min;
    (options.yAxis as any)[0].max = chartMax;
    (options.series as any)[0].data = data.dataY;
    (options.series as any)[0].markLine.data = [];
    echartInstance.clear();
    echartInstance.setOption(options);
  }
}

// function computeYMax(t, e: number, s: number, a: number) {
//   var i = 1.3 * e;
//   return 0 === e ? i = a || 1 : e < 0 ? i = 0 : e > 0 && (i = e + e * s,
//     i < a && (i = a || 1)),
//     Math.ceil(i)
// }

async function loadWaveChart() {
  const res = await fetch(`/api/chanel/getWave?sn=11001.192.168.0.101.1&chanel=0&overall=acc&time=2024-02-21T12:14:19.942Z`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + 'eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE3MTAzMzU1NTEsInN1YiI6IjMzNSIsInJvbGUiOlsiMSJdfQ.Ja1kMqOHfBqesSKQ_s0F07sm_JUUtPEYJOlAjOv-J9XRi44pOfETOORquMGmczeVOd-YJ1IrHtQEAERT8VNPEQ'
    }
  });

  const data = await res.json();

  console.log(data);

  loadChartData(8, { dataX: data.data.datax ?? [], dataY: data.data.datay ?? [] }, data.data.min, data.data.max);
}

onMounted(async () => {
  calcDate()

  timer = window.setInterval(() => {
    calcDate()
  }, 1000)

  initChart()

  loadWaveChart();
})

onUnmounted(() => {
  window.clearInterval(timer)
  echartInstance?.dispose()
})
</script>

<template>
  <div class="detail-wrapper">
    <div class="detail-header">
      <div class="detail-header-left">
        <img class="detail-header-left__icon" :src="itemIcon" />
        <span class="detail-header-left__text">本月运行</span>
        <span class="detail-header-left__strong">3740</span>
        <span class="detail-header-left__text" style="margin-left: 5px;">H</span>
        <span class="detail-header-left__text">24H报警</span>
        <span class="detail-header-left__strong" style="min-width:0px;margin-left: 5px;">3</span>
        <span class="detail-header-left__text" style="margin-left: 5px;">条</span>
      </div>
      <div class="detail-header-center">HE-05 设备运行情况</div>
      <div class="detail-header-right">
        <div class="detail-header-right__time">
          <span class="detail-header-right__time__day">{{ dateDay }}</span>
          <span class="detail-header-right__time__weekday">{{ dateWeekday }}</span>
          <span class="detail-header-right__time__time">{{ dateTime }}</span>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <div class="detail-content-header">
        <div class="detail-content-header__device__one"></div>
        <div class="detail-content-header__device__two"></div>
        <div class="detail-content-header__device__bearing detail-content-header__device">
          <div class="detail-content-header__device__bearing__title">Bearing 1# (mm/s)</div>
          <div class="detail-content-header__device__bearing__content">
            <div class="detail-content-header__device__bearing__content__icon"></div>
            <div class="detail-content-header__device__bearing__content__detail">
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span class="strong">8.85</span>
                <span>mm/s</span>
              </div>
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span>速度</span>
                <span style="margin-left: auto;">28秒前</span>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-content-header__device__bearing2 detail-content-header__device">
          <div class="detail-content-header__device__bearing__title">Bearing 2# (mm/s)</div>
          <div class="detail-content-header__device__bearing__content">
            <div class="detail-content-header__device__bearing__content__icon"></div>
            <div class="detail-content-header__device__bearing__content__detail">
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span class="strong">0.72</span>
                <span>mm/s</span>
              </div>
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span>速度</span>
                <span style="margin-left: auto;">28秒前</span>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-content-header__device__motor detail-content-header__device">
          <div class="detail-content-header__device__bearing__title">Main Motor (mm/s)</div>
          <div class="detail-content-header__device__bearing__content">
            <div class="detail-content-header__device__bearing__content__icon"></div>
            <div class="detail-content-header__device__bearing__content__detail">
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span class="strong">1.55</span>
                <span>mm/s</span>
              </div>
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span>速度</span>
                <span style="margin-left: auto;">28秒前</span>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-content-header__device__flywheel detail-content-header__device">
          <div class="detail-content-header__device__bearing__title">Fiywheel (mm/s)</div>
          <div class="detail-content-header__device__bearing__content">
            <div class="detail-content-header__device__bearing__content__icon"></div>
            <div class="detail-content-header__device__bearing__content__detail">
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span class="strong">12.41</span>
                <span>mm/s</span>
              </div>
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span>速度</span>
                <span style="margin-left: auto;">28秒前</span>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-content-header__device__expender detail-content-header__device">
          <div class="detail-content-header__device__expender__icon"></div>
          <div class="detail-content-header__device__expender__detail">
            <div class="detail-content-header__device__expender__title">Expender （℃）</div>
            <div class="detail-content-header__device__expender__content">
              <div class="detail-content-header__device__expender__content__item">
                <span class="strong">37.1</span>
                <span>℃</span>
              </div>
              <div class="detail-content-header__device__expender__content__item">
                <span>温度</span>
                <span style="margin-left: auto;">19秒前</span>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-content-header__device__expender2 detail-content-header__device">
          <div class="detail-content-header__device__expender__icon"></div>
          <div class="detail-content-header__device__expender__detail">
            <div class="detail-content-header__device__expender__title">干燥炉温度 （℃）</div>
            <div class="detail-content-header__device__expender__content">
              <div class="detail-content-header__device__expender__content__item">
                <span class="strong">37.1</span>
                <span>℃</span>
              </div>
              <div class="detail-content-header__device__expender__content__item">
                <span>温度</span>
                <span style="margin-left: auto;">19秒前</span>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-content-header__device__leak detail-content-header__device">
          <div class="detail-content-header__device__bearing__title">Leak</div>
          <div class="detail-content-header__device__bearing__content">
            <div class="detail-content-header__device__bearing__content__icon"></div>
            <div class="detail-content-header__device__bearing__content__detail">
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span class="strong">0.05</span>
                <span>Torr</span>
              </div>
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span>真空度</span>
                <span style="margin-left: auto;">28秒前</span>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-content-header__device__fan detail-content-header__device">
          <div class="detail-content-header__device__bearing__title">干燥炉 风机1# (mm/s)</div>
          <div class="detail-content-header__device__bearing__content">
            <div class="detail-content-header__device__bearing__content__icon"></div>
            <div class="detail-content-header__device__bearing__content__detail">
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span class="strong">16.92</span>
                <span>mm/s</span>
              </div>
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span>速度</span>
                <span style="margin-left: auto;">28秒前</span>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-content-header__device__fan2 detail-content-header__device">
          <div class="detail-content-header__device__bearing__title">干燥炉 风机2# (mm/s)</div>
          <div class="detail-content-header__device__bearing__content">
            <div class="detail-content-header__device__bearing__content__icon"></div>
            <div class="detail-content-header__device__bearing__content__detail">
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span class="strong">16.92</span>
                <span>mm/s</span>
              </div>
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span>速度</span>
                <span style="margin-left: auto;">28秒前</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-content-echarts">
        <div class="detail-content-echarts__title">
          <span>Bearing 1# (mm/s)</span>
          <span> 11001.192.168.0.101.1TS-RE-V8T</span>
        </div>
        <div class="detail-content-echarts__divide"></div>
        <div class="detail-content-echarts__menus">
          <div class="detail-content-echarts__menus__item">加速度</div>
          <div class="detail-content-echarts__menus__item">速 度</div>
          <div class="detail-content-echarts__menus__item">位 移</div>
          <div class="detail-content-echarts__menus__item">温 度</div>
        </div>
        <div class="detail-content-echarts__content" ref="echartsRef"></div>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.detail-wrapper {
  margin: 0 auto;
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  background-image: url('../assets/images/center-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;

  .detail-header {
    position: relative;
    display: flex;
    width: 100%;
    height: 119px;
    margin: auto;
    background-image: url('../assets/images/detail-header-bg.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    &-left {
      position: absolute;
      left: 40px;
      top: 50%;
      transform: translate(0, -50%);
      display: flex;
      align-items: center;

      &__icon {
        width: 78px;
        height: 53px;
      }

      &__text {
        margin-left: 20px;
        font-size: 22px;
        color: #fff;
      }

      &__strong {
        min-width: 120px;
        font-size: 44px;
        text-align: right;
        color: #fff;
      }
    }

    &-center {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 36px;
      color: #fff;
      font-weight: 600;
      line-height: 1;
    }

    &-right {
      position: absolute;
      right: 40px;
      top: 50%;
      transform: translate(0, -50%);

      &__time {
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 22px;

        &__day {
          margin-right: 10px;
        }

        &__weekday {
          margin-right: 10px;
        }
      }
    }
  }

  .detail-content {
    position: relative;
    flex: 1;

    .detail-content-header {
      position: relative;
      width: 1883px;
      height: 381px;
      margin: 0 auto;
      background-image: url('../assets/images/detail-bg.png');
      background-size: 100% 100%;

      &__device__one {
        position: absolute;
        top: 106px;
        left: 165px;
        width: 341px;
        height: 183px;
        background-image: url('../assets/images/detail-device-one.png');
        background-size: 100% 100%;
      }

      &__device__two {
        position: absolute;
        top: 104px;
        right: 47px;
        width: 1142px;
        height: 220px;
        background-image: url('../assets/images/detail-device-two.png');
        background-size: 100% 100%;
      }

      &__device {
        padding: 10px 22px;
        line-height: 1;
        border-radius: 15px;
        background-color: rgba($color: #474646, $alpha: 0.8);
        color: #fff;
        cursor: pointer;

        &__bearing,
        &__bearing2,
        &__motor,
        &__leak,
        &__fan,
        &__fan2,
        &__flywheel {
          position: absolute;
          left: 98px;
          top: 46px;

          &__title {
            font-size: 17px;
            font-weight: 600;
            text-align: center;
          }

          &__content {
            margin-top: 8px;
            display: flex;
            align-items: center;

            &__icon {
              width: 16px;
              height: 40px;
              background-image: url('../assets/images/detail-bearing-icon.png');
              background-size: 100% 100%;
            }

            &__detail {
              flex: 1;
              margin-left: 12px;
              font-size: 13px;

              &__item {
                display: flex;
                align-items: center;

                &:first-of-type {
                  margin-bottom: 10px;
                }

                >span {
                  &.strong {
                    margin-right: 20px;
                    font-size: 28px;
                    font-weight: 600;
                  }
                }
              }
            }
          }
        }

        &__bearing2 {
          top: initial;
          bottom: 38px;
        }

        &__motor {
          left: 408px;
        }

        &__flywheel {
          left: 408px;
          top: initial;
          bottom: 38px;
        }

        &__leak {
          left: 1310px;
          width: 220px;

          .detail-content-header__device__bearing__title {
            text-align: left;
          }

          .detail-content-header__device__bearing__content__icon {
            width: 21px;
            height: 41px;
            background-image: url('../assets/images/detail-leak-icon.png');
          }
        }

        &__fan {
          left: 865px;
          top: initial;
          bottom: 30px;
        }

        &__fan2 {
          left: 1120px;
          top: initial;
          bottom: 30px;
        }

        &__expender,
        &__expender2 {
          display: flex;
          position: absolute;
          left: 710px;
          top: 46px;
          align-items: center;

          &__icon {
            width: 9px;
            height: 71px;
            background-image: url('../assets/images/detail-expender-icon.png');
            background-size: 100% 100%;
          }

          &__title {
            font-size: 17px;
            font-weight: 600;
            text-align: center;
          }

          &__detail {
            margin-left: 14px;

          }

          &__content {
            margin-top: 10px;

            &__item {
              display: flex;
              align-items: center;

              &:first-of-type {
                margin-bottom: 10px;
              }

              >span {
                &.strong {
                  margin-right: 20px;
                  font-size: 28px;
                  font-weight: 600;
                }
              }
            }
          }
        }

        &__expender2 {
          left: 949px;
        }
      }


    }

    &-echarts {
      margin-top: 30px;

      &__title {
        display: flex;
        line-height: 25px;
        padding: 0 75px;
        color: #C10A0A;
        align-items: center;

        >span {
          font-size: 15px;

          &:first-of-type {
            margin-right: 10px;
            font-size: 28px;
          }
        }
      }

      &__divide {
        margin: auto;
        width: 1903px;
        height: 36px;
        background-image: url('../assets/images/divide.png');
        background-size: 100% 100%;
      }

      &__menus {
        display: flex;
        margin: 0 auto;
        width: 1834px;
        height: 40px;
        line-height: 40px;

        &__item {
          margin: 0 24px;
          font-size: 18px;
          font-weight: 700;
          color: #7D7D7D;
          cursor: pointer;
        }
      }

      &__content {
        margin: 0 auto;
        width: 1800px;
        height: 420px;
      }
    }
  }
}
</style>