import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  // 指定每一个路由规则都可以提供一个name属性
  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' },
  { path: '/user', component: User, name: 'user' }
]

const router = new VueRouter({
  routes
})

// to:到哪儿去
// from: 从哪里来
// 判断to的path是否是/user 判断用户是否是去个人中心
// 1、如果不是去个人中心，直接放行next()
// 2、判断是否有token
// 如果有，放行
// 如果没有，跳转到登录

router.beforeEach(function(to, from, next) {
  // 只要路由发生跳转，跳转之前这个函数就会执行
  // console.log('前置导航守卫')
  // console.log('to', to)
  // console.log('from', from)
  // next()
  // if (to.name === 'user') {
  //   const token = localStorage.getItem('token')
  //   if (token) {
  //     next()
  //   } else {
  //     router.push('/login')
  //   }
  // } else {
  //   next()
  // }
  const token = localStorage.getItem('token')
  if (to.name !== 'user' || token) {
    next()
  } else {
    router.push('/login')
  }
})

export default router
