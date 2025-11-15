<template>
  <div class="p-20">
    <div style="width: 200px; margin-bottom: 20px;">
      <RemoteStaffSelect
        :selected-value.sync="value"
        :selected-label.sync="label"
      />
    </div>
    <div style="width: 200px; margin-bottom: 20px;">
      <RemoteStaffSelect
        :selected-value.sync="valueList"
        :selected-label.sync="labelList"
        multiple
      />
      <div>
        {{ showSelected }}
      </div>
    </div>
    <div style="width: 200px; margin-bottom: 20px;">
      <RemoteUserSelect
        :selected.sync="user"
      />
      <div>
        <pre>{{ showUser }}</pre>
      </div>
    </div>
    <div style="width: 200px; margin-bottom: 20px;">
      <RemoteUserSelect
        :selected.sync="users"
        multiple
      />
      <div>
        <pre>{{ showUsers }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import RemoteStaffSelect from '@/components/remote-staff-select'
import RemoteUserSelect from '@/components/remote-staff-select/user'

export default {
  components: {
    RemoteStaffSelect,
    RemoteUserSelect
  },
  data () {
    return {
      value: '',
      label: '',
      valueList: [],
      labelList: [],
      // valueList: ['a', 'b', 'c'],
      // labelList: ['张伟', '刘洋', '王芳'],
      selectList: [],
      user: {},
      users: [
        { userName: '张伟', userId: 'a', label: '张伟__a', value: '张伟__a' },
        { userName: '刘洋', userId: 'b', label: '刘洋__b', value: '刘洋__b' },
        { userName: '王芳', userId: 'c', label: '王芳__c', value: '王芳__c' }
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
    },
    showUser () {
      return JSON.stringify(this.user, null, 2)
    },
    showUsers () {
      return JSON.stringify(this.users, null, 2)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
