<template>
  <div ref="father">
    <div class="hm-sticky" ref="sticky">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/*
 获取吸顶盒子距离可视区顶部的距离，如果小于等于0,说明吸顶盒子就需要固定定位，如果大于0,取消定位
 */
export default {
  // 获取dom
  mounted() {
    // const father = this.$refs.father
    // // const sticky = this.$refs.sticky
    // const rect = father.getBoundingClientRect()
    // console.log(rect.top)
    window.addEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll() {
      const father = this.$refs.father
      const sticky = this.$refs.sticky
      const rect = father.getBoundingClientRect()
      if (rect.top <= 0) {
        sticky.classList.add('van-sticky--fixed')
        father.style.height = sticky.offsetHeight + 'px'
      } else {
        sticky.classList.remove('van-sticky--fixed')
        father.style.height = ''
      }
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll)
  }
}
</script>

<style lang="less" scoped>
.van-sticky--fixed {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 99;
}
</style>
