<template>
  <div class="input-overflow">
    <t-select
      :value="selectedLabel/*绑定selectedLabel是为了在没有下拉列表时，也能显示选中的标签*/"
      clearable
      filterable
      :placeholder="placeholder"
      :multiple="multiple"
      :min-collapsed-num="1"
      :loading="loading"
      :on-search="remoteMethod"
      @change="onChange"
    >
      <t-option
        v-for="(item, index) in remoteOptionList"
        :key="index"
        :label="item.label/*没什么好说的，就是选项item的显示*/"
        :value="item.label/*绑定label，是因为 t-select 绑定的 label，这里也保持一致，才能高亮下拉列表选中项*/"
      />
      <template #valueDisplay="{ value: dataList }">
        <template v-if="multiple">
          <t-tag
            v-if="multiple && dataList && dataList.length"
            closable
            class="mr-4 mb-4"
            max-width="4em"
            :title="getDataList(dataList)[0].label"
            @close="onDelete()"
          >
            {{ getDataList(dataList)[0].label }}
          </t-tag>
        </template>
        <template v-else>
          {{ selectedLabel }}
        </template>
      </template>
      <template #collapsedItems="{ value: valueList, count }">
        <t-popup :overlay-inner-class-name="['com-select--exceed-popup']" trigger="hover">
          <div slot="content">
            <t-tag
              v-for="(popupItem, popupIndex) in getTagList(valueList)"
              :key="popupIndex"
              closable
              class="mr-4 mb-4"
              @close="onDelete(popupItem)"
            >
              {{ popupItem.label }}
            </t-tag>
          </div>
          <t-tag v-show="count > 0">
            +{{ count }}
          </t-tag>
        </t-popup>
      </template>
    </t-select>
  </div>
</template>

<script>
import { uniqBy, cloneDeep } from 'lodash'
import { getStaffListByKeyword } from './mock'

export default {
  name: 'RemoteStaffSelect',
  props: {
    selectedValue: {
      type: [String, Number, Array],
      default: ''
    },
    selectedLabel: {
      type: [String, Number, Array],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      remoteOptionList: [], // 只渲染下拉列表用
      // 只缓存下拉列表，每次搜索请求接口都缓存下来
      // 这样在change事件时，已选项还能够根据 label 找到对应的 item，从而保持选中状态
      cacheOptionList: [],
      loading: false
    }
  },
  computed: {
    // 合并已选项、下拉列表选项、缓存选项并去重，只在change事件时做查找用
    totalOptionList () {
      const labels = Array.isArray(this.selectedLabel) ? this.selectedLabel : [this.selectedLabel]
      const values = Array.isArray(this.selectedValue) ? this.selectedValue : [this.selectedValue]
      const selectedItems = labels.map((label, index) => {
        return {
          userId: values[index],
          userName: label
        }
      })
      const remotes = this.remoteOptionList.map(item => ({
        userId: item.userId,
        userName: item.userName
      }))
      const caches = this.cacheOptionList.map(item => ({
        userId: item.userId,
        userName: item.userName
      }))
      const ret = uniqBy([...selectedItems, ...remotes, ...caches], 'userId')
      return ret
    }
  },
  methods: {
    /**
     * @function onChange
     * @description 当选择器的值发生变化时触发。
     * 它会根据新的值更新父组件的 `selectedValue` 和 `selectedLabel`，
     * 并发出 `select-change` 事件，传递完整的选中项对象。
     * @param {string|string[]} selected - TDesign Select 组件返回的当前选中的值（标签）。
     */
    onChange (selected) {
      // console.log('selected: ', selected)
      // console.log('totalOptionList: ', cloneDeep(this.totalOptionList))
      if (this.multiple) {
        // `selected` is an array of labels
        const items = selected.map(label => {
          return this.totalOptionList.find(item => item.userName === label)
        }).filter(Boolean)
        this.$emit('update:selectedValue', items.map(item => item.userId))
        this.$emit('update:selectedLabel', items.map(item => item.userName))
        this.$emit('select-change', items)
      } else {
        // `selected` is a single label
        const current = this.totalOptionList.find(item => item.userName === selected) || {}
        this.$emit('update:selectedValue', current.userId || '')
        this.$emit('update:selectedLabel', current.userName || '')
        this.$emit('select-change', current)
      }
    },
    /**
     * @function onDelete
     * @description 处理标签的删除操作。它通过重新计算标签列表并调用 onChange 来集中处理状态更新。
     * @param {object} [row] - 要删除的行对象。如果未提供，则默认删除第一个标签。
     */
    onDelete (row) {
      let currentLabels = Array.isArray(this.selectedLabel) ? [...this.selectedLabel] : []
      if (row) {
        // Delete a specific tag from the popup
        currentLabels = currentLabels.filter(label => label !== row.label)
      } else {
        // Delete the first tag shown in the input
        currentLabels.shift()
      }
      this.onChange(currentLabels)
    },
    getDataList (rows) {
      return rows.map(item => {
        return {
          label: item.label || item.value,
          value: item.value
        }
      }).filter(Boolean)
    },
    getTagList (labelList) {
      return labelList.map(name => {
        return {
          label: name,
          value: name
        }
      })
    },
    async remoteMethod (keyword) {
      if (!keyword) {
        this.remoteOptionList = []
        return
      }
      this.loading = true
      const res = await getStaffListByKeyword(keyword)
      this.loading = false
      const list = res.map(item => {
        return {
          label: item.name,
          value: item.name,
          userId: item.userId,
          userName: item.name
        }
      })
      this.remoteOptionList = cloneDeep(list)
      this.cacheOptionList = this.cacheOptionList.concat(cloneDeep(list))
    }
  }
}
</script>

<style lang="scss" scoped>
.input-overflow {
  position: relative;
  // ::v-deep .t-input__prefix {
  //   max-width: 100%;
  //   overflow: hidden;
  //   > div {
  //     max-width: 100%;
  //     white-space: nowrap;
  //     text-overflow: ellipsis;
  //     overflow: hidden;
  //   }
  // }
}
</style>
