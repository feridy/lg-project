<script setup lang="ts">
import itemIcon from '../assets/images/home-tip-icon.png'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import * as echarts from 'echarts'
import { RangePicker } from 'ant-design-vue'
import dayjs from 'dayjs';
import { useStore } from '../stores'
import { Spin } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import { request } from '../apis/index'
import { getDeviceData, getDeviceEchartsData } from '@/apis';

type RangeValue = [Dayjs, Dayjs];

const store = useStore()
const dateRange = ref<RangeValue>()
const echartsRef = ref<HTMLDivElement | null>(null)
let echartInstance: echarts.ECharts | null = null

const dayList = [{
  id: 'week',
  label: '近7天',
}, {
  id: 'month',
  label: '近30天'
}, {
  id: 'quarter',
  label: '近90天'
}, {
  id: 'custom',
  label: '自定义',
}]

const tagList = ref([{
  label: '加速度',
  id: 1,
  includes: ['bearing1', 'bearing2', 'motor', 'flywheel', 'fan1', 'fan2']
}, {
  label: '速度',
  id: 2,
  includes: ['bearing1', 'bearing2', 'motor', 'flywheel', 'fan1', 'fan2']
}, {
  label: '位移',
  id: 3,
  includes: ['bearing1', 'bearing2', 'motor', 'flywheel', 'fan1', 'fan2']
}, {
  label: '温度',
  includes: ['bearing1', 'bearing2', 'motor', 'flywheel', 'fan1', 'fan2', 'dryingOven', 'expender'],
  id: 4,
}, {
  label: '真空度1',
  includes: ['leak'],
  id: 5,
}])

const currentSelectDayId = ref(dayList[0].id)

const currentId = ref(store.monitorDevices[0].id)

const isLoading = ref(true)
const currentFeatureId = ref(1)

const currentItem = computed(() => store.monitorDevices.find(item => item.id === currentId.value))

function dealData(dateStr: string) {
  const date = new Date(dateStr);
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')
  const second = `${date.getSeconds()}`.padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function initChart() {
  if (!echartsRef.value) {
    return
  }
  echartInstance = echarts.init(echartsRef.value)
  echartInstance.on('datazoom', (e) => {
    // console.log(e)
    echartInstance?.dispatchAction({
      type: "takeGlobalCursor",
      key: "dataZoomSelect",
      dataZoomSelectActive: true
    })
  });

  echartInstance.setOption({
    color: ["#409EFF"],
    // title: {
    //   show: true,
    //   text: '加速度 | 特征值',
    //   textStyle: {
    //     color: '#FFF',
    //     fontSize: 14,
    //   }
    // },
    legend: {
      show: true,
      top: 0,
      left: "40%",
      // icon: 'none',
      textStyle: {
        color: '#fff'
      }
    },
    toolbox: {
      show: false,
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
      show: true
    }],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      },
      // showContent: !0
    },
    xAxis: [{
      type: "category",
      axisTick: {
        alignWithLabel: true,
        lineStyle: {
          color: "#8291A9"
        },
      },
      axisLabel: {
        interval: 'auto',
        // width: 80,
        rotate: 0,
        margin: 10,
        overflow: 'truncate',
        color: '#fff', //"#8291A9",
        fontSize: 12,
        showMinLabel: true,
        fontFamily: "PingFangSC"
      },
      axisLine: {
        show: true,
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
          // formatter: function (t: any) {
          //   return t.seriesData[0].data ? "[x]" + t.value : null
          // },
          padding: [5, 14],
          margin: 0,
          backgroundColor: "#409EFF"
        }
      }
    }],
    yAxis: {
      type: "value",
      min: 0,
      boundaryGap: ["20%", "20%"],
      splitLine: {
        lineStyle: {
          color: "rgba(130, 145, 169, 0.25)"
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(130, 145, 169, 0.25)"
        }
      },
      axisLabel: {
        inside: false,
        color: '#fff',  //"#8291A9",
        fontSize: 14,
        fontFamily: "PingFangSC"
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
        inside: true
      }
    },
    grid: {
      top: 40,
      bottom: 0,
      left: 0,
      right: 0,
      containLabel: !0
    },
    // series: [{
    //   type: "line",
    //   name: '加速度',
    //   symbol: "none",
    //   itemStyle: {
    //     color: "#F56C6C"
    //   },
    //   xAxisIndex: 0,
    //   lineStyle: {
    //     width: 1,
    //     color: "#409EFF"
    //   },
    //   label: {
    //     show: false
    //   },
    //   markLine: {
    //     symbol: "circle",
    //     label: {
    //       position: "end",
    //       formatter: function (t: any) {
    //         var e = t.name;
    //         return "" !== e && t.dataIndex,
    //           e
    //       },
    //       fontSize: 14,
    //       fontFamily: "PingFangSC",
    //       color: "#ffffff"
    //     },
    //     data: []
    //   }
    // }]
  })

  // window.echartInstance = echartInstance
}

