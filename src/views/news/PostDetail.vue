<template>
  <div class="post-detail" v-if="isLoaded">
    <div class="header">
      <div class="left" @click="$router.back()">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="center">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="right">
        <div class="followed" v-if="post.has_follow" @click="unfollow">已关注</div>
        <div class="follow" v-else @click="follow">关注</div>
      </div>
    </div>
    <div class="content">
      <div class="title">{{post.title}}</div>
      <div class="name">
        <span>{{post.user.nickname}}</span>
        <span>{{post.create_date | time}}</span>
      </div>
      <div v-if="post.type === 1" class="info" v-html="post.content"></div>
      <video v-else :src="getUrl(post.content)" controls autoplay muted></video>
      <div class="button">
        <div class="good" @click="like" :class="{active: post.has_like}">
          <span class="iconfont icondianzan"></span>
          <span>{{post.like_length||0}}</span>
        </div>
        <div class="share">
          <span class="iconfont iconweixin"></span>
          <span>微信</span>
        </div>
      </div>
    </div>
    <!-- 评论 -->
    <div class="comment-list">
      <h3>精彩跟帖</h3>
      <hm-comment
        :comment="comment"
        v-for="comment in commentList"
        :key="comment.id"
        @reply="onReply"
      ></hm-comment>
    </div>

    <div class="footer-textarea" v-if="isShowTextarea">
      <textarea @blur="onBlur" :placeholder="'回复：'+ nickname" ref="textarea" v-model="content"></textarea>
      <van-button round type="danger" @click="publish">发送</van-button>
    </div>
    <div class="footer-input" v-else>
      <div class="search">
        <input type="text" placeholder="回复" @focus="onFocus" />
      </div>
      <div class="utils">
        <span class="iconfont iconpinglun-">
          <i>123</i>
        </span>
        <span class="iconfont iconshoucang" :class="{now: post.has_star}" @click="star"></span>
        <span class="iconfont iconfenxiang"></span>
      </div>
    </div>
  </div>
  <div class="loading" v-else></div>
</template>

