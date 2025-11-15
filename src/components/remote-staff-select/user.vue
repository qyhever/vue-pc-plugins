<template>
  <div class="input-overflow">
    <t-select
      :value="selected"
      value-type="object"
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
      >
        {{ showLabel(item.label) }}
      </t-option>
      <template #valueDisplay="{ value: dataList }">
        <template v-if="multiple">
          <t-tag
            v-if="multiple && dataList && dataList.length"
            closable
            class="mr-4 mb-4"
            max-width="4em"
            :title="showLabel(getDataList(dataList)[0].label)"
            @close="onDelete()"
          >
            {{ showLabel(getDataList(dataList)[0].label) }}
          </t-tag>
        </template>
        <template v-else>
          {{ showLabel(selected.label) }}
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
              {{ showLabel(popupItem.label) }}
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
  name: 'RemoteUserSelect',
  props: {
    // 已选项，格式为 { userId, userName, label, value } | Array<{ userId, userName, label, value }>
    // label 和 value 为 userName + '__' + userId，避免 userName 重复的情况
    selected: {
      type: [Object, Array],
      required: true
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
    showSelected () {
      if (this.multiple) {
        return this.selected.map(item => item.userName)
      }
      return this.selected
    },
    // 合并已选项、下拉列表选项、缓存选项并去重，只在change事件时做查找用
    totalOptionList () {
      const selecteds = Array.isArray(this.selected) ? this.selected : [this.selected]
      const remotes = this.remoteOptionList
      const caches = this.cacheOptionList
      const ret = uniqBy([...selecteds, ...remotes, ...caches], 'userId')
      return ret
    }
  },
  methods: {
    /**
     * @function onChange
     * @description 当选择器的值发生变化时触发。
     * 它会根据新的值更新父组件的 `selected`，
     * 并发出 `select-change` 事件，传递完整的选中项对象。
     * @param {string|string[]} selected - TDesign Select 组件返回的当前选中的值（标签）。
     */
    onChange (selected) {
      // console.log('selected: ', selected)
      // console.log('totalOptionList: ', cloneDeep(this.totalOptionList))
      if (this.multiple) {
        // `selected` is an array of labels
        const ret = selected.map(o => {
          return this.totalOptionList.find(item => item.label === o.label)
        }).filter(Boolean)
        this.$emit('update:selected', ret)
        this.$emit('select-change', ret)
      } else {
        // `selected` is a single label
        let ret = {}
        const current = this.totalOptionList.find(item => item.label === selected.label)
        if (current) {
          ret = current
        }
        this.$emit('update:selected', ret)
        this.$emit('select-change', ret)
      }
    },
    /**
     * @function onDelete
     * @description 处理标签的删除操作。它通过重新计算标签列表并调用 onChange 来集中处理状态更新。
     * @param {object} [row] - 要删除的行对象。如果未提供，则默认删除第一个标签。
     */
    onDelete (row) {
      let currentLabels = cloneDeep(this.selected)
      if (row) {
        // Delete a specific tag from the popup
        currentLabels = currentLabels.filter(o => o.label !== row.label)
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
      })
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
        const unionName = item.name + '__' + item.userId
        return {
          label: unionName,
          value: unionName,
          userId: item.userId,
          userName: item.name
        }
      })
      this.remoteOptionList = cloneDeep(list)
      this.cacheOptionList = this.cacheOptionList.concat(cloneDeep(list))
    },
    showLabel (str) {
      if (!str) {
        return ''
      }
      if (str.includes('__')) {
        return str.split('__')[0]
      }
      return str
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