function loadChartData(splitNumber: number, data: {
  dataX: number[],
  dataY: number[]
}, min?: number, max?: number) {
  if (min !== undefined && max !== undefined) {
    const chartMin = (min - min / 4).toFixed(3);
    const chartMax = (max + max / 10).toFixed(3);
    console.log("min:" + min + ";max:" + max + ";chartMin:" + chartMin + ";chartMax:" + chartMax);
  }


  if (echartInstance) {
    const options = echartInstance.getOption();
    const seriesOptions = {
      type: "line",
      name: '加速度',
      symbol: "none",
      itemStyle: {
        color: "#F56C6C"
      },
      xAxisIndex: 0,
      lineStyle: {
        width: 1,
        color: "#409EFF"
      },
      label: {
        show: false
      },
      markLine: {
        symbol: "circle",
        label: {
          position: "end",
          formatter: function (t: any) {
            var e = t.name;
            return "" !== e && t.dataIndex,
              e
          },
          fontSize: 14,
          fontFamily: "PingFangSC",
          color: "#ffffff"
        },
        data: []
      },
      data: data.dataY
    };
    (options.xAxis as any)[0].splitNumber = splitNumber;
    (options.xAxis as any)[0].data = data.dataX;
    // (options.series as any)[0].data = data.dataY;
    // (options.series as any)[0].markLine.data = [];
    options.series = [seriesOptions]
    echartInstance.clear();
    echartInstance.setOption(options);
  }
}

