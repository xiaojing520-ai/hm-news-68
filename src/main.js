import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入通用的样式
import './styles/base.less'
import './styles/iconfont.css'

// 导入amfe-flexible库
import 'amfe-flexible'

// 全局注册组件
import './utils/global'
// 全局配置axios发送请求
import './utils/request'
// 全局注册过滤器
import './utils/filter'
// 全局导入vant
import './utils/vant'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
