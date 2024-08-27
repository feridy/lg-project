import { MockMethod, MockConfig } from 'vite-plugin-mock'
import Mock from 'mockjs'
console.log('qqq')

export default function (config: MockConfig) {
  return [
    {
      url: '/api/status',
      method: 'get',
      rawResponse: async (req, res) => {
        let reqbody = ''
        // console.log(req)
        // res.setHeader('Content-Type', 'text/plain')
        res.statusCode = 200
        res.end(
          JSON.stringify([
            { label: 'HE-05', id: 'HE-05', alarmCount: 0, runningHours: 0 },
            { label: 'HE-04', id: 'HE-04', alarmCount: 0, runningHours: 0 },
            { label: 'HE-07', id: 'HE-07', alarmCount: 0, runningHours: 0 },
            { label: 'HE-03', id: 'HE-03', alarmCount: 0, runningHours: 0 },
            { label: 'HE-06', id: 'HE-06', alarmCount: 0, runningHours: 0 },
            { label: 'HE-01', id: 'HE-01', alarmCount: 0, runningHours: 0 }
          ])
        )
      }
    },
    {
      url: '/api/getBear1',
      method: 'get',
      rawResponse: async (req, res) => {
        let reqbody = ''

        // res.setHeader('Content-Type', 'text/plain')
        res.statusCode = 200
        // {
        //    "xyz_id": 1,
        // "device_name": "bear1",
        // "type_index": "X11",
        // "speed_x": "1",
        // "displacement_x": "1",
        // "acceleration_x": "1",
        // "speed_y": "1",
        // "displacement_y": "1",
        // "acceleration_y": "1",
        // "temperature": "1",
        // "speed_z": "1",
        // "displacement_z": "1",
        // "acceleration_z": "1",
        // "time": "2024-02-01"
        // }
        const data = Mock.mock({
          'data|1-7': [
            {
              time: '@date()',
              speed_x: '@integer(1, 10)',
              speed_y: '@integer(1, 10)',
              speed_z: '@integer(1, 10)',
              displacement_x: '@integer(1, 10)',
              displacement_y: '@integer(1, 10)',
              displacement_z: '@integer(1, 10)',
              temperature: '@integer(1, 10)',
              acceleration_x: '@integer(1, 10)',
              acceleration_y: '@integer(1, 10)',
              acceleration_z: '@integer(1, 10)'
            }
          ]
        })
        // console.log(data)
        res.end(JSON.stringify(data.data))
      }
    } as MockMethod
  ]
}
