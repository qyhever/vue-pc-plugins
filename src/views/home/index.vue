<template>
  <div class="p-20">
    <ul class="nav-list">
      <li
        v-for="(item, index) in navs"
        :key="index"
        class="nav-item"
      >
        <router-link :to="item.value" class="nav-item-link">
          {{ item.label }}
        </router-link>
      </li>
    </ul>
    <!-- <el-image src="https://qyhever.oss-cn-beijing.aliyuncs.com/88b4bd4b3300.jpg" alt="avatar" /> -->
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      navs: [
        { label: 'quick-day', value: '/date-picker/quick-day' },
        { label: 'quick-month', value: '/date-picker/quick-month' },
        { label: 'tags', value: '/tags' },
        { label: 'ellipsis-text', value: '/ellipsis-text' },
        { label: 'remote-select', value: '/remote-select' },
        { label: 'vue-preview', value: '/vue-preview' },
        { label: 'lightgallery', value: '/lightgallery' },
        { label: 'drag-table', value: '/drag-table' },
        { label: 'scroll-nav', value: '/scroll-nav' },
        { label: 'sticky-header', value: '/sticky-header' },
        { label: 'infinite-scroll', value: '/infinite-scroll' },
        { label: 'calendar', value: '/calendar' },
        { label: 'amap', value: '/amap' },
        { label: 'amap-ui', value: '/amap-ui' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .nav-list {
    width: 400px;
    margin: 0 auto;
  }
  .nav-item {
    padding: 10px 0;
  }
  .nav-item-link {
    color: #2e3135;
    font-size: 16px;
    font-weight: 700;
    &:hover {
      text-decoration: underline;
    }
  }
</style>
