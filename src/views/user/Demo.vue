<template>
  <div class="demo">
    <van-button type="primary" @click="crop">裁剪</van-button>
    <!--
      img: 指定裁剪图片
      autoCrop:是否默认生成裁剪框
      autoCropWidth="150"
      autoCropHeight="150" 指定裁剪框宽高
      fixed： 固定裁剪框的宽高比
      :fixedNumber="[2,1]"
      fixedBox : 不能调整大小
     -->
    <vue-cropper
      ref="cropper"
      autoCrop
      autoCropWidth="150px"
      autoCropHeight="150px"
      fixed
      img="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1835845522,1643506290&fm=26&gp=0.jpg"
    ></vue-cropper>
  </div>
</template>

<script>
// 1. 注意给父盒子指定宽高
// 2. 不能直接引入本地的图片
import { VueCropper } from 'vue-cropper'
export default {
  components: {
    VueCropper
  },
  methods: {
    crop() {
      //   // 获取截图的base64 数据     直接显示出来
      //   this.$refs.cropper.getCropData(data => {
      //     // do something
      //     console.log(data)
      //   })
      // 获取截图的blob数据  可以上传到服务器
      this.$refs.cropper.getCropBlob(data => {
        // do something
        console.log(data)
      })
    }
  }
}
</script>

<style lang="less">
.demo {
  width: 100%;
  height: 100%;
  position: fixed;
}
</style>