function download() {
  if (echartInstance) {
    const option = echartInstance.getOption() as any;
    const deviceName = currentItem.value?.label
    const featureName = tagList.value.find(item => item.id === currentFeatureId.value)?.label
    const title = option.title?.text ?? featureName;
    let dataStr = `${deviceName}${title}\n`;
    // console.log(deviceName);
    // return
    dataStr += "时间,";
    option.series.forEach((seriesItem: any) => {
      dataStr += `,${seriesItem.name}`
    })
    dataStr += "\n";
    option.xAxis[0].data?.forEach((item: any, index: number) => {
      dataStr += `${item}`
      option.series.forEach((seriesItem: any) => {
        dataStr += `,${seriesItem.data[index]}`
      })
      dataStr += '\n'
    })
    const buffer = new Blob(["\ufeff" + dataStr], {
      type: "test/csv;charset=utf-8"
    });
    console.log(dataStr);
    const url = window.URL.createObjectURL(buffer);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deviceName}${title}.csv`;
    // const a.href = url;
    a.download = currentItem.value?.label + ".csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

function translateFeatureId() {
  switch (currentFeatureId.value) {
    case 1:
      return 'a'
    case 2:
      return 'v'

    case 3:
      return 's'
    case 4:
      return 't'

    case 5:
      return 'p'

    default:
      return ''
  }
}

function translateFeatureUnit() {
  switch (currentFeatureId.value) {
    case 1:
      return 'm/s2'
    case 2:
      return 'm/s'
    case 3:
      return 'um'
    case 4:
      return '℃'
    case 5:
      return 'Torr'


    default:
      return ''
  }
}

async function loadEchartData() {
  if (!dateRange.value || !echartInstance) return
  const featureName = tagList.value.find(item => item.id === currentFeatureId.value)?.label
  const feature = translateFeatureId()
  const unit = translateFeatureUnit()
  const options = echartInstance.getOption() as any;

  isLoading.value = true

  try {
    // 针对真空度的处理
    if (currentId.value === 'leak') {
      const [one, two] = await Promise.all([
        request.get(`/${store.currentDeviceId}/sensor/Nfill1_${feature}`, {
          params: {
            start: dateRange.value?.[0].valueOf() / 1000,
            end: dateRange.value?.[1].valueOf() / 1000,
          }
        }),
        request.get(`/${store.currentDeviceId}/sensor/Nfill1_x${feature}`, {
          params: {
            start: dateRange.value?.[0].valueOf() / 1000,
            end: dateRange.value?.[1].valueOf() / 1000,
          }
        })
      ])

      const xData = one.data.data
      const yData = two.data.data

      const timeData = xData.map((item: any,) => {
        const x = item[0]
        return dayjs(x * 1000).format('YYYY-MM-DD HH:mm:ss')
      })

      options.xAxis[0].splitNumber = 1;

      options.title = {
        show: true,
        text: `${featureName} | 特征值`,
        textStyle: {
          color: '#FFF',
          fontSize: 14,
        }
      }
      options.xAxis[0].data = timeData;
      options.series = [{
        type: "line",
        name: `${featureName}1#(${unit})`,
        symbol: "none",
        itemStyle: {
          color: "#00A0E9"
        },
        xAxisIndex: 0,
        lineStyle: {
          width: 1,
          color: "#00A0E9"
        },
        label: {
          show: false
        },
        markLine: {
          symbol: "circle",
          label: {
            position: "end",
            formatter: function (t: any) {
              var e = t.name;
              return "" !== e && t.dataIndex,
                e
            },
            fontSize: 14,
            fontFamily: "PingFangSC",
            color: "#ffffff"
          },
          data: []
        },
        data: xData.map((item: number[]) => item[1])
      }, {
        type: "line",
        name: `${featureName}2#(${unit})`,
        symbol: "none",
        itemStyle: {
          color: "#E60012",
        },
        xAxisIndex: 0,
        lineStyle: {
          width: 1,
          color: "#E60012"
        },
        label: {
          show: false
        },
        markLine: {
          symbol: "circle",
          label: {
            position: "end",
            formatter: function (t: any) {
              var e = t.name;
              return "" !== e && t.dataIndex,
                e
            },
            fontSize: 14,
            fontFamily: "PingFangSC",
            color: "#ffffff"
          },
          data: []
        },
        data: yData.map((item: number[]) => item[1])
      }];
      echartInstance.clear();
      echartInstance.setOption(options);

      echartInstance.dispatchAction({
        type: 'dataZoom',
        start: 0,
        end: 10800 / timeData.length > 1 ? 100 : 10800 / timeData.length
      })

      return
    }
    // 针对Expender （℃）的处理
    if (currentId.value === 'expender') {
      const [one, two] = await Promise.all([
        request.get(`/${store.currentDeviceId}/sensor/oil1_${feature}`, {
          params: {
            start: dateRange.value?.[0].valueOf() / 1000,
            end: dateRange.value?.[1].valueOf() / 1000,
          }
        }),
        request.get(`${store.currentDeviceId}/sensor/oil2_x${feature}`, {
          params: {
            start: dateRange.value?.[0].valueOf() / 1000,
            end: dateRange.value?.[1].valueOf() / 1000,
          }
        })
      ])
      const xData = one.data.data
      const yData = two.data.data

      const timeData = xData.map((item: any,) => {
        const x = item[0]
        return dayjs(x * 1000).format('YYYY-MM-DD HH:mm:ss')
      })

      options.xAxis[0].splitNumber = 1;

      options.title = {
        show: true,
        text: `${featureName} | 特征值`,
        textStyle: {
          color: '#FFF',
          fontSize: 14,
        }
      }
      options.xAxis[0].data = timeData;
      options.series = [{
        type: "line",
        name: `液压油温(${unit})`,
        symbol: "none",
        itemStyle: {
          color: "#00A0E9"
        },
        xAxisIndex: 0,
        lineStyle: {
          width: 1,
          color: "#00A0E9"
        },
        label: {
          show: false
        },
        markLine: {
          symbol: "circle",
          label: {
            position: "end",
            formatter: function (t: any) {
              var e = t.name;
              return "" !== e && t.dataIndex,
                e
            },
            fontSize: 14,
            fontFamily: "PingFangSC",
            color: "#ffffff"
          },
          data: []
        },
        data: xData.map((item: number[]) => item[1])
      }, {
        type: "line",
        name: `电机温度(${unit})`,
        symbol: "none",
        itemStyle: {
          color: "#E60012",
        },
        xAxisIndex: 0,
        lineStyle: {
          width: 1,
          color: "#E60012"
        },
        label: {
          show: false
        },
        markLine: {
          symbol: "circle",
          label: {
            position: "end",
            formatter: function (t: any) {
              var e = t.name;
              return "" !== e && t.dataIndex,
                e
            },
            fontSize: 14,
            fontFamily: "PingFangSC",
            color: "#ffffff"
          },
          data: []
        },
        data: yData.map((item: number[]) => item[1])
      }];
      echartInstance.clear();
      echartInstance.setOption(options);

      echartInstance.dispatchAction({
        type: 'dataZoom',
        start: 0,
        end: 10800 / timeData.length > 1 ? 100 : 10800 / timeData.length
      })
      return
    }
    // 针对干燥炉温度的处理
    if (currentId.value === 'dryingOven') {
      const [one] = await Promise.all([
        request.get(`/${store.currentDeviceId}/sensor/dryer_${feature}`, {
          params: {
            start: dateRange.value?.[0].valueOf() / 1000,
            end: dateRange.value?.[1].valueOf() / 1000,
          }
        }),
      ])
      const xData = one.data.data;
      const timeData = xData.map((item: any,) => {
        const x = item[0]
        return dayjs(x * 1000).format('YYYY-MM-DD HH:mm:ss')
      })
      options.xAxis[0].splitNumber = 1;

      options.title = {
        show: true,
        text: `${featureName} | 特征值`,
        textStyle: {
          color: '#FFF',
          fontSize: 14,
        }
      }
      options.xAxis[0].data = timeData;
      options.series = [{
        type: "line",
        name: `干燥炉温度(${unit})`,
        symbol: "none",
        itemStyle: {
          color: "#00A0E9"
        },
        xAxisIndex: 0,
        lineStyle: {
          width: 1,
          color: "#00A0E9"
        },
        label: {
          show: false
        },
        markLine: {
          symbol: "circle",
          label: {
            position: "end",
            formatter: function (t: any) {
              var e = t.name;
              return "" !== e && t.dataIndex,
                e
            },
            fontSize: 14,
            fontFamily: "PingFangSC",
            color: "#ffffff"
          },
          data: []
        },
        data: xData.map((item: number[]) => item[1])
      }];
      echartInstance.clear();
      echartInstance.setOption(options);

      echartInstance.dispatchAction({
        type: 'dataZoom',
        start: 0,
        end: 10800 / timeData.length > 1 ? 100 : 10800 / timeData.length
      })
      return
    }
    // 其他的处理
    if (currentFeatureId.value !== 4) {
      const [x, y, z] = await Promise.all([
        request.get(`/${store.currentDeviceId}/sensor/${currentId.value}_x${feature}`, {
          params: {
            start: dateRange.value?.[0].valueOf() / 1000,
            end: dateRange.value?.[1].valueOf() / 1000,
          }
        }),
        request.get(`/${store.currentDeviceId}/sensor/${currentId.value}_y${feature}`, {
          params: {
            start: dateRange.value?.[0].valueOf() / 1000,
            end: dateRange.value?.[1].valueOf() / 1000,
          }
        }),
        request.get(`/${store.currentDeviceId}/sensor/${currentId.value}_z${feature}`, {
          params: {
            start: dateRange.value?.[0].valueOf() / 1000,
            end: dateRange.value?.[1].valueOf() / 1000,
          }
        })
      ])
      const xData = x.data.data
      const yData = y.data.data
      const zData = z.data.data

      const timeData = xData.map((item: any, index: number) => {
        const x = item[0]
        const y = yData[index][0]
        const z = zData[index][0]

        return dayjs((x + y + z) / 3 * 1000).format('YYYY-MM-DD HH:mm:ss')
      })

      options.xAxis[0].splitNumber = 1;
      options.title = {
        show: true,
        text: `${featureName} | 特征值`,
        textStyle: {
          color: '#FFF',
          fontSize: 14,
        }
      }
      options.xAxis[0].data = timeData;
      options.series = [{
        type: "line",
        name: `X轴-${featureName}(${unit})`,
        symbol: "none",
        itemStyle: {
          color: "#00A0E9"
        },
        xAxisIndex: 0,
        lineStyle: {
          width: 1,
          color: "#00A0E9"
        },
        label: {
          show: false
        },
        markLine: {
          symbol: "circle",
          label: {
            position: "end",
            formatter: function (t: any) {
              var e = t.name;
              return "" !== e && t.dataIndex,
                e
            },
            fontSize: 14,
            fontFamily: "PingFangSC",
            color: "#ffffff"
          },
          data: []
        },
        data: xData.map((item: number[]) => item[1])
      }, {
        type: "line",
        name: `Y轴-${featureName}(${unit})`,
        symbol: "none",
        itemStyle: {
          color: "#E60012",
        },
        xAxisIndex: 0,
        lineStyle: {
          width: 1,
          color: "#E60012"
        },
        label: {
          show: false
        },
        markLine: {
          symbol: "circle",
          label: {
            position: "end",
            formatter: function (t: any) {
              var e = t.name;
              return "" !== e && t.dataIndex,
                e
            },
            fontSize: 14,
            fontFamily: "PingFangSC",
            color: "#ffffff"
          },
          data: []
        },
        data: yData.map((item: number[]) => item[1])
      }, {
        type: "line",
        name: `Z轴-${featureName}(${unit})`,
        symbol: "none",
        itemStyle: {
          color: "#00FF00",
        },
        xAxisIndex: 0,
        lineStyle: {
          width: 1,
          color: "#00FF00"
        },
        label: {
          show: false
        },
        markLine: {
          symbol: "circle",
          label: {
            position: "end",
            formatter: function (t: any) {
              var e = t.name;
              return "" !== e && t.dataIndex,
                e
            },
            fontSize: 14,
            fontFamily: "PingFangSC",
            color: "#ffffff"
          },
          data: []
        },
        data: zData.map((item: number[]) => item[1])
      }];
      echartInstance.clear();
      echartInstance.setOption(options);

      echartInstance.dispatchAction({
        type: 'dataZoom',
        start: 0,
        end: 10800 / timeData.length > 1 ? 100 : 10800 / timeData.length
      })
    } else {
      const tData = (await request.get(`/${store.currentDeviceId}/sensor/${currentId.value}_${feature}`, {
        params: {
          start: dateRange.value?.[0].valueOf() / 1000,
          end: dateRange.value?.[1].valueOf() / 1000,
        }
      })).data.data;
      const timeData = tData.map((item: any,) => {
        return dayjs(item[0] * 1000).format('YYYY-MM-DD HH:mm:ss')
      })
      options.title = {
        show: true,
        text: `${featureName} | 特征值`,
        textStyle: {
          color: '#FFF',
          fontSize: 14,
        }
      }
      options.xAxis[0].splitNumber = 1;
      options.xAxis[0].data = timeData;
      options.series = [{
        type: "line",
        name: `${featureName}(${unit})`,
        symbol: "none",
        itemStyle: {
          color: "#00A0E9"
        },
        xAxisIndex: 0,
        lineStyle: {
          width: 1,
          color: "#00A0E9"
        },
        label: {
          show: false
        },
        markLine: {
          symbol: "circle",
          label: {
            position: "end",
            formatter: function (t: any) {
              var e = t.name;
              return "" !== e && t.dataIndex,
                e
            },
            fontSize: 14,
            fontFamily: "PingFangSC",
            color: "#ffffff"
          },
          data: []
        },
        data: tData.map((item: any) => item[1])
      }]
      echartInstance.clear();
      echartInstance.setOption(options);
      echartInstance.dispatchAction({
        type: 'dataZoom',
        start: 0,
        end: 10800 / timeData.length > 1 ? 100 : 10800 / timeData.length
      })
    }

  } catch (error) {
    error
  } finally {
    isLoading.value = false;
  }
}


