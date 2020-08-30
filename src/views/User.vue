<template>
  <div class="user">
    <header>
      <div class="avatar">
        <img :src="$axios.defaults.baseURL + user.head_img" alt />
      </div>
      <div class="info">
        <div class="name">
          <!-- <span v-if="user.gender === 1" class="iconfont iconxingbienan"></span> -->
          <!-- <span v-else class="iconfont iconxingbienv"></span> -->
          <span class="iconfont" :class="user.gender === 1 ? 'iconxingbienan' : 'iconxingbienv'"></span>
          <span>{{ user.nickname }}</span>
        </div>
        <div class="time">{{ user.create_date | time }}</div>
      </div>
      <div class="arrow">
        <span class="iconfont iconjiantou1"></span>
      </div>
    </header>
    <!-- 导航条 -->
    <hm-navitem to="/follow">
      <template>我的关注</template>
      <template #content>关注的用户</template>
    </hm-navitem>
    <hm-navitem>
      <template>我的跟帖</template>
      <template #content>跟帖/回复</template>
    </hm-navitem>
    <hm-navitem>
      <template>我的收藏</template>
      <template #content>文章/视频</template>
    </hm-navitem>
    <hm-navitem to="/edit">设置</hm-navitem>
    <div style="margin: 15px;">
      <van-button type="info" block @click="logout">退出</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: ''
    }
  },
  async created() {
    // 拿到userId
    const userId = localStorage.getItem('userId')
    console.log(userId)
    // 一进入页面就发请求 userId拼到url里  并设置请求头  传token
    const res = await this.$axios.get(`/user/${userId}`)
    // console.log(res.data)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.user = data
    }
  },
  methods: {
    async logout() {
      try {
        // 弹出提示
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '你确定要退出本系统吗'
        })
      } catch {
        return this.$toast('取消退出')
      }
      // 说明点了确定
      // console.log('确定')
      // 删除token userId  跳回login
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      this.$router.push('/login')
      this.$toast('退出成功')
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  header {
    display: flex;
    align-items: center;
    padding: 25px 15px;
    border-bottom: 3px solid #ddd;
    .avatar {
      width: 70px;
      height: 70px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .info {
      flex: 1;
      padding-left: 15px;
      .name {
        font-size: 14px;
        .iconxingbienan {
          color: skyblue;
          padding-right: 5px;
        }
        .iconxingbienv {
          color: pink;
          padding-right: 5px;
        }
      }
      .time {
        font-size: 14px;
        margin-top: 10px;
        color: rgb(138, 135, 135);
      }
    }
  }
}
</style>
