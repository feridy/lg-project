<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue'
import * as echarts from 'echarts'
import anime from 'animejs'
import axios from 'axios'

const sevenRef = ref<HTMLDivElement>()

let sevenEcharts: echarts.ECharts | null = null
// const twoEcharts: echarts.ECharts | null = null
// const threeEcharts: echarts.ECharts | null = null
// const fiveEcharts: echarts.ECharts | null = null

// 弧度与100%进度的转换
const pre = 100 / 180

const fivePre = 23

let timeId = -1

const tradeNo = ref('')

const upHValue = ref(0)
const upHTargetValue = ref(0)
const nowValue = ref(0)
const planValue = ref(0)
const rateValue = ref(0)
const operationRateValue = ref(0)
const operationTOrT = ref(0)
const dateTime = ref('')
const dateWeekday = ref('')
const dateDay = ref('')
const bearingOneValue = ref(0)
const bearingTwoValue = ref(0)
const motorValue = ref(0)
const fiyWheelValue = ref(0)
const twoYouWenOneValue = ref(0)
const twoYouBingDianJiaValue = ref(0)
const threeYouWenOneValue = ref(0)
const threeYouBingDianJiaValue = ref(0)
const fourGanZhaoValue = ref(0)
const fourFengJiOneValue = ref(0)
const fourFengJiTwoValue = ref(0)
const fourKongQiChuiXiValue = ref(0)
const fiveKuoGuangValue = ref(0)
const sixChongDanOneValue = ref(0)
const sixChongDanTwoValue = ref(0)

//'running'|'warning'|'error'|'idle'
const states = reactive({
  pressState: 'idle',
  airPurgeState: 'idle',
  autoWeldingState: 'idle',
  dryingOvenState: 'idle',
  flarePipeState: 'idle',
  nitrogenFillingStateFirst: 'idle',
  nitrogenFillingStateSecond: 'idle',
  vacuumLeakState: 'idle'
})

const vacuumOneValue = ref(0)
const vacuumTwoValue = ref(0)

const upHRateValue = ref(0)

const bearingOnePre = computed(() => {
  return bearingOneValue.value / pre - 6
})

const bearingTwoPre = computed(() => {
  return bearingTwoValue.value / pre - 6
})
const motorPre = computed(() => {
  return motorValue.value / pre - 6
})
const fiyWheelPre = computed(() => {
  return fiyWheelValue.value / pre - 6
})
const fiveValue = computed(() => {
  if (fiveKuoGuangValue.value < 10) {
    return (fiveKuoGuangValue.value / 10) * fivePre - fivePre
  }

  return (fiveKuoGuangValue.value / 10 - 1) * fivePre
})
const fourFengJiOneDeg = computed(() => {
  return fourFengJiOneValue.value / pre - 6
})
const fourFengJiTwoDeg = computed(() => {
  return fourFengJiTwoValue.value / pre - 6
})
const fourGanZhaoDeg = computed(() => {
  return fourGanZhaoValue.value - 60
})
const fourKongQiChuiXiDeg = computed(() => {
  return (fourKongQiChuiXiValue.value - 0.15) * (260 / 1)
})
const sixChongDanOneDeg = computed(() => {
  return (sixChongDanOneValue.value - 0.15) * (260 / 1)
})
const sixChongDanTwoDeg = computed(() => {
  return (sixChongDanTwoValue.value - 0.15) * (260 / 1)
})
const twoYouBingDianJiaDeg = computed(() => {
  return twoYouBingDianJiaValue.value / pre - 6
})
const twoYouWenOneDeg = computed(() => {
  return twoYouWenOneValue.value * (234 / 100)
})
const threeYouWenOneDeg = computed(() => {
  return threeYouWenOneValue.value * (234 / 100)
})
const threeYouBingDianJiaDeg = computed(() => {
  return threeYouBingDianJiaValue.value / pre - 6
})

const achivement = {
  UPH: 0,
  UPHRate: 0,
  UPHTarget: 0,
  now: 0,
  plan: 0,
  rate: 0,
  'T/T': 0,
  operationRate: 0,
  bearing1: 0,
  bearing2: 0,
  fiyWheel: 0,
  motor: 0,
  vacuum1: 0,
  vacuum2: 0,
  airPurgePressure: 0,
  firstOilTemperature: 0,
  firstPumpVibration: 0,
  secondOilTemperature: 0,
  secondPumpVibration: 0,
  dryingOvenTemperature: 0,
  dryingOvenVibrationFan1: 0,
  dryingOvenVibrationFan2: 0,
  nitrogenFillingFirst: 0,
  nitrogenFillingSecond: 0,
  autoWeldingCirculatingWaterTemperature: 0
}

function getTradeNo() {
  const t = new Date(),
    e = t.getFullYear()
  let s = t.getMonth() + 1,
    a = t.getDate(),
    i = t.getHours(),
    o = t.getMinutes(),
    n = t.getSeconds()
  String(s).length < 2 && (s = Number('0' + s)),
    String(a).length < 2 && (a = Number('0' + a)),
    String(i).length < 2 && (i = Number('0' + i)),
    String(o).length < 2 && (o = Number('0' + o)),
    String(n).length < 2 && (n = Number('0' + n))
  const r = `${e}${s}${a}${i}${o}${n}`
  tradeNo.value = r + '_' + Math.random().toString(36).substr(2, 9)
}

function calcDate() {
  const date = new Date()
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')
  const second = `${date.getSeconds()}`.padStart(2, '0')
  const weekday = date.toLocaleDateString('zh-CN', {
    weekday: 'long'
  })
  const day = date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric'
  })
  dateTime.value = `${hour}:${minute}:${second}`
  dateDay.value = `${day}`
  dateWeekday.value = `${weekday}`
}
let dataFirst: any[] = []
let dataSecond: any[] = []

