<template>
  <div class="p-20">
    <el-table
      ref="dragTable"
      :data="list"
    >
      <el-table-column align="center" label="名字" prop="name" />
      <el-table-column align="center" label="年龄" prop="age" />
      <el-table-column align="center" label="性别" prop="sex" />
      <el-table-column align="center" label="操作">
        <template>
          <el-button size="small" type="primary" round>
            编辑
          </el-button>
          <el-button size="small" type="primary" round>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      defaultIdList: {{ defaultIdList }}
    </div>
    <div>
      asyncIdList: {{ asyncIdList }}
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  name: 'DragTable',
  data () {
    return {
      list: [],
      defaultIdList: [],
      asyncIdList: []
    }
  },
  mounted () {
    setTimeout(() => {
      this.list = [
        {
          id: 10001,
          name: '蔡晓丽',
          age: 23,
          sex: '女'
        },
        {
          id: 10002,
          name: '李一诺',
          age: 24,
          sex: '男'
        },
        {
          id: 10003,
          name: '弋水寒',
          age: 25,
          sex: '男'
        },
        {
          id: 10004,
          name: '蹇一',
          age: 25,
          sex: '女'
        },
        {
          id: 10005,
          name: '欧阳瑾然',
          age: 22,
          sex: '女'
        },
        {
          id: 10006,
          name: '欧阳瑾怡',
          age: 23,
          sex: '女'
        },
        {
          id: 10007,
          name: '江昌易',
          age: 25,
          sex: '男'
        },
        {
          id: 10008,
          name: '许诺',
          age: 27,
          sex: '女'
        },
        {
          id: 10009,
          name: '刘正美',
          age: 27,
          sex: '男'
        },
        {
          id: 10010,
          name: '李煜',
          age: 28,
          sex: '男'
        }
      ]
      this.defaultIdList = this.list.map(v => v.id)
      this.asyncIdList = this.defaultIdList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    }, 500)
  },
  methods: {
    setSort () {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData (dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)
          // for show the changes, you can delete in you code
          const tempIndex = this.asyncIdList.splice(evt.oldIndex, 1)[0]
          this.asyncIdList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  // ...
</style>
<style>
.sortable-ghost{
  opacity: .8;
  color: #fff !important;
  background: #1890ff !important;
}
</style>
