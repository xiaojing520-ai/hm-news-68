// 配置过滤器
// 定义过滤器
import Vue from 'vue'
// 引入moment(格式时间)
import moment from 'moment'
Vue.filter('time', (input, str = 'YYY-MM-DD') => {
  return moment(input).format(str)
})