async function getData() {
  if ((window as any).customConfig?.api) {
    try {
      const res = await axios.get((window as any).customConfig?.api ?? '/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (res.status !== 200) {
        throw new Error('请求失败')
      }

      const data = res.data

      const dataFirstTemp: [number, number][] = []

      const dataSecondTemp: [number, number][] = []

      if (data.vacuumLeakTesting.vacuum1) {
        data.vacuumLeakTesting.vacuum1.forEach((item: number, index: number) => {
          if (item > 0.1) {
            dataFirstTemp.push([index, item / 100])
          } else {
            dataFirstTemp.push([index, item])
          }
        })

        // console.log(dataFirst[dataFirst.length - 1][1])
        if (dataFirstTemp.length) vacuumOneValue.value = dataFirstTemp[dataFirstTemp.length - 1][1]
      }

      if (data.vacuumLeakTesting.vacuum2) {
        data.vacuumLeakTesting.vacuum2.forEach((item: number, index: number) => {
          if (item > 0.1) {
            dataSecondTemp.push([index, item / 100])
          } else {
            dataSecondTemp.push([index, item])
          }
        })

        // console.log(dataSecond);
        if (dataSecondTemp.length)
          vacuumTwoValue.value = dataSecondTemp[dataSecondTemp.length - 1][1]
      }

      anime({
        targets: achivement,
        ...data.achivement,
        ...data.state,
        ...data.equipments.Press.Vibration,
        vacuum2: dataSecond.length ? dataSecond[dataSecond.length - 1][1] : 0,
        vacuum1: dataFirst.length ? dataFirst[dataFirst.length - 1][1] : 0,
        nitrogenFillingFirst: data.equipments.nitrogenFilling.first.pressure,
        nitrogenFillingSecond: data.equipments.nitrogenFilling.second.pressure,
        airPurgePressure: data.equipments.airPurge.Pressure,
        firstOilTemperature: data.equipments.firstFlarePipe.oil.temperature,
        firstPumpVibration: data.equipments.firstFlarePipe.pump.Vibration,
        secondOilTemperature: data.equipments.secondFlarePipe.oil.temperature,
        secondPumpVibration: data.equipments.secondFlarePipe.pump.Vibration,
        dryingOvenTemperature: data.equipments.dryingOven.Temperature,
        dryingOvenVibrationFan1: data.equipments.dryingOven.Vibration.fan1,
        dryingOvenVibrationFan2: data.equipments.dryingOven.Vibration.fan2,
        autoWeldingCirculatingWaterTemperature:
          data.equipments.autoWelding.circulatingWater.temperature,
        round: 100,
        easing: 'linear',
        update: function () {
          upHRateValue.value = achivement.UPHRate
          upHValue.value = achivement.UPH
          upHTargetValue.value = achivement.UPHTarget
          planValue.value = achivement.plan
          nowValue.value = achivement.now
          rateValue.value = achivement.rate
          operationRateValue.value = achivement.operationRate
          operationTOrT.value = achivement['T/T']
          bearingOneValue.value = achivement.bearing1
          bearingTwoValue.value = achivement.bearing2
          motorValue.value = achivement.motor
          fiyWheelValue.value = achivement.fiyWheel
          twoYouWenOneValue.value = achivement.firstOilTemperature
          twoYouBingDianJiaValue.value = achivement.firstPumpVibration
          threeYouWenOneValue.value = achivement.secondOilTemperature
          threeYouBingDianJiaValue.value = achivement.secondPumpVibration
          fourFengJiOneValue.value = achivement.dryingOvenVibrationFan1
          fourFengJiTwoValue.value = achivement.dryingOvenVibrationFan2
          fourGanZhaoValue.value = achivement.dryingOvenTemperature
          fourKongQiChuiXiValue.value = achivement.airPurgePressure
          fiveKuoGuangValue.value = achivement.autoWeldingCirculatingWaterTemperature
          sixChongDanOneValue.value = achivement.nitrogenFillingFirst
          sixChongDanTwoValue.value = achivement.nitrogenFillingSecond

          vacuumOneValue.value = achivement.vacuum1
          vacuumTwoValue.value = achivement.vacuum2
        }
      })

      if (
        dataFirst.length !== dataFirstTemp.length ||
        dataSecond.length !== dataSecondTemp.length
      ) {
        dataFirst = dataFirstTemp
        dataSecond = dataSecondTemp
        sevenEcharts?.setOption({
          series: [
            {
              data: [
                [0, 0.019],
                [120, 0.019]
              ]
            },
            {
              data: [
                [0, 0.035],
                [120, 0.035]
              ]
            },
            {
              data: dataFirst
            },
            {
              data: [
                [0, 0.019],
                [120, 0.019]
              ]
            },
            {
              data: [
                [0, 0.035],
                [120, 0.035]
              ]
            },
            {
              data: dataSecond
            }
          ]
        })
      }

      states.airPurgeState = data.equipments.airPurge.state
      states.dryingOvenState = data.equipments.dryingOven.state
      states.nitrogenFillingStateFirst = data.equipments.nitrogenFilling.first.state
      states.nitrogenFillingStateSecond = data.equipments.nitrogenFilling.second.state
      states.vacuumLeakState = data.vacuumLeakTesting.state
      states.pressState = data.equipments.Press.state
      states.flarePipeState =
        data.equipments.firstFlarePipe.state === data.equipments.secondFlarePipe.state
          ? data.equipments.firstFlarePipe.state
          : data.equipments.firstFlarePipe.state !== 'running'
            ? data.equipments.firstFlarePipe.state
            : data.equipments.secondFlarePipe.state

      // bearingOneValue.value = data.equipments.Press.Vibration.bearing1;
    } catch (error) {
      error
    }
  }

  window.setTimeout(() => {
    getData()
  }, 1000)
}

