<template>
  <div class="mycomment">
    <hm-header>我的评论</hm-header>
    <div class="list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div iv class="item" v-for="item in commentList" :key="item.id">
            <div class="time">{{item.create_date |time('YYYY-MM-DD hh:mm')}}</div>
            <div class="comment" v-if="item.parent">
              <div class="name">回复:{{item.parent.user.nickname}}</div>
              <div class="comment_content">{{item.parent.content}}</div>
            </div>
            <div class="content">{{item.content}}</div>
            <div class="origin">
              <span class="one-txt-cut" @click="$router.push(`/post-detail/${item.post.id}`)">原文:{{item.post.title}}</span>
              <span class="iconfont iconjiantou1"></span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存放跟帖的数据
      commentList: [],
      // 刷新出的跟帖数据
      list: [],
      // 当前页
      pageIndex: 2,
      // 当页的条数
      pageSize: 6,
      // 代表加载状态，如果loading为true的时候，代表List组件正在加载数据，onLoad就不再触发
      // 当滚动到底部，触发onload的时候，自动会把loading改成true
      loading: false,
      finished: false,
      refreshing: false
      // 代表是否正在下拉刷新
      // 等数据加载完成,需要把下拉刷新改成false
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    // 发请求
    async getCommentList() {
      const res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentList = [...this.commentList, ...data]
        console.log(this.commentList)

        // 把loading 改成false，加载完成了
        this.loading = false

        // 把下拉的状态改成false
        this.refreshing = false

        // 判断如果没有更多的数据了，需要把finished改成true
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    onLoad() {
      setTimeout(() => {
        this.pageIndex++
        this.getCommentList()
      }, 1000)
    },
    onRefresh() {
      setTimeout(() => {
        console.log('下拉刷新中')
        // 下拉刷新需清除原来的数据
        this.commentList = []
        // 防止之前已经没数据了
        this.finished = false
        this.loading = true
        // 重新加载第一页的数据
        this.pageIndex = 1
        // 发送请求渲染数据
        this.getCommentList()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.list {
  .item {
    border-bottom: 1px solid #ccc;
    padding: 10px 20px;
    .time {
      padding: 10px 0;
      color: #999;
      font-size: 16px;
    }
    .comment {
      background-color: #ddd;
      padding: 15px;
      .name {
        color: #666;
        font-size: 14px;
      }
      .comment_content {
        color: #999;
        line-height: 30px;
        margin-top: 10px;
        font-size: 16px;
      }
    }
    .content {
      font-size: 16px;
      margin: 10px 0;
    }
    .origin {
      color: #999;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
