import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store)
app.use(router)
app.use(ElementPlus, { locale: zhCn })

// 添加全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err, info)
}

try {
  app.mount('#app')
} catch (error) {
  console.error('Failed to mount app:', error)
  document.getElementById('app').innerHTML = '<div style="padding: 20px; color: red;">应用加载失败，请检查控制台错误信息</div>'
}