onMounted(async () => {
  const seven = sevenRef.value

  if (seven) {
    sevenEcharts = echarts.init(seven)
    sevenEcharts.setOption({
      title: [
        {
          top: '1%',
          left: 'center',
          text: '真空度1 (Torr )',
          textStyle: {
            color: '#fff'
          }
        },
        {
          top: '50%',
          left: 'center',
          text: '真空度2 (Torr )',
          textStyle: {
            color: '#fff'
          }
        }
      ],
      xAxis: [
        {
          axisTick: {
            show: true,
            alignWithLabel: true
          },
          axisLine: {
            onZero: false
          },
          axisLabel: {
            color: '#C9C9C9'
          },
          max: 120,
          min: 0,
          boundaryGap: false,
          splitLine: {
            show: false
          },
          interval: 30,
          type: 'value'
        },
        {
          axisTick: {
            show: true,
            alignWithLabel: true
          },
          axisLine: {
            onZero: false
          },
          axisLabel: {
            color: '#C9C9C9'
          },
          max: 120,
          min: 0,
          boundaryGap: false,
          splitLine: {
            show: false
          },
          interval: 30,
          type: 'value',
          gridIndex: 1
        }
      ],
      yAxis: [
        {
          show: true,
          minInterval: 0,
          maxInterval: 0.1,
          splitLine: {
            show: false
          },
          interval: 0.001,
          position: 'left',
          axisLabel: {
            show: true,
            formatter: (value: any) => {
              // console.log(value, index)
              if (value === 0.019) {
                return value
              }
              if (value === 0.035) {
                return value
              }
              if (value === 0.05) {
                return value
              }
              if (value === 0.08) {
                return value
              }
              if (value === 0.1) {
                return value
              }

              return ''
            },
            color: '#C9C9C9'
          },
          min: 0,
          max: 0.1001,
          axisLine: {
            show: true
            // onZero: false,
          },
          type: 'value',
          axisTick: {
            show: false,
            alignWithLabel: true
          }
        },
        {
          show: true,
          minInterval: 0,
          maxInterval: 0.1,
          gridIndex: 1,
          splitLine: {
            show: false
          },
          interval: 0.001,
          position: 'left',
          axisLabel: {
            show: true,
            formatter: (value: any) => {
              // console.log(value, index)
              if (value === 0.019) {
                return value
              }
              if (value === 0.035) {
                return value
              }
              if (value === 0.05) {
                return value
              }
              if (value === 0.08) {
                return value
              }
              if (value === 0.1) {
                return value
              }

              return ''
            },
            color: '#C9C9C9'
          },
          min: 0,
          max: 0.1001,
          axisLine: {
            show: true
            // onZero: false,
          },
          type: 'value',
          axisTick: {
            show: false,
            alignWithLabel: true
          }
        }
      ],
      grid: [
        {
          bottom: '55%',
          top: '8%',
          left: '18%',
          right: '5%'
        },
        {
          bottom: '8%',
          top: '55%',
          left: '18%',
          right: '5%'
        }
      ],
      tooltip: {
        trigger: 'axis'
      },
      autoResize: true,
      series: [
        {
          type: 'line',
          showSymbol: false,
          itemStyle: {
            color: '#00FF00'
          },
          data: [
            [0, 0.019],
            [120, 0.019]
          ]
        },
        {
          type: 'line',
          showSymbol: false,
          itemStyle: {
            color: '#FF0000'
          },
          data: [
            [0, 0.035],
            [120, 0.035]
          ]
        },
        {
          type: 'line',
          showSymbol: false,
          itemStyle: {
            color: '#EACA0C'
          }
          // data: [[0, 0]],
          // data: [[0, 0], [1, 0.01], [2, 0.035], [3, 0.03], [4, 0.019]],
        },
        {
          type: 'line',
          showSymbol: false,
          itemStyle: {
            color: '#00FF00'
          },
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: [
            [0, 0.019],
            [120, 0.019]
          ]
        },
        {
          type: 'line',
          showSymbol: false,
          itemStyle: {
            color: '#FF0000'
          },
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: [
            [0, 0.035],
            [120, 0.035]
          ]
        },
        {
          type: 'line',
          showSymbol: false,
          itemStyle: {
            color: '#EACA0C'
          },
          xAxisIndex: 1,
          yAxisIndex: 1
          // data: [[0, 0]],
          // data: [[0, 0], [1, 0.01], [2, 0.035], [3, 0.03], [4, 0.019]],
        }
      ]
    })
  }

  getTradeNo()

  calcDate()

  timeId = window.setInterval(() => {
    calcDate()
  }, 1000)

  try {
    await getData()
  } catch (error) {
    error
    // console.log(error)
  }
})
onUnmounted(() => {
  sevenEcharts?.dispose()
  sevenEcharts = null
  window.clearInterval(timeId)

  console.log('onUnmounted')
})
</script>

