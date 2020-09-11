<template>
  <div class="manage">
    <hm-header>栏目管理</hm-header>
    <div class="content">
      <div class="active">
        <div class="delete">点击删除以下频道(必须保留4项以上)</div>
        <div class="list">
          <div
            class="item"
            v-for="item in activeList"
            :key="item.id"
            @click="delTab(item.id)"
          >{{item.name}}</div>
        </div>
      </div>
      <div class="deactive">
        <div class="add">点击添加以下频道</div>
        <div class="list">
          <div
            class="item"
            v-for="item in deactiveList"
            :key="item.id"
            @click="addTab(item.id)"
          >{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存放激活的栏目
      activeList: [],
      // 存放未激活的栏目
      deactiveList: []
    }
  },
  // 一跳到该页面就会发请求渲染数据
  async created() {
    // 在渲染的crated钩子函数中，优先从localStorage中获取数据，如果没有，发送请求获取
    // 先看缓存中有没有，有就优先缓存中的 activeList deactiveList
    const activeList = JSON.parse(localStorage.getItem('activeList'))
    const deactiveList = JSON.parse(localStorage.getItem('deactiveList'))
    if (activeList) {
      this.activeList = activeList
      this.deactiveList = deactiveList
      return
    }
    const res = await this.$axios.get('/category')
    console.log(res.data)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.activeList = data
      console.log(this.activeList)
    }
  },
  methods: {
    delTab(id) {
      if (this.activeList.length <= 4) return
      const index = this.activeList.findIndex((item) => item.id === id)
      // 1. 往未激活的栏目中添加
      this.deactiveList.push(this.activeList[index])
      // 2. 删除激活中的这个栏目
      this.activeList.splice(index, 1)
    },
    addTab(id) {
      const index = this.deactiveList.findIndex((item) => item.id === id)
      this.activeList.push(this.deactiveList[index])
      this.deactiveList.splice(index, 1)
    }
  },
  // 监听activeList数据的变化
  watch: {
    activeList: {
      deep: true,
      handler(value) {
        localStorage.setItem('activeList', JSON.stringify(this.activeList))
        localStorage.setItem('deactiveList', JSON.stringify(this.deactiveList))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 10px;
  .active {
    margin-bottom: 20px;
  }
  .delete,
  .add {
    font-size: 14px;
    color: #999;
    margin-bottom: 10px;
  }
  .active,
  .deactive {
    .list {
      overflow: hidden;
      .item {
        float: left;
        width: 60px;
        height: 30px;
        margin: 5px;
        font-size: 16px;
        text-align: center;
        line-height: 30px;
        border: 1px solid #ccc;
        background-color: #eee;
      }
    }
  }
}
</style>