async function loadWaveChart() {
  if (!dateRange.value) return

  const data = await getDeviceEchartsData(currentId.value, {
    start: dateRange.value?.[0].valueOf(),
    end: dateRange.value?.[1].valueOf(),
  })

  console.log(data);

  const dataX = data.data.map((item: any, index: any) => {
    const now = dayjs();
    const time = now.add(index, 'day');
    return time.format('YYYY-MM-DD HH:MM')
  });

  if (echartInstance) {
    const options = echartInstance.getOption();
    (options.xAxis as any)[0].splitNumber = 1;
    (options.xAxis as any)[0].data = dataX;
    options.series = [{
      type: "line",
      name: 'X轴加速度',
      symbol: "none",
      itemStyle: {
        color: "#00A0E9"
      },
      xAxisIndex: 0,
      lineStyle: {
        width: 1,
        color: "#00A0E9"
      },
      label: {
        show: false
      },
      markLine: {
        symbol: "circle",
        label: {
          position: "end",
          formatter: function (t: any) {
            var e = t.name;
            return "" !== e && t.dataIndex,
              e
          },
          fontSize: 14,
          fontFamily: "PingFangSC",
          color: "#ffffff"
        },
        data: []
      },
      data: data.data
    }, {
      type: "line",
      name: 'Y轴加速度',
      symbol: "none",
      itemStyle: {
        color: "#E60012",
        // show: false,
      },
      xAxisIndex: 0,
      lineStyle: {
        width: 1,
        color: "#E60012"
      },
      label: {
        show: false
      },
      markLine: {
        symbol: "circle",
        label: {
          position: "end",
          formatter: function (t: any) {
            var e = t.name;
            return "" !== e && t.dataIndex,
              e
          },
          fontSize: 14,
          fontFamily: "PingFangSC",
          color: "#ffffff"
        },
        data: []
      },
      data: data.data.map((item: any) => item + Math.random() * 10)
    }, {
      type: "line",
      name: 'Z轴加速度',
      symbol: "none",
      itemStyle: {
        color: "#00FF00",
        // show: false,
      },
      xAxisIndex: 0,
      lineStyle: {
        width: 1,
        color: "#00FF00"
      },
      label: {
        show: false
      },
      markLine: {
        symbol: "circle",
        label: {
          position: "end",
          formatter: function (t: any) {
            var e = t.name;
            return "" !== e && t.dataIndex,
              e
          },
          fontSize: 14,
          fontFamily: "PingFangSC",
          color: "#ffffff"
        },
        data: []
      },
      data: data.data.map((item: any) => item + Math.random() * 10)
    }];
    // (options.series as any)[0].markLine.data = [];
    echartInstance.clear();
    echartInstance.setOption(options);
  }
}