<template>
  <div class="center-wrapper">
    <div class="header-wrapper">
      <div class="logo-wrapper">
        <div class="logo"></div>
        <div class="logo-tag">
          <span>LG</span>
          <span>Electronics</span>
        </div>
      </div>
      <div class="title-wrapper">HE-05 设备运行诊断 控制中心</div>
      <div class="right-wrapper">
        <div class="date-wrapper">
          <div class="day-wrapper">
            {{ dateDay }}
          </div>
          <div class="weekday-wrapper">
            {{ dateWeekday }}
          </div>
          <div class="datetime-wrapper">{{ dateTime }}</div>
        </div>
      </div>
      <div class="status-wrapper">
        <div><span class="status normal"></span> 正常</div>
        <div><span class="status warning"></span> 异常</div>
        <div><span class="status error"></span> 报警</div>
        <div><span class="status no-line"></span> 数据断开</div>
        <!-- <div><span class="status no-data"></span> 准备保养</div> -->
      </div>
    </div>
    <div class="num-wrapper">
      <div class="one-wrapper">
        <div class="one-header">生产达成</div>
        <div class="one-main">
          <div class="uph">
            <span>{{ upHTargetValue }}</span>
            <span>UPH目标</span>
          </div>
          <div class="uph">
            <span>{{ upHValue }}</span>
            <span>UPH实际</span>
          </div>
          <div class="uph">
            <span>{{ upHRateValue }}%</span>
            <span>达成率</span>
          </div>
          <div class="uph">
            <span>{{ planValue }}</span>
            <span>计划数量</span>
          </div>
          <div class="uph">
            <span>{{ nowValue }}</span>
            <span>实际达成</span>
          </div>
          <div class="uph">
            <span>{{ rateValue }}%</span>
            <span>达成率</span>
          </div>
        </div>
      </div>
      <div class="two-wrapper">
        <div class="two-header">设备运行</div>
        <div class="two-main">
          <div class="two-item">
            <span>设备运转率</span>
            <span>{{ operationRateValue }}%</span>
          </div>
          <div class="two-item">
            <span>设备 T / T</span>
            <span>{{ operationTOrT }}</span>
          </div>
        </div>
      </div>
      <div class="three-wrapper">
        <div class="three-header">CTP 管理</div>
        <div class="three-main">
          <div class="three-item">
            <span>干燥炉温度</span>
            <span :class="{
              normal: states.dryingOvenState === 'running',
              warning: states.dryingOvenState === 'warning',
              error: states.dryingOvenState === 'error',
              'no-line': states.dryingOvenState === 'idle'
            }">
              <span style="font-family: 'custom_font'; font-weight: 800">{{
                fourGanZhaoValue
              }}</span>°C
            </span>
          </div>
          <div class="three-item">
            <span>空气吹洗</span>
            <span :class="{
                  normal: states.airPurgeState === 'running',
                  warning: states.airPurgeState === 'warning',
                  error: states.airPurgeState === 'error',
                  'no-line': states.airPurgeState === 'idle'
                }"><span style="font-family: 'custom_font'; font-weight: 800">{{
      fourKongQiChuiXiValue
    }}</span>Mpa</span>
          </div>
          <div class="three-item">
            <span>一次充氮</span>
            <span :class="{
                  normal: states.nitrogenFillingStateFirst === 'running',
                  warning: states.nitrogenFillingStateFirst === 'warning',
                  error: states.nitrogenFillingStateFirst === 'error',
                  'no-line': states.nitrogenFillingStateFirst === 'idle'
                }"><span style="font-family: 'custom_font'; font-weight: 800">{{
      sixChongDanOneValue
    }}</span>Mpa</span>
          </div>
          <div class="three-item">
            <span>设备真空度(Torr)</span>
            <span class="no" style="font-family: 'custom_font'">
              1#{{ vacuumOneValue.toFixed(2) }}/2#{{ vacuumTwoValue.toFixed(2) }}
            </span>
          </div>
          <div></div>
          <div></div>
          <div class="three-item">
            <span>二次充氮</span>
            <span :class="{
              normal: states.nitrogenFillingStateSecond === 'running',
              warning: states.nitrogenFillingStateSecond === 'warning',
              error: states.nitrogenFillingStateSecond === 'error',
              'no-line': states.nitrogenFillingStateSecond === 'idle'
            }"><span style="font-family: 'custom_font'">{{ sixChongDanTwoValue }}</span>Mpa</span>
          </div>
        </div>
      </div>
    </div>
    <div class="show-wrapper">
      <div class="pass-tag">
        Press
        <span class="status" :class="{
          normal: states.pressState === 'running',
          warning: states.pressState === 'warning',
          error: states.pressState === 'error',
          'no-line': states.pressState === 'idle'
        }"></span>
      </div>
      <div class="expender">
        扩管机
        <span class="status" :class="{
          normal: states.flarePipeState === 'running',
          warning: states.flarePipeState === 'warning',
          error: states.flarePipeState === 'error',
          'no-line': states.flarePipeState === 'idle'
        }"></span>
      </div>
      <div>
        干燥炉
        <span class="status" :class="{
          normal: states.dryingOvenState === 'running',
          warning: states.dryingOvenState === 'warning',
          error: states.dryingOvenState === 'error',
          'no-line': states.dryingOvenState === 'idle'
        }"></span>
      </div>
      <div>
        空气吹洗
        <span class="status" :class="{
          normal: states.airPurgeState === 'running',
          warning: states.airPurgeState === 'warning',
          error: states.airPurgeState === 'error',
          'no-line': states.airPurgeState === 'idle'
        }"></span>
      </div>
      <div>
        1次充氮
        <span class="status" :class="{
          normal: states.nitrogenFillingStateFirst === 'running',
          warning: states.nitrogenFillingStateFirst === 'warning',
          error: states.nitrogenFillingStateFirst === 'error',
          'no-line': states.nitrogenFillingStateFirst === 'idle'
        }"></span>
      </div>
      <div>
        自动焊接
        <span class="status" :class="{
          normal: states.autoWeldingState === 'running',
          warning: states.autoWeldingState === 'warning',
          error: states.autoWeldingState === 'error'
        }"></span>
      </div>
      <div>
        2次充氮
        <span class="status" :class="{
          normal: states.nitrogenFillingStateSecond === 'running',
          warning: states.nitrogenFillingStateSecond === 'warning',
          error: states.nitrogenFillingStateSecond === 'error',
          'no-line': states.nitrogenFillingStateSecond === 'idle'
        }"></span>
      </div>
      <div>
        真空验漏 1#2#
        <span class="status" :class="{
          normal: states.vacuumLeakState === 'running',
          warning: states.vacuumLeakState === 'warning',
          error: states.vacuumLeakState === 'error',
          'no-line': states.vacuumLeakState === 'idle'
        }"></span>
      </div>
    </div>
    <div class="bottom-wrapper">
      <div class="main-wrapper">
        <div class="main-header">
          <div class="title-item">Press</div>
          <div class="title-item">1次扩管</div>
          <div class="title-item">2次扩管</div>
          <div class="title-item">干燥炉</div>
          <div class="title-item">自动焊接</div>
          <div class="title-item">充氮</div>
          <div class="title-item">真空验漏</div>
          <div class="header-divide"></div>
        </div>
        <div class="main-content">
          <div class="main-one">
            <div class="main-title">
              <span>振动速度</span>
              <span>单位：mm/s</span>
            </div>
            <div class="bearing_1">
              <div class="pointer" :style="`transform: rotate(${bearingOnePre}deg)`"></div>
              <div class="show-num">{{ bearingOneValue }}</div>
              <div class="title-wrapper">Bearing 1 #</div>
            </div>
            <div class="bearing_2">
              <div class="pointer" :style="`transform: rotate(${bearingTwoPre}deg)`"></div>
              <div class="show-num">{{ bearingTwoValue }}</div>
              <div class="title-wrapper">Bearing 2 #</div>
            </div>
            <div class="motor">
              <div class="pointer" :style="`transform: rotate(${motorPre}deg)`"></div>
              <div class="show-num">{{ motorValue }}</div>
              <div class="title-wrapper">Motor</div>
            </div>
            <div class="fiy_wheel">
              <div class="pointer" :style="`transform: rotate(${fiyWheelPre}deg)`"></div>
              <div class="show-num">{{ fiyWheelValue }}</div>
              <div class="title-wrapper">Flywheel</div>
            </div>
          </div>
          <div class="main-two">
            <div class="main-title one">
              <span>油温</span>
              <span>单位：°C</span>
            </div>
            <div class="main-title">
              <span>振动速度</span>
              <span>单位：mm/s</span>
            </div>
            <!-- <div class="two-content" ref="twoRef"></div> -->
            <div class="two-item one">
              <div class="two-item-progress"></div>
              <div class="two-item-pointer" :style="`transform: rotate(${twoYouWenOneDeg}deg);`"></div>
              <div class="two-item-num" style="font-family: custom_font">
                {{ twoYouWenOneValue }}°C
              </div>
              <div class="two-item-bottom">
                <span>上限: 60°C</span>
                <span>运行: {{ twoYouWenOneValue }}°C</span>
              </div>
            </div>
            <div class="two-item two">
              <div class="pointer" :style="`transform: rotate(${twoYouBingDianJiaDeg}deg)`"></div>
              <div class="show-num">{{ twoYouBingDianJiaValue }}</div>
              <div class="title-wrapper">油泵电机</div>
            </div>
          </div>
          <div class="main-three">
            <div class="main-title one">
              <span>油温</span>
              <span>单位：°C</span>
            </div>
            <div class="main-title">
              <span>振动速度</span>
              <span>单位：mm/s</span>
            </div>
            <div class="three-item one">
              <div class="three-item-progress"></div>
              <div class="three-item-pointer" :style="`transform: rotate(${threeYouWenOneDeg}deg);`"></div>
              <div class="three-item-num" style="font-family: custom_font">
                {{ threeYouWenOneValue }}°C
              </div>
              <div class="three-item-bottom">
                <span>上限: 60°C</span>
                <span>运行: {{ threeYouWenOneValue }}°C</span>
              </div>
            </div>
            <div class="three-item two">
              <div class="pointer" :style="`transform: rotate(${threeYouBingDianJiaDeg}deg)`"></div>
              <div class="show-num">{{ threeYouBingDianJiaValue }}</div>
              <div class="title-wrapper">油泵电机</div>
            </div>
          </div>
          <div class="main-four">
            <div class="main-title">
              <span>振动速度</span>
              <span>单位：mm/s</span>
            </div>
            <div class="four_item one">
              <div class="pointer" :style="`transform: rotate(${fourFengJiOneDeg}deg)`"></div>
              <div class="show-num">{{ fourFengJiOneValue }}</div>
              <div class="title-wrapper">风机1#</div>
            </div>
            <div class="four_item two">
              <div class="pointer" :style="`transform: rotate(${fourFengJiTwoDeg}deg)`"></div>
              <div class="show-num">{{ fourFengJiTwoValue }}</div>
              <div class="title-wrapper">风机2#</div>
            </div>
            <div class="four_item three">
              <div class="four-title">
                <span>温度</span>
                <span>单位：°C</span>
              </div>
              <div class="pointer" :style="`transform: rotate(${fourGanZhaoDeg}deg)`"></div>
              <div class="show-num">{{ fourGanZhaoValue }}°C</div>
              <div class="title-wrapper">干燥炉温度</div>
            </div>
            <div class="four_item four">
              <div class="four-title">
                <span>压力</span>
                <span>单位：MPa</span>
              </div>
              <div class="pointer" :style="`transform: rotate(${fourKongQiChuiXiDeg}deg)`"></div>
              <div class="show-num">
                {{ fourKongQiChuiXiValue }}<span style="font-family: sans-serif">MPA</span>
              </div>
              <div class="title-wrapper">空气吹洗</div>
            </div>
          </div>
          <div class="main-five">
            <div class="main-title">
              <span>温度</span>
              <span>单位：°C</span>
            </div>
            <div class="five-title">水温</div>
            <div class="five-main">
              <div class="pointer-wrapper" :style="`transform: rotate(${fiveValue}deg)`">
                <div class="pointer-main"></div>
              </div>
              <div class="five-num" style="font-family: custom_font">{{ fiveKuoGuangValue }}°C</div>
            </div>
            <!-- <div class="five-content" ref="fiveRef"></div> -->
            <div class="tip-one">
              <span>上限: 60°C</span>
              <span>运行: {{ fiveKuoGuangValue }}°C</span>
            </div>
          </div>
          <div class="main-six">
            <div class="main-title">
              <span>压力</span>
              <span>单位：MPa</span>
            </div>
            <div class="six_item one">
              <div class="pointer" :style="`transform: rotate(${sixChongDanOneDeg}deg)`"></div>
              <div class="show-num">
                {{ sixChongDanOneValue }}<span style="font-family: sans-serif">MPA</span>
              </div>
              <div class="title-wrapper">1次 充氮</div>
            </div>
            <div class="six_item two">
              <div class="pointer" :style="`transform: rotate(${sixChongDanTwoDeg}deg)`"></div>
              <div class="show-num">
                {{ sixChongDanTwoValue }}<span style="font-family: sans-serif">MPA</span>
              </div>
              <div class="title-wrapper">2次 充氮</div>
            </div>
          </div>
          <div ref="sevenRef" class="main-seven"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.center-wrapper {
  margin: 0 auto;
  height: 100%;
  width: 100%;
  background-image: url('../assets/images/center-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;

  .header-wrapper {
    position: relative;
    padding-top: 20px;
    display: flex;
    width: calc(100% - 30px);
    height: 121px;
    margin: auto;
    background-image: url('../assets/images/header-bg.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    .logo-wrapper {
      margin-left: 40px;
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

      .logo-tag {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 6px;
        font-size: 28px;
        font-weight: 800;
        color: #fff;
        line-height: 27px;
        font-family: 'Microsoft YaHei', sans-serif;

        >span {
          margin: 0 3px;
        }
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

      .date-wrapper {
        display: flex;
        align-items: center;
        color: #fff;

        >div {
          margin-left: 10px;
        }
      }
    }

    .status-wrapper {
      position: absolute;
      bottom: 20px;
      right: 20px;
      display: flex;
      align-items: center;

      >div {
        font-size: 16px;
        display: flex;
        align-items: center;
        color: #f3f4fb;

        >span {
          margin-right: 10px;
        }
      }
    }
  }

  .num-wrapper {
    display: flex;
    padding: 0 100px;

    .one-wrapper {
      width: 430px;

      .one-header {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 42px;
        font-size: 22px;
        color: #ffffff;
        font-weight: 600;
        /* background-image: url('../assets/images/bg_num.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center; */
        background: linear-gradient(90deg,
            rgba(66, 5, 15, 0) 0%,
            rgba(143, 16, 16, 0.99) 47%,
            rgba(66, 5, 15, 0) 100%);
      }

      .one-main {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 10px 10px;
        margin-top: 10px;

        .uph {
          width: 136px;
          height: 79px;
          background-image: url('../assets/images/bg_uph.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;

          &>span {
            line-height: 1.2;

            &:first-child {
              font-family: 'custom_font';
              font-size: 34px;
              font-weight: bold;
              color: #ffffff;
            }

            &:last-child {
              font-size: 15px;
              color: #e0e5ee;
            }
          }
        }
      }
    }

    .two-wrapper {
      width: 419px;
      margin: 0 auto;

      .two-header {
        margin-bottom: 10px;
        width: 419px;
        height: 42px;
        font-size: 22px;
        color: #ffffff;
        font-weight: 600;
        background: linear-gradient(90deg,
            rgba(66, 5, 15, 0) 0%,
            rgba(143, 16, 16, 0.99) 47%,
            rgba(66, 5, 15, 0) 100%);
        /* background-image: url('../assets/images/bg_two.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover; */
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .two-main {
        padding: 0 15px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .two-item {
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          width: 184px;
          height: 76px;
          background-image: url('../assets/images/two-item-bg.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;

          &>span {
            height: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;

            &:first-child {
              color: #fff;
              font-size: 19px;
            }

            &:last-child {
              display: flex;
              align-items: center;
              color: #fff;
              font-size: 25px;
              font-weight: 600;
              font-family: 'custom_font';

              &::after {
                margin-left: 12px;
                width: 13px;
                height: 13px;
                border-radius: 50%;
                content: '';
              }

              &.normal {
                &::after {
                  background-color: #00ff00;
                }
              }

              &.warning {
                &::after {
                  background-color: #fff100;
                }
              }

              &.error {
                &::after {
                  background-color: #ff0000;
                }
              }

              &.on-line {
                &::after {
                  background-color: #eeeeee;
                }
              }
            }
          }
        }
      }
    }

    .three-wrapper {
      .three-header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        width: 419px;
        height: 42px;
        font-size: 22px;
        color: #ffffff;
        font-weight: 600;
        background: linear-gradient(90deg,
            rgba(66, 5, 15, 0) 0%,
            rgba(143, 16, 16, 0.99) 47%,
            rgba(66, 5, 15, 0) 100%);
        /* background-image: url('../assets/images/bg_num.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center; */
      }

      .three-main {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 10px 10px;
        margin-top: 10px;

        .three-item {
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          width: 184px;
          height: 76px;
          background-image: url('../assets/images/two-item-bg.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;

          &>span {
            height: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;

            &:first-child {
              color: #fff;
              font-size: 19px;
            }

            &:last-child {
              display: flex;
              align-items: center;
              color: #fff;
              font-size: 25px;
              font-weight: 600;
              line-height: 1;

              >span {
                &:first-child {
                  margin-right: 4px;
                  font-weight: 800;
                }
              }

              &::after {
                margin-left: 12px;
                width: 13px;
                height: 13px;
                border-radius: 50%;
                content: '';
              }

              &.no {
                font-size: 23px;

                &::after {
                  display: none;
                }
              }

              &.normal {
                &::after {
                  background-color: #00ff00;
                }
              }

              &.warning {
                &::after {
                  background-color: #fff100;
                }
              }

              &.error {
                &::after {
                  background-color: #ff0000;
                }
              }

              &.no-line {
                &::after {
                  background-color: #eeeeee;
                }
              }
            }
          }
        }
      }
    }
  }

  .show-wrapper {
    margin: 20px auto 0;
    position: relative;
    width: 1669px;
    height: 191px;
    background-image: url('../assets/images/line-bg.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;

    >div {
      position: absolute;
      display: flex;
      align-items: center;
      font-size: 19px;
      font-weight: 600;
      color: #fff;

      &:nth-child(3) {
        top: 0;
        left: 706px;
      }

      &:nth-child(4) {
        top: 0;
        left: 824px;
      }

      &:nth-child(5) {
        top: 0;
        left: 940px;
      }

      &:nth-child(6) {
        top: 0;
        left: 1048px;
      }

      &:nth-child(7) {
        top: 0;
        left: 1173px;
      }

      &:nth-child(8) {
        top: 0;
        left: 1291px;
      }
    }

    .expender {
      position: absolute;
      top: 0;
      left: 517px;
    }
  }

  .bottom-wrapper {
    display: flex;
    justify-content: center;
  }

  .main-wrapper {
    margin-top: 0px;
    margin-left: auto;
    margin-right: auto;
    /* display: inline-block; */
    /* width: 90%; */
    height: 487px;
    background: #20201e;
    border: 1px solid #4c4c4a;
    border-radius: 8px;
    padding: 6px 15px;

    .main-header {
      position: relative;
      display: flex;
      height: 46px;

      .title-item {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        height: 100%;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-color: RGBA(52, 50, 48, 0.8);
        border-radius: 4px;
        border: 1px solid #34322c;
        margin: 0 2px;

        &:nth-child(1) {
          width: 298px;
        }

        &:nth-child(2) {
          width: 183px;
        }

        &:nth-child(3) {
          width: 183px;
        }

        &:nth-child(4) {
          width: 314px;
        }

        &:nth-child(5) {
          width: 202px;
        }

        &:nth-child(6) {
          width: 202px;
        }

        &:nth-child(7) {
          width: 294px;
        }
      }

      .header-divide {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        width: 1624px;
        height: 11px;
        /* background: linear-gradient(0deg, rgba(0, 156, 255, 0.97) 3%, rgba(0, 174, 255, 0) 100%); */
        opacity: 0.5;
      }
    }

    .main-content {
      display: flex;
      margin-top: 4px;

      >div {
        margin: 0 2px;
      }

      .main-one {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        width: 300px;
        height: 429px;
        padding-top: 60px;
        border: 1px solid #4c4c4a;
        border-radius: 8px;

        .main-title {
          position: absolute;
          top: 30px;
          left: 0;
          width: 100%;
          display: flex;
          padding: 0 20px;
          color: #fff;
          font-size: 16px;
          justify-content: space-between;

          >span {
            &:nth-child(1) {
              margin-left: 20px;
            }

            &:nth-child(2) {
              margin-right: 10px;
            }
          }
        }

        .motor {
          margin-top: auto;
          /* margin-top: -22px; */
          margin-bottom: 50px;
        }

        .fiy_wheel {
          margin-top: auto;
          /* margin-top: -22px; */
          margin-bottom: 50px;
        }
      }

      .main-two {
        display: flex;
        flex-flow: column;
        align-items: center;
        position: relative;
        width: 183px;
        height: 429px;
        border: 1px solid #4c4c4a;
        border-radius: 8px;
        padding-top: 60px;

        .main-title {
          position: absolute;
          top: 30px;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-around;
          color: #fff;
          font-size: 16px;
          padding: 0 9px;
          justify-content: space-between;

          &.one {
            top: 230px;
            padding: 0 30px;
          }
        }

        .two-item {
          position: relative;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center;

          &.one {
            width: 136px;
            height: 120px;
            background-image: url('../assets/images/two-one.png');
            order: 1;
            margin-top: auto;
            margin-bottom: 50px;

            .two-item-num {
              position: absolute;
              font-size: 15px;
              color: #fff;
              bottom: 18px;
              left: 50%;
              transform: translateX(-50%);
              font-weight: 600;
              line-height: 1;
            }

            .two-item-pointer {
              position: absolute;
              left: 37px;
              top: 46px;
              width: 36px;
              height: 37px;
              /* border: 1px solid red; */
              transform-origin: 30px 30px;

              &::after {
                content: '';
                display: flex;
                width: 100%;
                height: 100%;
                transform: rotate(-70deg);
                transform-origin: 30px 30px;
                background-image: url('../assets/images/two-pointer.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position: center;
              }
            }

            .two-item-progress {
              position: absolute;
              top: 32px;
              left: 22px;
              width: 91px;
              height: 66px;
              /* background-image: url("../assets/images/two-progress.png"); */
              background-size: 100% 100%;
              background-repeat: no-repeat;
              background-position: center;
            }

            .two-item-bottom {
              position: absolute;
              bottom: -8px;
              left: 50%;
              transform: translate(-50%, 100%);
              white-space: nowrap;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 14px;
              color: #ffffff;

              >span {
                &:last-child {
                  margin-left: 10px;
                }
              }
            }
          }

          &.two {
            position: relative;
            margin-left: 8px;
            margin-right: 8px;
            /* margin-top: 40px; */
            /* margin-bottom: 40px; */
            width: 132px;
            height: 107px;
            background-image: url('../assets/images/bearing_1.png');
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;

            .show-num {
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translate(-50%, -80%);
              color: #ffffff;
              font-size: 15px;
              font-weight: 600;
            }

            .title-wrapper {
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translate(-50%, 100%);
              color: #ffffff;
              font-size: 15px;
              font-weight: 600;
              width: 100%;
              text-align: center;
            }
          }
        }
      }

      .main-three {
        display: flex;
        flex-flow: column;
        justify-content: space-around;
        align-items: center;
        position: relative;
        width: 183px;
        height: 429px;
        /* background-color: #000; */
        border: 1px solid #4c4c4a;
        border-radius: 8px;
        padding-top: 60px;
        pointer-events: none;

        .main-title {
          position: absolute;
          top: 30px;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-around;
          color: #fff;
          font-size: 16px;
          padding: 0 9px;
          justify-content: space-between;

          &.one {
            top: 230px;
            padding: 0 30px;
          }
        }

        .three-item {
          position: relative;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center;

          &.one {
            width: 136px;
            height: 120px;
            background-image: url('../assets/images/two-one.png');
            order: 1;
            margin-top: auto;
            margin-bottom: 50px;

            .three-item-num {
              position: absolute;
              font-size: 15px;
              color: #fff;
              bottom: 18px;
              left: 50%;
              transform: translateX(-50%);
              font-weight: 600;
              line-height: 1;
            }

            .three-item-pointer {
              position: absolute;
              left: 37px;
              top: 46px;
              width: 36px;
              height: 37px;
              /* border: 1px solid red; */
              transform-origin: 30px 30px;

              &::after {
                content: '';
                display: flex;
                width: 100%;
                height: 100%;
                transform: rotate(-70deg);
                transform-origin: 30px 30px;
                background-image: url('../assets/images/two-pointer.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position: center;
              }
            }

            .three-item-progress {
              position: absolute;
              top: 32px;
              left: 22px;
              width: 91px;
              height: 66px;
              /* background-image: url("../assets/images/two-progress.png"); */
              background-size: 100% 100%;
              background-repeat: no-repeat;
              background-position: center;
            }

            .three-item-bottom {
              position: absolute;
              bottom: -8px;
              left: 50%;
              transform: translate(-50%, 100%);
              white-space: nowrap;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 14px;
              color: #ffffff;

              >span {
                &:last-child {
                  margin-left: 10px;
                }
              }
            }
          }

          &.two {
            position: relative;
            margin-left: 8px;
            margin-right: 8px;
            /* margin-top: 40px; */
            /* margin-bottom: 40px; */
            width: 132px;
            height: 107px;
            background-image: url('../assets/images/bearing_1.png');
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;

            .show-num {
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translate(-50%, -80%);
              color: #ffffff;
              font-size: 15px;
              font-weight: 600;
            }

            .title-wrapper {
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translate(-50%, 100%);
              color: #ffffff;
              font-size: 15px;
              font-weight: 600;
              width: 100%;
              text-align: center;
            }
          }
        }
      }

      .main-four {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        width: 320px;
        height: 429px;
        /* background-color: #000; */
        border: 1px solid #4c4c4a;
        border-radius: 8px;
        padding-top: 60px;

        .main-title {
          position: absolute;
          top: 30px;
          left: 0;
          width: 100%;
          display: flex;
          padding: 0 20px;
          color: #fff;
          font-size: 16px;
          justify-content: space-between;

          >span {
            &:nth-child(1) {
              margin-left: 20px;
            }

            &:nth-child(2) {
              margin-right: 10px;
            }
          }
        }

        .four_item {
          .show-num {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, -80%);
            color: #ffffff;
            font-size: 15px;
            font-weight: 600;
          }

          .title-wrapper {
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translate(-50%, 100%);
            color: #ffffff;
            font-size: 15px;
            font-weight: 600;
            width: 100%;
            text-align: center;
          }

          &.two,
          &.one {
            position: relative;
            margin-left: 12px;
            margin-right: 12px;
            width: 132px;
            height: 107px;
            background-image: url('../assets/images/bearing_1.png');
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
          }

          &.three {
            position: relative;
            width: 139px;
            height: 132px;
            margin-left: 12px;
            margin-right: 12px;
            background-image: url('../assets/images/four_1.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;
            margin-top: auto;
            margin-bottom: 40px;

            .four-title {
              position: absolute;
              top: -30px;
              left: 50%;
              display: flex;
              white-space: nowrap;
              justify-content: space-between;
              color: #fff;
              font-size: 16px;
              transform: translateX(-50%);

              >span {
                &:last-child {
                  margin-left: 20px;
                }
              }
            }

            .title-wrapper {
              bottom: -2px;
            }

            .show-num {
              font-size: 14px;
              bottom: -15px;
            }

            .pointer {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 38px;
              height: 33px;
              margin-top: -30px;
              margin-left: -38px;
              transform: rotate(-60deg);
              /* transition: all 0.3s ease-in-out; */
              /* border: 1px solid red; */
              transform-origin: bottom right;
              background: transparent;

              &::after {
                position: absolute;
                width: 100%;
                height: 100%;
                content: '';
                transform: translate(120%, 0) rotate(-140deg);
                transform-origin: bottom left;
                background-image: url('../assets/images/four_1_pointer.png');
                background-size: 100% 100%;
              }
            }
          }

          &.four {
            position: relative;
            width: 137.3px;
            height: 124.3px;
            background-image: url('../assets/images/four_2.png');
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            margin-top: auto;
            margin-bottom: 40px;

            .four-title {
              position: absolute;
              top: -38px;
              left: 50%;
              display: flex;
              white-space: nowrap;
              justify-content: space-between;
              color: #fff;
              font-size: 16px;
              transform: translateX(-50%);

              >span {
                &:last-child {
                  margin-left: 20px;
                }
              }
            }

            .title-wrapper {
              bottom: -2px;
            }

            .show-num {
              position: absolute;
              bottom: 12px;
              display: flex;
              flex-flow: column;
              transform: translate(-50%, 0px);
              line-height: 1;
              align-items: center;
              justify-content: center;

              >span {
                font-weight: 600;
                color: #deff9f;
              }
            }

            .pointer {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 3.5px;
              height: 38.8px;
              margin-left: -2.75px;
              margin-top: -40px;
              /* transition: all 0.3s ease-in-out; */
              /* border: 1px solid red; */
              transform-origin: bottom right;
              background: transparent;

              &::after {
                position: absolute;
                width: 100%;
                height: 100%;
                content: '';
                transform: translate(0px, 0px) rotate(-90deg);
                transform-origin: bottom right;
                background-image: url('../assets/images/four_2_pointer.png');
                background-size: 100% 100%;
                background-position: center;
                background-repeat: no-repeat;
              }
            }
          }
        }
      }

      .main-five {
        position: relative;
        width: 202px;
        height: 429px;
        /* background-color: #000; */
        border: 1px solid #4c4c4a;
        border-radius: 8px;

        .main-title {
          position: absolute;
          top: 30px;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-around;
          color: #fff;
          font-size: 16px;
          padding: 0 20px;
          justify-content: space-between;
        }

        .five-title {
          position: absolute;
          left: 50%;
          top: 20%;
          transform: translate(-50%, -50%);
          color: #fff;
          font-size: 18px;
          font-weight: 600;
        }

        .five-main {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 168px;
          height: 165px;
          background-image: url('../assets/images/five-main.png');
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;

          .pointer-wrapper {
            position: absolute;
            top: 26px;
            left: 27px;
            transform: rotate(0deg);
            transform-origin: bottom right;
            /* background-color: rgba(0, 156, 255, 0.97); */

            .pointer-main {
              width: 57px;
              height: 60px;
              background-image: url('../assets/images/five-pointer.png');
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center;
              opacity: 0.8;
              transform-origin: bottom right;
              transform: rotate(-50deg);
            }
          }

          .five-num {
            position: absolute;
            top: 80px;
            left: 58px;
            z-index: 2;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            line-height: 1;
          }
        }

        .five-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .tip-one {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          top: 80%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 14px;
          color: #ffffff;
          width: 100%;

          >span {
            &:last-child {
              margin-left: 10px;
            }
          }
        }

        .tip-two {
          top: initial;
          bottom: -5px;
        }
      }

      .main-six {
        display: flex;
        flex-wrap: wrap;
        position: relative;

        width: 202px;
        height: 429px;
        /* background-color: #000; */
        border: 1px solid #4c4c4a;
        border-radius: 8px;
        padding-top: 60px;

        .main-title {
          position: absolute;
          top: 30px;
          left: 0;
          width: 100%;
          display: flex;
          padding: 0 30px;
          color: #fff;
          font-size: 16px;
          justify-content: space-between;
        }

        .six_item {
          position: relative;
          margin-left: auto;
          margin-right: auto;
          width: 137.3px;
          height: 124.3px;
          background-image: url('../assets/images/four_2.png');
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;

          &.one {
            margin-top: 20px;
          }

          &.two {
            margin-top: auto;
            margin-bottom: 40px;
          }

          .show-num {
            position: absolute;
            bottom: 12px;
            display: flex;
            flex-flow: column;
            transform: translate(-50%, 0px);
            line-height: 1;
            align-items: center;
            justify-content: center;

            >span {
              font-weight: 600;
              color: #deff9f;
            }
          }

          .pointer {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 3.5px;
            height: 38.8px;
            margin-left: -2.75px;
            margin-top: -40px;
            /* transition: all 0.3s ease-in-out; */
            /* border: 1px solid red; */
            transform-origin: bottom right;
            background: transparent;

            &::after {
              position: absolute;
              width: 100%;
              height: 100%;
              content: '';
              transform: translate(0px, 0px) rotate(-90deg);
              transform-origin: bottom right;
              background-image: url('../assets/images/four_2_pointer.png');
              background-size: 100% 100%;
              background-position: center;
              background-repeat: no-repeat;
            }
          }

          .title-wrapper {
            bottom: 0px;
            top: initial;
            transform: translate(-50%, 100%);
          }
        }
      }

      .main-seven {
        width: 294px;
        height: 429px;
        /* background-color: #000; */
        border: 1px solid #4c4c4a;
        border-radius: 8px;
      }
    }
  }

  .bearing_1,
  .bearing_2,
  .motor,
  .fiy_wheel,
  .six_item {
    position: relative;
    margin-left: 8px;
    margin-right: 8px;
    width: 132px;
    height: 107px;
    background-image: url('../assets/images/bearing_1.png');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;

    .show-num {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, -80%);
      color: #ffffff;
      font-size: 15px;
      font-weight: 600;
    }

    .title-wrapper {
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translate(-50%, 100%);
      color: #ffffff;
      font-size: 15px;
      font-weight: 600;
      width: 100%;
      text-align: center;
    }
  }

  .six_item {
    .title-wrapper {
      top: -20px;
      bottom: initial;
      transform: translate(-50%, -100%);
    }
  }

  .motor,
  .fiy_wheel {
    margin-top: 0px;
    margin-bottom: 0;
  }

  .pointer {
    position: absolute;
    width: 66px;
    height: 9px;
    top: 53%;
    left: 10px;
    transform-origin: 55px 8px;
    transform: rotate(-6deg);
    background-image: url('../assets/images/pointer.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
  }

  .show-num {
    font-family: 'custom_font';
  }

  .status {
    margin-left: 10px;
    width: 13px;
    height: 13px;
    border-radius: 50%;

    &.normal {
      background-color: #00ff00;
    }

    &.warning {
      background-color: #fff100;
    }

    &.error {
      background-color: #ff0000;
    }

    &.no-line {
      background-color: #eeeeee;
    }

    &.no-data {
      background-image: url('../');
    }
  }
}
</style>
