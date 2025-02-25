import { MockMethod, MockConfig } from 'vite-plugin-mock'
import Mock from 'mockjs'

export default function (config: MockConfig) {
  return [
    {
      url: '/api/line_status',
      method: 'get',
      rawResponse: async (req, res) => {
        res.statusCode = 200
        res.end(
          JSON.stringify({
            'HE-01': {
              alarmCount: Mock.Random.integer(0, 5),
              runningHours: Mock.Random.integer(1000, 5000)
            },
            'HE-02': {
              alarmCount: Mock.Random.integer(0, 5),
              runningHours: Mock.Random.integer(1000, 5000)
            },
            'HE-03': {
              alarmCount: Mock.Random.integer(0, 5),
              runningHours: Mock.Random.integer(1000, 5000)
            },
            'HE-04': {
              alarmCount: Mock.Random.integer(0, 5),
              runningHours: Mock.Random.integer(1000, 5000)
            },
            'HE-05': {
              alarmCount: Mock.Random.integer(0, 5),
              runningHours: Mock.Random.integer(1000, 5000)
            },
            'HE-06': {
              alarmCount: Mock.Random.integer(0, 5),
              runningHours: Mock.Random.integer(1000, 5000)
            },

            alarm: ['HE-05 Bearing 1#', 'HE-03 Bearing 2#'],
            emergency: ['HE-04 Bearing 1#', 'HE-07 Bearing 3#'],
            warning: ['HE-01 Bearing 2#', 'HE-06 Bearing 1#']
          })
        )
      }
    },
    {
      url: '/api/getBear1',
      method: 'get',
      rawResponse: async (req, res) => {
        res.statusCode = 200
        const data = Mock.mock({
          'data|1-700': [
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
        res.end(JSON.stringify(data))
      }
    },
    {
      url: '/api/admin_index',
      method: 'get',
      rawResponse: async (req, res) => {
        res.statusCode = 200
        const data = Mock.mock({
          data: {
            bear1: [0, 31],
            bear2: [0, 0],
            dryer_t: [0, 5856767],
            expender: [null, 45],
            fan1_xv: [0, 5856781],
            fan2_xv: [0, 5856775],
            flywheel: [0.55, 38],
            leak: [0.03, 0],
            motor: [0.2, 2]
          }
        })
        res.end(JSON.stringify(data))
      }
    },
    {
      url: '/api/line_info',
      method: 'get',
      rawResponse: async (req, res) => {
        res.statusCode = 200
        const data = Mock.mock({
          achivement: {
            'UPH|0-100.1': 0.0,
            'UPHRate|0-100.1': 0.0,
            'UPHTarget|0-100.1': 0.0,
            'now|0-1000.1': 0.0,
            plan: 1350.0,
            'rate|0-100.1': 0.0
          },
          equipments: {
            Press: {
              Vibration: {
                'bearing1|0-30.2': 25.88,
                'bearing2|0-30.2': 0,
                'flyWheel|0-10.2': 4.83,
                'motor|0-5.2': 2.13
              },
              state: '@pick(["running", "stopped", "error"])'
            },
            airPurge: {
              'Pressure|0-1.3': 0.513,
              state: '@pick(["running", "stopped", "error"])'
            },
            autoWelding: {
              circulatingWater: {
                highLimit: 70,
                lowLimit: 50,
                'temperature|30-70.1': 32.6
              },
              state: '@pick(["running", "stopped", "error"])'
            },
            dryingOven: {
              'Temperature|0-100.1': 0.0,
              Vibration: {
                'fan1|0-10.1': 0.0,
                'fan2|0-10.1': 0.0
              },
              state: '@pick(["running", "stopped", "error"])'
            },
            firstFlarePipe: {
              oil: {
                highLimit: 60,
                lowLimit: 30.6,
                'temperature|30-60.1': 0
              },
              pump: {
                'Vibration|0-10.1': 0
              },
              state: '@pick(["running", "stopped", "error"])'
            },
            nitrogenFilling: {
              first: {
                'pressure|0-1.3': 0.422,
                state: '@pick(["running", "stopped", "error"])'
              },
              second: {
                'pressure|0-1.3': 0.1,
                state: '@pick(["running", "stopped", "error"])'
              }
            },
            secondFlarePipe: {
              oil: {
                highLimit: 60,
                lowLimit: 30.6,
                'temperature|30-60.1': 0
              },
              pump: {
                'Vibration|0-10.1': 0
              },
              state: '@pick(["running", "stopped", "error"])'
            }
          },
          state: {
            'T/T|0-100.1': 0.0,
            'operationRate|0-100.1': 90.7
          },
          vacuumLeakTesting: {
            'leak1|7': ['@float(0, 0.1, 3, 3)'],
            'leak2|0-7': ['@float(0, 0.1, 3, 3)'],
            state: '@pick(["running", "stopped", "error"])',
            'vacuum1|0-20': 0.0,
            'vacuum2|0-20': 0.029
          },
          'plc_expander1|0-3000': 10,
          'plc_expander2|0-3000': 20,
          'plc_expander_diff|0-200': 10,
          'plc_expander_stand:200-400': 230
        })
        res.end(JSON.stringify(data))
      }
    }
  ]
}
