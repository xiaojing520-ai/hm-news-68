// 配置过滤器
// 定义过滤器
import Vue from 'vue'
// 引入moment(格式时间)
import moment from 'moment'
// 给moment全局的定义语言环境
moment.locale('zh-CN')

Vue.filter('time', (input, str = 'YYYY-MM-DD') => {
  return moment(input).format(str)
})

Vue.filter('now', input => {
  return moment(input).fromNow()
})
