// 配置过滤器
// 定义过滤器
import Vue from 'vue'
// 引入moment(格式时间)
import moment from 'moment'
Vue.filter('time', input => {
  return moment(input).format('YYYY-MM-DD')
})
