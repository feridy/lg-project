import { fileURLToPath, URL } from 'node:url'
// @ts-ignore
import vw from 'postcss-px-to-viewport'
import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dayjs from 'dayjs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const myPlugin = (): Plugin => ({
  name: 'configure-server',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      // console.log('req.url', req.url)
      if (req.url?.startsWith('/api')) {
        if (req.url === '/api/test') console.log(req.url)

        const devices = ['bearing1', 'bearing2', 'motor', 'flywheel', 'oil1', 'oil2']

        if (req.url.startsWith('/api/he5/sensor/fan1_xa')) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          console.log(process.cwd())
          const data = await readFile(path.join(process.cwd(), './public/fan1_xa.json'), {
            encoding: 'utf-8'
          })
          res.write(data)
          return res.end()
          // readFile()
        }

        if (req.url.startsWith('/api/he5/sensor/fan1_ya')) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          console.log(process.cwd())
          const data = await readFile(path.join(process.cwd(), './public/fan1_ya.json'), {
            encoding: 'utf-8'
          })
          res.write(data)
          return res.end()
          // readFile()
        }

        if (req.url.startsWith('/api/he5/sensor/fan1_za')) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          console.log(process.cwd())
          const data = await readFile(path.join(process.cwd(), './public/fan1_za.json'), {
            encoding: 'utf-8'
          })
          res.write(data)
          return res.end()
          // readFile()
        }

        if (
          req.url.startsWith('/api/he5/sensor/bearing1_xa') ||
          req.url.startsWith('/api/he5/sensor/bearing1_ya') ||
          req.url.startsWith('/api/he5/sensor/bearing1_za') ||
          req.url.startsWith('/api/he5/sensor/bearing1_xv') ||
          req.url.startsWith('/api/he5/sensor/bearing1_yv') ||
          req.url.startsWith('/api/he5/sensor/bearing1_zv') ||
          req.url.startsWith('/api/he5/sensor/bearing1_t') ||
          req.url.startsWith('/api/he5/sensor/oil1_t') ||
          req.url.startsWith('/api/he5/sensor/oil2_t') ||
          req.url.startsWith('/api/he5/sensor/Nfill1_p') ||
          req.url.startsWith('/api/he5/sensor/Nfill2_p')
        ) {
          // res.writeHead(200, { 'Content-Type': 'application/json' })
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          const array = new Array(Math.round(16000 * Math.random())).fill(1)
          const now = dayjs()
          const data = {
            data: array.map((item, index) => {
              const a = now.add(index, 'm').valueOf() / 1000
              return [a, Math.random() * 10]
            })
          }
          res.write(JSON.stringify(data))
          return res.end()
          // res.end()
        }

        // if ()
      }

      next()
      // 自定义请求处理...
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), myPlugin()],
  base: './',

  css: {
    postcss: {
      plugins: [
        vw({
          viewportWidth: 1920, // 视口宽度，对应设计稿宽度
          viewporHeight: 1080, // 视口高度，对应设计稿高度
          // unitPrecision: , // 指定px转换之后的小数位数
          viewportUnit: 'vw', // 转换的单位
          fontViewportUnit: 'vw', // 字体使用的单位
          replace: true, //  是否直接更换属性值，而不添加备用属性
          selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换的类
          exclude: /(\/|\\)(node_modules)(\/|\\)/, //禁止更改第三方UI框架样式
          minPixelValue: 1, // 小于或等于1px不转换
          mediaQuery: true // 允许在媒体查询中转换
        })
      ]
    }
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
