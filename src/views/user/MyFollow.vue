<template>
  <div class="my-follow">
    <hm-header>我的关注</hm-header>
    <div class="list" v-for="item in list" :key="item.id">
      <div class="left">
        <img :src="$base + item.head_img" alt="" />
      </div>
      <div class="center">
        <p>{{ item.nickname }}</p>
        <p>{{ item.create_date }}</p>
      </div>
      <div class="right">
        <van-button type="primary" size="small" round @click="unfollow(item.id)"
          >取消关注</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getFollowList()
  },
  methods: {
    async getFollowList() {
      const res = await this.$axios.get('/user_follows')
      //   console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
      }
    },
    async unfollow(id) {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '你确定要取消关注吗'
        })
      } catch {
        return this.$toast('取消操作')
      }

      // 确定取消 就发送请求取消关注 （携带需要取消用户的id）
      const res = await this.$axios.get(`/user_unfollow/${id}`)
      console.log(res.data)
      if (res.data.statusCode === 200) {
        this.$toast.success('取消关注成功')
        // 调用发送请求,渲染列表
        this.getFollowList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.list {
  display: flex;
  height: 100px;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
  .left {
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .center {
    flex: 1;
    padding: 0 20px;
    font-size: 18px;
  }
}
</style>
