<template>
  <div>
    <hm-header>登录</hm-header>
    <hm-logo></hm-logo>

    <!-- 表单登陆 -->
    <van-form @submit="login">
      <van-field
        v-model="username"
        name="用户名"
        label="账号"
        placeholder="请输入账号"
        :rules="rules.username"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="请输入密码"
        :rules="rules.password"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
      <p class="tips">
        没有账号？去
        <router-link to="/register">注册</router-link>
      </p>
    </van-form>
  </div>
</template>

<script>
export default {
  created() {
    console.log(this.$route)
    const { username, password } = this.$route.params
    this.username = username
    this.password = password
  },
  data() {
    return {
      username: '',
      password: '',
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
        ]
      }
    }
  },

  methods: {
    async login() {
      const res = await this.$axios.post('/login', {
        username: this.username,
        password: this.password
      })
      console.log(res.data)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        // 保存token
        // 跳转到个人中心
        this.$router.push('./user')
      } else {
        this.$toast.fail(message)
      }
    }
  }
}
</script>

<style lang="less" scoped>
// lang: 用于指定css语言 lang="less scss css"
// scoped: 作用域 当前组件的样式带了scoped,这个样式只会在当前组件生效
//scope的原理
//1、给当前模板中的所有元素都添加一个特殊的属性 data-v-xxxxx
//2、给当前组件样式中的所有的选择器增加一个属性选择器 div[data-v-xxx] .tips[data-v-xxx]
.tips {
  font-size: 16px;
  text-align: right;
  padding: 15px;
  a {
    color: orange;
  }
}
</style>
