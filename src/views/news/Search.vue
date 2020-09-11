<template>
  <div class="search">
    <div class="header">
      <div class="left" @click="goBack">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="center">
        <input
          type="search"
          placeholder="请输入搜索关键字"
          v-model="key"
          @keyup.enter="search"
          @input="recommend"
        />
        <span class="iconfont iconsearch"></span>
      </div>
      <div class="right" @click="search">搜索</div>
    </div>
    <div class="recommend-list" v-if="recommendList.length">
      <div
        class="item one-txt-cut"
        v-for="item in recommendList"
        :key="item.id"
        @click="goSearch(item.title)"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="list" v-else-if="list.length">
      <hm-post v-for="item in list" :key="item.id" :post="item"></hm-post>
    </div>
    <div class="content" v-else>
      <div class="history">
        <h3>历史记录</h3>
        <div class="list">
          <div
            class="item one-txt-cut"
            v-for="item in history"
            :key="item"
            @click="goSearch(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="hot">
        <h3>热门搜索</h3>
        <div class="list">
          <div
            class="item"
            v-for="item in hot"
            :key="item"
            @click="goSearch(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import { debounce } from '../../utils/tool'
export default {
  data() {
    return {
      key: '',
      // 存放搜索结果
      list: [],
      // 存关键字
      history: [],
      hot: [],
      recommendList: []
    }
  },
  // 页面一进来要从缓存中拿到history数据
  created() {
    this.history = JSON.parse(localStorage.getItem('history')) || []
    // 假设发送请求，获取到了数据
    this.hot = ['关晓彤', '华为', '情火', '姑娘']
  },
  methods: {
    async search() {
      console.log(123)
      if (!this.key) return this.$toast('请输入搜索关键字')
      const res = await this.$axios.get('post_search', {
        params: {
          keyword: this.key
        }
      })
      console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
        console.log(this.list)
      }

      // 把key添加到缓存中
      //   1、如果原来有这个历史记录，删除即可
      //   2、添加到数组的前面
      //   3、将history存到缓存中
      // 过滤出新的数组 ，  不等于key的项
      this.history = this.history.filter(item => item !== this.key)
      this.history.unshift(this.key)
      localStorage.setItem('history', JSON.stringify(this.history))

      // 点搜索的时候，recommentList就为空
      this.recommendList = []
    },
    // 回退功能1、当搜索框有关键字时，则回退到搜索页面，通过清空list来操作
    //        2、当搜索框没有关键字，则回退到首页，通过this.$router.back()来操作
    goBack() {
      if (this.key) {
        this.key = ''
      } else {
        this.$router.back()
      }
    },
    goSearch(item) {
      this.key = item
      this.search()
    },
    //  _.debounce(async function()  导入lodash的用法
    recommend: debounce(async function() {
      if (this.key === '') return
      const res = await this.$axios.get('/post_search_recommend', {
        params: {
          keyword: this.key
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.recommendList = data
        console.log('this.recommendList')
      }
      console.log(res)
    }, 1000)
  },
  watch: {
    // 监听是否有关键字
    key(value) {
      if (value === '') {
        // 如果关键字为空，则清空list的数据，不渲染
        this.list = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  position: relative;
  .header {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 50px;
    border-bottom: 1px solid #ccc;
    .center {
      position: relative;
      flex: 1;
      padding: 0 10px;
      input {
        width: 100%;
        height: 34px;
        line-height: 34px;
        border-radius: 17px;
        border: 1px solid #ccc;
        font-size: 14px;
        padding-left: 36px;
      }
      .iconfont {
        position: absolute;
        top: 10px;
        left: 24px;
      }
    }
    .right {
      font-size: 14px;
    }
  }
  .clear {
    height: 16px;
    padding: 0 20px;
    text-align: right;
  }
  .content {
    padding: 0 10px;
    .history {
      margin-bottom: 20px;
    }
    h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 10px 0;
    }
    .list {
      overflow: hidden;
      .item {
        width: 60px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        margin: 5px;
        background-color: #ddd;
        float: left;
        font-size: 14px;
      }
    }
  }
  .recommend-list {
    padding: 10px;
    .item {
      font-size: 16px;
      border-bottom: 1px solid #ccc;
      padding: 5px 0;
    }
  }
}
</style>
