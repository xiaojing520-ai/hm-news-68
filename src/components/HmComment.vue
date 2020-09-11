<template>
  <div class="comment-list">
    <div class="title">
      <div class="left">
        <img :src="$base + comment.user.head_img" alt />
      </div>
      <div class="center">
        <p>{{comment.user.nickname}}</p>
        <p>{{comment.create_date | now}}</p>
      </div>
      <div class="right" @click="reply">回复</div>
    </div>
    <hm-floor @reply="onReply" :count="count" :comment="comment.parent" v-if="comment.parent"></hm-floor>
    <div class="content">{{comment.content}}</div>
  </div>
</template>

<script>
export default {
  props: {
    comment: Object
  },
  data() {
    return {
      count: this.getCount(0, this.comment)
    }
  },
  methods: {
    getCount(num, data) {
      if (data.parent) {
        return this.getCount(num + 1, data.parent)
      } else {
        return num
      }
    },
    reply() {
      // 把id和nickname传给父组件
      // console.log(this.comment.id, this.comment.user.nickname)
      // this.$emit('reply', this.comment.id, this.comment.user.nickname)
      this.$bus.$emit('reply', this.comment.id, this.comment.user.nickname)
    },
    onReply(id, nickname) {
      this.$emit('reply', id, nickname)
    }
  }
}
</script>

<style lang="less" scoped>
.comment-list {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .title {
    display: flex;
    margin-bottom: 10px;
    .left {
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .center {
      flex: 1;
      font-size: 14px;
      padding-left: 10px;
      p {
        line-height: 24px;
        &:first-child {
          font-size: 16px;
        }
      }
    }
    .right {
      font-size: 16px;
      color: #666;
    }
  }
  .content {
    margin-top: 10px;
    font-size: 16px;
    padding: 5px;
  }
}
</style>
