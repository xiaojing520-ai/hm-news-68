<template>
  <div class="user-edit">
    <hm-header>编辑资料</hm-header>
    <!-- 头像 -->
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + user.head_img" alt />
      <van-uploader :after-read="afterRead" />
    </div>
    <hm-navitem @click="showNickname">
      <template>昵称</template>
      <template #content>{{ user.nickname }}</template>
    </hm-navitem>
    <hm-navitem @click="showPassword">
      <template>密码</template>
      <template #content>******</template>
    </hm-navitem>
    <hm-navitem @click="showGender">
      <template>性别</template>
      <template #content>{{ user.gender === 1 ? '男' : '女' }}</template>
    </hm-navitem>

    <!-- 渲染dialog组件 弹出框 -->
    <van-dialog
      v-model="isShowNickname"
      title="编辑昵称"
      show-cancel-button
      @confirm="updateNickname"
    >
      <van-field v-model="nickname" ref="nickname" placeholder="请输入用户名" />
    </van-dialog>
    <van-dialog
      v-model="isShowPassword"
      title="修改密码"
      show-cancel-button
      @confirm="updatePassword"
    >
      <van-field v-model="password" ref="password" placeholder="请输入密码" />
    </van-dialog>
    <van-dialog
      v-model="isShowGender"
      title="修改性别"
      show-cancel-button
      @confirm="updateGender"
    >
      <!-- <van-radio-group v-model="gender">
        <van-radio :name="1">男</van-radio>
        <van-radio :name="0">女</van-radio>
      </van-radio-group>-->
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <template #right-icon>
              <van-radio :name="1" />
            </template>
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <template #right-icon>
              <van-radio :name="0" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
    <!-- 裁剪模态框 -->
    <div class="mask" v-show="isShowmask">
      <van-button type="primary" class="crop" @click="crop">裁剪</van-button>
      <van-button type="danger" class="cancel" @click="isShowmask = false"
        >取消</van-button
      >
      <VueCropper
        ref="aa"
        :img="img"
        autoCrop
        autoCropWidth="100"
        autoCropHeight="100"
        fixed
      ></VueCropper>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  components: {
    VueCropper
  },
  data() {
    return {
      user: '',
      isShowNickname: false,
      nickname: '',
      isShowPassword: false,
      password: '',
      isShowGender: false,
      gender: 1,
      isShowmask: false,
      img: ''
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      const userId = localStorage.getItem('userId')
      const res = await this.$axios.get(`/user/${userId}`)
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.user = data
      }
    },
    async showNickname() {
      this.isShowNickname = true
      this.nickname = this.user.nickname
      // 等待DOM更新
      await this.$nextTick()
      // 需要自动获取焦点
      this.$refs.nickname.focus()
    },
    async updateUser(data) {
      const userId = localStorage.getItem('userId')
      const res = await this.$axios.post(`/User_update/${userId}`, data)
      if (res.data.statusCode === 200) {
        // 重新渲染
        this.getUserInfo()
        this.$toast.success('修改成功')
      }
    },
    async updateNickname() {
      // const userId = localStorage.getItem('userId')
      // const res = await this.$axios.post(`/user_update/${userId}`, {
      //   nickname: this.nickname
      // })
      // //   console.log(res.data)
      // if (res.data.statusCode === 200) {
      //   // 渲染页面
      //   this.getUserInfo()
      //   this.$toast.success('修改成功')
      // }
      this.updateUser({
        nickname: this.nickname
      })
    },
    async showPassword() {
      this.isShowPassword = true
      this.password = this.user.password
      await this.$nextTick()
      this.$refs.password.focus()
    },
    async updatePassword() {
      // console.log('123')
      // const userId = localStorage.getItem('userId')
      // const res = await this.$axios.post(`/user_update/${userId}`, {
      //   password: this.password
      // })
      // // console.log(res.data)
      // if (res.data.statusCode === 200) {
      //   // 重新渲染
      //   this.getUserInfo()
      //   this.$toast.success('修改成功')
      // }
      this.updateUser({
        password: this.password
      })
    },
    showGender() {
      this.isShowGender = true
      this.gender = this.user.gender
    },
    updateGender() {
      this.updateUser({
        gender: this.gender
      })
    },
    isImg(name) {
      if (
        name.endsWith('.gif') ||
        name.endsWith('.jpg') ||
        name.endsWith('.png') ||
        name.endsWith('.jpeg')
      ) {
        return true
      } else {
        return false
      }
    },
    afterRead(file) {
      // 校验图片的类型和大小，如果满足才上传，不满足，给个提示
      console.log(file)
      if (!this.isImg(file.file.name)) {
        return this.$toast.fail('请上传正确的图片')
      }
      if (file.file.size >= 2000 * 1024) {
        return this.$toast.fail('上传图片太大')
      }
      // 显示裁剪框
      this.isShowmask = true
      // 设置裁剪的图片
      this.img = file.content

      // // 此时可以自行将文件上传至服务器
      // console.log('文件读取完毕', file)
      // // 发送请求上传文件
      // // 如果是通过axios上传文件，请求体不能是一个普通对象，必须是一个formData对象
    },
    crop() {
      this.$refs.aa.getCropBlob(async Blob => {
        console.log(Blob)
        // 裁剪后上传文件

        // 创建一个空的formData对象
        const fd = new FormData()
        // 给formData对象添加上传的文件
        fd.append('file', Blob)
        // 上传文件
        const res = await this.$axios.post('/upload', fd)
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          console.log(data.url)
          // 页面上的头像还没改，再发请求修改头像
          this.updateUser({
            head_img: data.url
          })
        }
        // 隐藏裁剪框
        this.isShowmask = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  padding: 40px 0;
  text-align: center;
  position: relative;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .van-uploader {
    position: absolute;
    left: 50%;
    top: 40px;
    transform: translate(-50%);
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}
/deep/.van-dialog__content {
  padding: 15px;
  .van-field {
    border: 1px solid #ccc;
  }
}

.mask {
  width: 100%;
  height: 100%;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  .crop,
  .cancel {
    position: fixed;
    z-index: 1;
  }
  .cancel {
    right: 0;
  }
}
</style>
