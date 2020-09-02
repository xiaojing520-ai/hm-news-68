<template>
  <div>
    <div class="placeholder"></div>
    <div class="hm-header">
      <div class="back" @click="back">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="title">
        <slot></slot>
      </div>
      <div class="extra"></div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less">
.placeholder {
  height: 50px;
  width: 100%;
}
.hm-header {
  position: fixed;
  width: 100%;
  top: 0;
  display: flex;
  background-color: #fff;
  z-index: 999;
  height: 50px;
  border-bottom: 1px solid #ccc;
  text-align: center;
  line-height: 50px;
  .back,
  .extra {
    width: 50px;
  }
  .title {
    flex: 1;
    font-weight: 500;
    font-size: 18px;
  }
}
</style>
