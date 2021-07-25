<template>
  <div class="page">
    <Tags :list="list1" />
    <div class="pad" />
    <Tags :list="list2" />
  </div>
</template>

<script>
import Tags from '@/components/tags'
export default {
  components: {
    Tags
  },
  data () {
    return {
      list1: Array(3).fill(null).map((_, index) => ({ text: '标签' + (index + 1) })),
      list2: Array(100).fill(null).map((_, index) => ({ text: '标签' + (index + 1) }))
    }
  }
}
</script>

<style lang="scss">
  .pad {
    height: 12px;
  }
</style>
