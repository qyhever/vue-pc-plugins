<template>
  <div>
    <ul>
      <li
        v-for="(item, index) in list"
        :key="index"
        class="item"
      >
        <div class="number">{{index + 1}}</div>
        <img class="image" :src="item.imgurl">
        <div class="desc">{{item.dissname}}</div>
      </li>
    </ul>
    <p v-show="list.length && isTotalLoaded && currentScrollTop" class="loading-placeholder">没有更多数据了！</p>
    <p v-show="list.length && isReachBottom" class="loading-placeholder">拼命加载中...</p>
    <BackTop/>
  </div>
</template>

<script>
import axios from 'axios'
import { infiniteScroll } from '@/mixins'
import BackTop from '@/components/backtop'
export default {
  components: {
    BackTop
  },
  mixins: [infiniteScroll],
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    query() {
      axios({
        url: 'https://qyhever.com/common/disc',
        params: {
          page: this.pager.currentPage,
          size: this.pager.pageSize
        }
      })
        .then(res => {
          const { list, total } = res.data.data
          if (this.pager.currentPage === 1) {
            this.list = list
          } else {
            this.list = this.list.concat(list)
          }
          this.endBySize(total)
        })
        .catch(() => {
          this.endScroll()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .item {
    display: flex;
    align-items: center;
    padding: 25px;
  }
  .number {
    flex: 0 0 60px;
    text-align: center;
  }
  .image {
    width: 48px;
    flex: 0 0 48px;
    height: 48px;
    border-radius: 4px;
  }
  .desc {
    margin-left: 20px;
  }
  .loading-placeholder {
    padding: 12px;
    text-align: center;
    color: #1890ff;
  }
</style>
