<template>
  <el-select
    v-model="value"
    style="width: 360px"
    clearable
    filterable
    remote
    reserve-keyword
    :popper-append-to-body="false"
    placeholder="输入关键词搜索"
    :remote-method="remoteMethod"
    :loading="loading"
    @clear="onClear"
  >
    <el-option
      v-for="(item, index) in list"
      :key="index"
      :label="item.text"
      :value="item.text"
    />
  </el-select>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      loading: false,
      list: [],
      defaultList: [],
      value: ''
    }
  },
  mounted () {
    axios({
      url: '/api/mock/users'
    })
      .then(res => {
        this.defaultList = res.data
        this.list = res.data
      })
  },
  methods: {
    onClear () {
      this.list = this.defaultList.slice()
    },
    remoteMethod (value) {
      if (!value) {
        this.list = this.defaultList.slice()
        return
      }
      this.loading = true
      axios({
        url: '/api/mock/users',
        params: {
          keyword: value
        }
      })
        .then(res => {
          this.list = res.data
        })
        .catch(console.log)
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
