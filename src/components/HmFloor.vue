<template>
  <div>
    <!-- <hm-floor @reply="replyFn" :count="count - 1" :comment="comment.parent" v-if="comment.parent"></hm-floor> -->
    <hm-floor :count="count-1" :comment="comment.parent" v-if="comment.parent"></hm-floor>
    <div class="hm-floor">
      <div class="title">
        <div class="left">{{count}}.{{comment.user.nickname}}</div>
        <div class="center">{{comment.create_date | now}}</div>
        <div class="right" @click="reply">回复</div>
      </div>
      <div class="content">{{comment.content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hm-floor',
  props: {
    comment: Object,
    count: Number
  },
  methods: {
    reply() {
      // this.$emit('reply', this.comment.id, this.comment.user.nickname)
      this.$bus.$emit('reply', this.comment.id, this.comment.user.nickname)
    }
    // replyFn(id, nickname) {
    //   this.$emit('reply', id, nickname)
    // }
  }
}
</script>

<style lang="less" scoped>
.hm-floor {
  margin-top: -1px;
  padding: 10px;
  border: 1px solid pink;
  .title {
    display: flex;
    align-items: center;
    .left {
      font-size: 16px;
    }
    .center {
      flex: 1;
      font-size: 14px;
      padding-left: 10px;
    }
    .right {
      font-size: 14px;
      color: #999;
    }
  }
  .content {
    font-size: 16px;
    margin-top: 10px;
  }
}
</style>
