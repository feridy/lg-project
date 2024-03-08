import { fileURLToPath, URL } from 'node:url'
// @ts-ignore
import vw from 'postcss-px-to-viewport'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    proxy: {
      '/api': {
        target: 'http://zhc.tisio.cn/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
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
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
