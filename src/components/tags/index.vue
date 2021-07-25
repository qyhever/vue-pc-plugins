<template>
  <div class="tags">
    <TagList :list="sliceList" />
    <el-popover
      v-if="popoverVisible"
      placement="top-start"
      trigger="hover"
      popper-class="tags-popover"
    >
      <el-tag slot="reference" size="small">
        ...
      </el-tag>
      <TagList :list="list" />
    </el-popover>
  </div>
</template>

<script>

const TagList = {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  render () {
    const { list } = this
    return (
      <div class="tag-list">
        {list.map((item, index) => (
          <el-tag class="tag-item" key={index} size="small">
            {item.text}
          </el-tag>
        ))}
      </div>
    )
  }
}

export default {
  components: {
    TagList
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    max: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {}
  },
  computed: {
    sliceList () {
      return this.list.slice(0, this.max)
    },
    popoverVisible () {
      return this.list.length > this.max
    }
  },
  methods: {}
}
</script>

<style lang="scss">
  .tags {
    .tag-list {
      display: inline-block;
    }
    .tag-item {
      margin-right: 10px;
    }
  }
  .tags-popover {
    max-width: 80%;
    padding-bottom: 0;
    .tag-item {
      margin-right: 10px;
      margin-bottom: 12px;
    }
  }
</style>
