import axios from 'axios'
import { message } from 'ant-design-vue'

export const request = axios.create({
  baseURL: (window as any).customConfig,
  timeout: 2 * 60 * 1000
})

request.interceptors.response.use(
  (response) => {
    // if (response.status)
    return response
  },
  (error) => {
    console.log(error)
    message.error(error.message)
    // if (response)
  }
)

export const getHomeStatusData = async () => {
  const res = await request.get<HomeStatusResponseData>('/status')

  return res.data
}

export const getDeviceData = async (lineId: string) => {
  const res = await request.get<DeviceHistory>(`/line/${lineId}`)

  return res.data
}

export const getDeviceEchartsData = async (
  deviceId: string,
  params: {
    start: number
    end: number
  }
) => {
  const data = new Array(100).fill(0).map(() => Math.random() * 10)

  return { data }
  const res = await request.get(`/sensor/${deviceId}`, {
    params
  })

  return res.data
}

export const getBearing1Data = async (
  featureId: string,
  params: {
    start: number
    end: number
  }
) => {
  const res = await request.get(`/sensor/bearing1_${featureId}`, {
    params
  })

  return res.data
}

export const getBearing2Data = async (
  featureId: string,
  params: {
    start: number
    end: number
  }
) => {
  const res = await request.get(`/sensor/bearing2_${featureId}`, {
    params
  })

  return res.data
}

export const getMotorData = async (
  featureId: string,
  params: {
    start: number
    end: number
  }
) => {
  const res = await request.get(`/sensor/motor_${featureId}`, {
    params
  })

  return res.data
}

export const getFlywheelData = async (
  featureId: string,
  params: {
    start: number
    end: number
  }
) => {
  const res = await request.get(`/sensor/flywheel_${featureId}`, {
    params
  })

  return res.data
}

export type HomeStatusResponseData = {
  'HE-01': HomeStatusData
  'HE-02': HomeStatusData
  'HE-03': HomeStatusData
  'HE-04': HomeStatusData
  'HE-05': HomeStatusData
  'HE-06': HomeStatusData
  alarm: string[]
  emergency: string[]
  warning: string[]
}

export type DeviceHistory = {
  bearing1: [number, number]
  bearing2: [number, number]
  motor: [number, number]
  flywheel: [number, number]
  expender: [number, number]
  dryingOven: [number, number]
  fan1: [number, number]
  fan2: [number, number]
  leak: [number, number]
}

type HomeStatusData = {
  alarmCount: number
  runningHours: number
}
