<template>
  <div class="p-20">
    <div style="width: 200px;">
      <SelectWithPopup
        :values.sync="valueList"
        :labels.sync="labelList"
        :dict="dict"
      />
      <div>
        {{ showSelected }}
      </div>
    </div>
  </div>
</template>

<script>
import SelectWithPopup from '@/components/select-with-popup'
export default {
  components: {
    SelectWithPopup
  },
  data () {
    return {
      valueList: ['a', 'b', 'c'],
      labelList: ['张伟', '刘洋', '王芳'],
      selectList: [],
      dict: [
        { label: '张伟', value: 'a' },
        { label: '刘洋', value: 'b' },
        { label: '王芳', value: 'c' },
        { label: '陈昊', value: 'd' },
        { label: '朱迪', value: 'e' },
        { label: '兰阳', value: 'f' }
      ]
    }
  },
  computed: {
    showSelected () {
      const selectList = this.valueList.map((id, index) => {
        return {
          label: this.labelList[index],
          value: id
        }
      })
      return JSON.stringify(selectList, null, 2)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
