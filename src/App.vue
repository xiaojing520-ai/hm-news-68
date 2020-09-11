<template>
  <div id="app">
    <!-- keep-alive 被keep-alive包裹的组件都会被缓存下来，不会被销毁 -->
    <!-- include只有名称匹配的组件会被缓存下来 -->
    <keep-alive include="index">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less"></style>