<script>
export default {
  data() {
    return {
      // 数据是否加载完成
      isLoaded: false,
      post: {
        user: ''
      },
      commentList: [],
      isShowTextarea: false,
      content: '',
      nickname: '',
      replyId: ''
    }
  },
  created() {
    this.getInfo()
    // 获取文章的评论列表 因为两个都是异步代码 同时进行互不影响，所以文章的id要通过地址栏中拿到this.$route.params.id，不能通过this.post.id 拿，因为此时getInfo也在执行，还没拿到post
    this.getCommentList()

    // 给bus注册自定义事件
    this.$bus.$on('reply', this.onReply)
  },
  // 用bus 会造成每次跳出页面就会销毁数据，在进入点击回复的时候，会多次创建$bus.$on, $bus.$on是不会被覆盖的，所以要在销毁阶段也要移除$bus
  destroyed() {
    console.log('detail销毁')
    // 移除$bus的自定义事件off
    // this.$bus.$off() 移除bus上的所有事件
    // this.$bus.$off('reply') 移除bus上所有的reply事件
    // this.$bus.$off('reply', this.onReply) 移除bus上一个reply事件。。。对应的这个函数就是需要移除的
    this.$bus.$off('reply', this.onReply)
  },
  methods: {
    // 封装了一个函数，用来判断没有登录
    noLogin() {
      const token = localStorage.getItem('token')
      if (!token) {
        this.$router.push({
          path: '/login',
          query: {
            back: true
          }
        })
        // 代表没有登录
        return true
      } else {
        // 代表登录了
        return false
      }
    },
    async getInfo() {
      // console.log(this.$route.params)
      const { id } = this.$route.params
      const res = await this.$axios.get(`/post/${id}`)
      // console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.post = data
        // console.log(this.post)
        this.isLoaded = true
      }
    },
    getUrl(url) {
      const div = document.createElement('div')
      div.innerHTML = url
      return div.innerText
    },
    // 关注
    async follow() {
      // 如果没登录，则会跳转login页面登录，登录后跳回
      if (this.noLogin()) return
      // 如果登录了，直接发送ajax请求，进行关注了
      // 发送ajax请求，进行关注
      console.log('发送请求进行关注')
      const res = await this.$axios.get(`/user_follows/${this.post.user.id}`)
      console.log(res.data)
      if (res.data.statusCode === 200) {
        this.$toast.success('关注成功')
        // 重新向后台发送请求拿更新后的文章， 进行渲染页面
        this.getInfo()
      }
    },
    // 取消关注
    async unfollow() {
      // 发送请求，取消关注
      const res = await this.$axios.get(`/user_unfollow/${this.post.user.id}`)
      console.log(res.data)
      const { statusCode } = res.data
      if (statusCode === 200) {
        this.$toast.success('取消关注成功')
        // 重新加载数据渲染页面
        this.getInfo()
      }
    },
    // 点赞
    async like() {
      /*
      1、判断是否登录
      2、如果没有登录，需要调回登录页
      3、如果登陆了则需要发送请求，渲染数据
       */
      if (this.noLogin()) return
      const res = await this.$axios.get(`/post_like/${this.post.id}`)
      console.log(res.data)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      }
    },
    async star() {
      if (this.noLogin()) return
      const res = await this.$axios.get(`/post_star/${this.post.id}`)
      console.log(res.data)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      }
    },
    async getCommentList() {
      // 文章的id要通过地址栏中拿到this.$route.params.id
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post_comment/${id}`)
      console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentList = data
        console.log(this.commentList)
      }
    },
    // 当input框获取焦点，需要显示textarea
    async onFocus() {
      this.isShowTextarea = true
      // 等待DOM更新
      await this.$nextTick()
      // 让textarea自动获取焦点
      console.log(this.$refs.textarea) // 先获取textarea的DOM对象
      this.$refs.textarea.focus()
    },
    // 发布评论
    async publish() {
      const res = await this.$axios.post(`/post_comment/${this.post.id}`, {
        content: this.content,
        parent_id: this.replyId
      })
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getCommentList()
        this.content = ''
        this.replyId = ''
        this.nickname = ''
        this.isShowTextarea = false
      }
    },
    // 回复评论 数据nickname回显
    async onReply(id, nickname) {
      console.log('父组件', id, nickname)
      this.isShowTextarea = true
      await this.$nextTick() // 等DOM更新后
      this.$refs.textarea.focus() // 获取textarea的DOM对象，添加focus方法
      // 回显nickname
      this.nickname = '@' + nickname
      this.replyId = id
    },
    onBlur() {
      if (!this.content) {
        this.isShowTextarea = false
        this.replyId = ''
        this.nickname = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.post-detail {
  padding-bottom: 50px;
}
.header {
  display: flex;
  height: 50px;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid #ccc;
  .left {
    span {
      line-height: 50px;
    }
  }
  .center {
    flex: 1;
    padding-left: 10px;
    span {
      font-size: 60px;
    }
  }
  .right {
    font-size: 14px;
    div {
      width: 60px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 15px;
    }
    .follow {
      background-color: #f00;
      color: #fff;
    }
    .followed {
      border: 1px solid #ccc;
    }
  }
}
.content {
  padding: 10px;
  border-bottom: 3px solid #ccc;
  .title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .name {
    font-size: 14px;
    margin: 10px 0;
    color: #666;
    span:first-child {
      padding-right: 20px;
    }
  }
  .info {
    font-size: 14px;
    /deep/img {
      width: 100%;
    }
  }
  video {
    width: 100%;
  }
  .button {
    display: flex;
    padding: 20px 0;
    justify-content: space-around;
    div {
      width: 100px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 18px;
      border-radius: 20px;
      border: 1px solid #ccc;
      .iconfont {
        padding-right: 10px;
      }
      .iconweixin {
        color: rgb(47, 206, 47);
      }
    }
    .active {
      color: red;
      border-color: red;
    }
  }
}
.comment-list {
  h3 {
    font-size: 22px;
    font-weight: normal;
    text-align: center;
    padding: 10px 0;
  }
}
.footer-input {
  background-color: #fff;
  display: flex;
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
  border-top: 1px solid #ccc;

  .iconfont {
    font-size: 24px;
    padding: 10px;
  }
  .iconpinglun- {
    position: relative;
    i {
      position: absolute;
      top: 0;
      right: 0;
      font-style: normal;
      font-size: 10px;
      background-color: red;
      color: #fff;
      padding: 0 3px;
      border-radius: 5px;
    }
  }
  .now {
    color: red;
  }
  .search {
    width: 180px;
    padding-right: 10px;
    input {
      width: 100%;
      height: 30px;
      border-radius: 15px;
      border: none;
      font-size: 16px;
      padding-left: 20px;
      background-color: #ddd;
    }
  }
}
.footer-textarea {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100px;
  background-color: #fff;
  display: flex;
  align-items: flex-end;
  border-top: 1px solid #ccc;
  justify-content: space-around;
  padding: 10px;
  z-index: 999;
  textarea {
    width: 260px;
    height: 80px;
    background-color: #ddd;
    border-radius: 10px;
    padding: 10px;
    font-size: 14px;
    border: none;
  }
  .van-button--normal {
    height: 30px;
    padding: 0 16px;
  }
}
</style>
