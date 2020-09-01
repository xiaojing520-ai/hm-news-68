<template>
  <div class="hm-navitem" @click="clickFn">
    <div class="title"><slot></slot></div>
    <div class="content"><slot name="content"></slot></div>
    <div class="arrow">
      <span class="iconfont iconjiantou1"></span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    clickFn() {
      // console.log(this.to)
      if (this.to) {
        this.$router.push(this.to)
      }

      // 触发click事件
      this.$emit('click')
    }
  },
  props: {
    to: String
  }
}
</script>

<style lang="less" scoped>
.hm-navitem {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  height: 50px;
  padding-right: 15px;
  margin-left: 15px;
  font-size: 14px;
  .content {
    flex: 1;
    text-align: right;
    color: rgb(149, 143, 143);
    font-size: 12px;
  }
  .arrow {
    padding-left: 10px;
  }
}
</style>
