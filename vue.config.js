module.exports = {
  devServer: {
    open: true,
    // 反向代理
    proxy: {
      // 配置的代理规则，，，只要是以 /api开头的url地址都会被代理
      // https://localhost:8081/api/login
      // https://localhost:3000/api/login
      '/abc': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/abc': '' },
        // 代理到https协议下
        secure: true
      }
    }
  },
  // 覆盖webpack的配置参数
  configureWebpack: {
    externals: {
      // 参数1：排除的模块名
      // 参数2： 全局变量名
      vue: 'Vue',
      'vue-router': 'VueRouter',
      moment: 'moment',
      axios: 'axios'
    }
  }
}