watch(currentId, () => {
  currentFeatureId.value = tagList.value.filter(item => item.includes.includes(currentId.value))[0].id
})

watch(() => ({
  range: dateRange.value,
  deviceId: currentId.value,
  feature: currentFeatureId.value
}), async ({ range, deviceId }) => {
  if (deviceId)
    if (range) {
      await loadEchartData()
      // await loadWaveChart()
    }
})


watch(() => {
  return {
    dataId: currentSelectDayId.value
  }
}, async ({ dataId }) => {
  const startDate = dayjs()
  switch (dataId) {
    case 'week':
      dateRange.value = [startDate.subtract(7, 'day'), startDate]
      break;
    case 'month':
      dateRange.value = [startDate.subtract(30, 'day'), startDate]
      break
    case 'quarter':
      dateRange.value = [startDate.subtract(90, 'day'), startDate]
      break
    default:
      dateRange.value = undefined
      break;
  }
})



function onMonitorDeviceClick(id: string) {
  currentId.value = id
}

onMounted(async () => {

  isLoading.value = false

  try {
    
    const res = await getDeviceData(store.currentDeviceId)

    // isLoading.value = false

    store.changeMonitorDevices(res)
  } catch (error) {
    error
  }



  initChart()
  const startDate = dayjs()
  switch (currentSelectDayId.value) {
    case 'week':
      dateRange.value = [startDate, startDate.add(7, 'day')]
      break;
    case 'month':
      dateRange.value = [startDate, startDate.add(30, 'day')]
      break
    case 'quarter':
      dateRange.value = [startDate, startDate.add(90, 'day')]
      break
    default:
      dateRange.value = undefined
      break;
  }


  // await loadWaveChart()
})

