<template>
  <div class="p-20">
    <div style="width: 200px; margin-bottom: 20px;">
      <RemoteStaffSelect
        :selected-value.sync="value"
        :selected-label.sync="label"
      />
    </div>
    <div style="width: 200px;">
      <RemoteStaffSelect
        :selected-value.sync="valueList"
        :selected-label.sync="labelList"
        multiple
      />
      <div>
        {{ showSelected }}
      </div>
    </div>
  </div>
</template>

<script>
import RemoteStaffSelect from '@/components/remote-staff-select'

export default {
  components: {
    RemoteStaffSelect
  },
  data () {
    return {
      value: '',
      label: '',
      valueList: [],
      labelList: [],
      // valueList: ['a', 'b', 'c'],
      // labelList: ['张伟', '刘洋', '王芳'],
      selectList: []
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
