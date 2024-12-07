import axios from 'axios'
import { message } from 'ant-design-vue'

export const request = axios.create({
  baseURL: (window as any).customConfig,
  headers: {
    'Content-Type': 'application/json'
  },
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
  const res = await request.get<HomeStatusResponseData>('/line_status')

  return res.data
}

export const getDeviceData = async (lineId: string) => {
  const res = await request.get<{ data: DeviceHistory }>(`/admin_index`, {
    params: {
      line_name: lineId
    }
  })

  const data = res.data.data as any

  return {
    dryingOven: data.dryer_t,
    fan1: data.fan1_xv,
    fan2: data.fan2_xv,
    bearing1: data.bear1,
    bearing2: data.bear2,
    ...data
  }
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

export const getBearing1Data = async (params: {
  start_date: string
  end_date: string
  line_name: string
}) => {
  const res = await request.get(`/getBear1`, {
    params
  })

  return res.data.data
}

export const getBearing2Data = async (params: {
  start_date: string
  end_date: string
  line_name: string
}) => {
  const res = await request.get(`/getBear2`, {
    params
  })

  return res.data.data
}

export const getMotorData = async (params: {
  start_date: string
  end_date: string
  line_name: string
}) => {
  const res = await request.get('/getMotor', {
    params
  })

  return res.data.data
}

// 获取风机的数据
export const getFlywheelData = async (params: {
  start_date: string
  end_date: string
  line_name: string
}) => {
  const res = await request.get('/getFly', {
    params
  })

  return res.data.data
}

// getWind1
export const getWind1Data = async (params: {
  start_date: string
  end_date: string
  line_name: string
}) => {
  const res = await request.get('/getWind1', {
    params
  })

  return res.data.data
}

// getWind2
export const getWind2Data = async (params: {
  start_date: string
  end_date: string
  line_name: string
}) => {
  const res = await request.get('/getWind2', {
    params
  })

  return res.data.data
}

// 获取真空度的数据
export const getLeakData = async (params: {
  start_date: string
  end_date: string
  line_name: string
}) => {
  const res = await request.get('/getLeak', {
    params
  })

  return res.data.data
}

// 获取Expender的数据
export const getExpenderData = async (params: {
  start_date: string
  end_date: string
  line_name: string
}) => {
  const res = await request.get('/getExpender', {
    params
  })
  return res.data.data
}

// 获取干燥炉温度数据
export const getDryerData = async (params: {
  start_date: string
  end_date: string
  line_name: string
}) => {
  const res = await request.get('/getDryer', {
    params
  })

  return res.data.data
}

// 获取产线监控大屏的数据信息
export const getLineInfoData = async (lineName: string) => {
  const res = await request.get('/line_info', {
    params: {
      line_name: lineName
    }
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
