import { getHomeStatusData, type DeviceHistory, type HomeStatusResponseData } from '@/apis'
import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
// import anime from 'animejs'

export const useStore = defineStore('store', () => {
  const route = useRoute()
  const devices = ref([
    { label: 'HE-05', id: 'HE-05', alarmCount: 0, runningHours: 0 },
    { label: 'HE-04', id: 'HE-04', alarmCount: 0, runningHours: 0 },
    { label: 'HE-07', id: 'HE-07', alarmCount: 0, runningHours: 0 },
    { label: 'HE-03', id: 'HE-03', alarmCount: 0, runningHours: 0 },
    { label: 'HE-06', id: 'HE-06', alarmCount: 0, runningHours: 0 },
    { label: 'HE-01', id: 'HE-01', alarmCount: 0, runningHours: 0 }
  ])

  const monitorDevices = ref([
    {
      label: 'Bearing 1# ',
      id: 'bearing1',
      unit: 'mm/s',
      titleShowUnit: true,
      name: '速度',
      value: 0,
      history: '0秒',
      tag: 'bearing'
    },
    {
      label: 'Bearing 2#',
      id: 'bearing2',
      unit: 'mm/s',
      titleShowUnit: true,
      name: '速度',
      value: 0,
      history: '0秒',
      tag: 'bearing2'
    },
    {
      label: 'Main Motor',
      id: 'motor',
      unit: 'mm/s',
      titleShowUnit: true,
      name: '速度',
      value: 0,
      history: '0秒',
      tag: 'motor'
    },
    {
      label: 'Fiywheel',
      id: 'flywheel',
      unit: 'mm/s',
      titleShowUnit: true,
      name: '速度',
      value: 0,
      history: '0秒',
      tag: 'flywheel'
    },
    {
      label: 'Expender',
      id: 'expender',
      unit: '℃',
      titleShowUnit: true,
      name: '温度',
      value: 0,
      history: '0秒',
      tag: 'expender'
    },
    {
      label: '干燥炉温度',
      id: 'dryingOven',
      unit: '℃',
      titleShowUnit: true,
      name: '温度',
      value: 0,
      history: '0秒',
      tag: 'expender2'
    },
    {
      label: 'Leak',
      id: 'leak',
      unit: 'Torr',
      titleShowUnit: false,
      name: '真空度',
      value: 0,
      history: '0秒',
      tag: 'leak'
    },
    {
      label: '干燥炉 风机1#',
      id: 'fan1',
      unit: 'mm/s',
      titleShowUnit: true,
      name: '速度',
      value: 0,
      history: '0秒',
      tag: 'fan'
    },
    {
      label: '干燥炉 风机2#',
      id: 'fan2',
      unit: 'mm/s',
      titleShowUnit: true,
      name: '速度',
      value: 0,
      history: '0秒',
      tag: 'fan2'
    }
  ])

  const currentDevice = computed(() =>
    devices.value.find((item) => item.id === currentDeviceLabel.value)
  )

  const currentDeviceLabel = ref('')

  const currentDeviceId = computed(() => computeDeviceId(currentDeviceLabel.value))

  const dateTime = ref('')
  const dateDay = ref('')
  const dateWeekday = ref('')

  let timer = -1

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

  function calcHistoryText(num: number) {
    const s = num % 60
    const m = Math.ceil(num / 60)
    const h = Math.ceil(num / (60 * 60))
    if (num < 60) {
      return `${s}秒`
    }

    if (num < 60 * 60) {
      return `${m}分`
    }

    return `${h}小时`
  }

  function computeDeviceId(label: string) {
    return label
      .toLocaleLowerCase()
      .split('-')
      .map((item) => item.replace(/^0/, ''))
      .join('')
  }

  function changeDevices(data: HomeStatusResponseData) {
    const list: typeof devices.value = []
    Object.entries(data).forEach(([k, v]) => {
      if (!Array.isArray(v)) {
        list.push({
          label: k,
          id: k,
          alarmCount: v.alarmCount,
          runningHours: v.runningHours
        })
      }
    })
    // list
    devices.value = list
  }

  function changeMonitorDevices(data: DeviceHistory) {
    Object.entries(data).forEach(([k, v]) => {
      const device = monitorDevices.value.find((item) => item.id === k)

      if (device) {
        device.history = calcHistoryText(v[1])
        device.value = v[0]
      }
    })
  }

  function getCurrentDeviceId(label: string) {
    currentDeviceLabel.value = label
    const id = computeDeviceId(label)

    return id
  }

  onMounted(async () => {
    // console.log(2222)
    calcDate()

    if (route.query.deviceId) {
      currentDeviceLabel.value = route.query.deviceId as string
    }
    const res = await getHomeStatusData()
    changeDevices(res)
    timer = window.setInterval(() => {
      calcDate()
    }, 1000)
  })

  onUnmounted(() => {
    window.clearInterval(timer)
  })

  return {
    devices,
    dateDay,
    dateTime,
    dateWeekday,
    monitorDevices,
    currentDeviceId,
    currentDevice,
    changeCurrentDeviceLabel(label: string) {
      currentDeviceLabel.value = label
    },
    changeDevices,
    computeDeviceId,
    changeMonitorDevices
  }
})