onUnmounted(() => {

  echartInstance?.dispose()
})
</script>

<template>
  <div class="detail-wrapper">
    <div class="detail-header">
      <div class="detail-header-left">
        <img class="detail-header-left__icon" :src="itemIcon" />
        <span class="detail-header-left__text">本月运行</span>
        <span class="detail-header-left__strong">{{ store.currentDevice?.runningHours }}</span>
        <span class="detail-header-left__text" style="margin-left: 5px;">H</span>
        <span class="detail-header-left__text">24H报警</span>
        <span class="detail-header-left__strong" style="min-width:0px;margin-left: 5px;">{{
          store.currentDevice?.alarmCount }}</span>
        <span class="detail-header-left__text" style="margin-left: 5px;">条</span>
      </div>
      <div class="detail-header-center">{{ store.currentDevice?.label }} 设备运行情况</div>
      <div class="detail-header-right">
        <div class="detail-header-right__time">
          <span class="detail-header-right__time__day">{{ store.dateDay }}</span>
          <span class="detail-header-right__time__weekday">{{ store.dateWeekday }}</span>
          <span class="detail-header-right__time__time">{{ store.dateTime }}</span>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <div class="detail-content-header">
        <div class="detail-content-header__device__one"></div>
        <div class="detail-content-header__device__two"></div>
        <div class="detail-content-header__device" v-for="item in store.monitorDevices" :key="item.id"
          :class="`detail-content-header__device__${item.tag} ${item.id === currentId ? 'active' : ''}`"
          @click="onMonitorDeviceClick(item.id)">
          <div class="detail-content-header__device__bearing__title">{{ item.label }} {{ item.titleShowUnit ?
            `(${item.unit})` : '' }}</div>
          <div class="detail-content-header__device__bearing__content">
            <div class="detail-content-header__device__bearing__content__icon"></div>
            <div class="detail-content-header__device__bearing__content__detail">
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span class="strong">{{ item.value }}</span>
                <span>{{ item.unit }}</span>
              </div>
              <div class="detail-content-header__device__bearing__content__detail__item">
                <span>{{ item.name }}</span>
                <span style="margin-left: auto;">{{ item.history }}前</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="detail-content-echarts">
        <div class="detail-content-echarts__title">
          <span>{{ currentItem?.label }} {{ `(${currentItem?.unit})` }}</span>
          <!-- <span>11001.192.168.0.101.1TS-RE-V8T</span> -->
        </div>
        <div class="detail-content-echarts__divide"></div>
        <div class="detail-content-echarts__menus">
          <div class="detail-content-echarts__menus__item" :class="{ active: item.id === currentFeatureId }"
            v-for="item in tagList.filter(item => item.includes.includes(currentId))" :key="item.id"
            @click="() => currentFeatureId = item.id">{{ item.label }}
          </div>
          <div class="detail-content-echarts__menus__date">
            <span v-for="item in dayList" :key="item.id" :class="{ active: item.id === currentSelectDayId }"
              @click="() => currentSelectDayId = item.id">{{
                item.label
              }}</span>
            <RangePicker v-if="currentSelectDayId === 'custom'" v-model:value="dateRange" />
            <span class="download-icon" @click="download"></span>
          </div>
        </div>
        <div class="detail-content-echarts__tag" style="display: none;">
          <div class="detail-content-echarts__tag__name">加速度 | 特征值</div>
          <div class="detail-content-echarts__tag__em">加速度 (m/s2)</div>
        </div>
        <div class="detail-content-echarts__content" ref="echartsRef">
        </div>
        <div class="loading" v-if="isLoading">
          <Spin />
        </div>
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

        &.active {
          color: #FD0707;
        }

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
          width: 200px;
          /* height: 90px; */
          align-items: center;

          .detail-content-header__device__bearing__content__icon {
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translate(0, -50%);
            width: 9px;
            height: 71px;
            background-image: url('../assets/images/detail-expender-icon.png');
            background-size: 100% 100%;
          }

          .detail-content-header__device__bearing__title {
            position: absolute;
            top: 9px;
            left: 50%;
            margin-left: 5px;
            white-space: nowrap;
            transform: translate(-50%, 0);
            font-size: 17px;
            font-weight: 600;
            text-align: center;
            order: 2;
          }

          .detail-content-header__device__bearing__content__detail {
            margin-top: 10px;
            margin-left: 24px;
          }

          .detail-content-header__device__bearing__content {
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
      position: relative;
      margin-top: 8px;

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
        margin-bottom: 20px;
        width: 1834px;
        height: 40px;
        line-height: 40px;
        color: #fff;

        &__item {
          margin: 0 24px;
          font-size: 18px;
          font-weight: 700;
          /* color: #7D7D7D; */
          cursor: pointer;

          &.active {
            color: #C10A0A;
          }
        }

        &__date {
          display: flex;
          margin-left: auto;
          margin-right: 24px;
          align-items: center;

          >span {
            margin: 0 9px;
            cursor: pointer;
            text-align: center;

            &.active {
              color: #FE1010;
            }

            &.download-icon {
              width: 16px;
              height: 16px;
              background-image: url('../assets/images/download-icon.png');
              background-size: 100% 100%;
              cursor: pointer;
            }
          }
        }
      }

      &__tag {
        display: flex;
        align-items: center;
        margin: 0 auto;
        width: 1834px;
        height: 40px;
        color: #fff;
        line-height: 40px;

        &__name {
          font-size: 16px;
          margin-left: 24px;
          color: #fff;
        }

        &__em {
          position: relative;
          margin-left: 40px;
          padding-left: 20px;


          &::before {
            position: absolute;
            top: 50%;
            left: 0;
            content: "";
            width: 12px;
            height: 12px;
            border-radius: 50%;
            transform: translateY(-50%);
            background-color: #00A0E9;
          }
        }
      }

      &__content {
        margin: 0 auto;
        margin-bottom: 20px;
        width: 1800px;
        height: 460px;
      }
    }
  }

  .loading {
    position: absolute;
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