<template>
  <div class="register">
    <hm-header>注册</hm-header>
    <hm-logo></hm-logo>

    <!-- 表单登陆 -->
    <van-form @submit="register">
      <van-field v-model="user.username" label="账号" placeholder="请输入账号" :rules="rules.username" />
      <van-field v-model="user.nickname" label="昵称" placeholder="请输入昵称" :rules="rules.nickname" />
      <van-field
        v-model="user.password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        :rules="rules.password"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">登录</van-button>
      </div>
      <p class="tips">
        已有账号去
        <router-link to="/login">登录</router-link>
      </p>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        nickname: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'onChange' },
          {
            pattern: /^\d{5,11}$/,
            message: '用户名长度是5-11位',
            trigger: 'onChange'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'onChange' },
          {
            pattern: /^\d{3,9}$/,
            message: '密码长度是3-9位',
            trigger: 'onChange'
          }
        ],
        nickname: [
          { required: true, message: '昵称不能为空', trigger: 'onChange' },
          {
            pattern: /^[\u4e00-\u9fa5]{2,6}$/,
            message: '昵称必须是2-6位中文',
            trigger: 'onChange'
          }
        ]
      }
    }
  },
  methods: {
    async register() {
      console.log('注册')
      const res = await this.$axios.post('/register', this.user)
      // console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        // this.$router.push(
        //   `/login?username=${this.user.username}&password=${this.user.password}`
        // )
        // this.$router.push({
        //   path: 'login',
        //   query: this.user
        // })
        this.$router.push({
          name: 'login',
          params: this.user
        })
      } else {
        this.$toast.fail(message)
      }
    }
  }
}
</script>

<style lang="less">
// lang: 用于指定css语言 lang="less scss css"
// scoped: 作用域 当前组件的样式带了scoped,这个样式只会在当前组件生效
.tips {
  font-size: 16px;
  text-align: right;
  padding: 15px;
  a {
    color: orange;
  }
}
</style>
