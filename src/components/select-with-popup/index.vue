<template>
  <t-select
    class="input-overflow"
    :value="labels"
    clearable
    :placeholder="placeholder"
    multiple
    :min-collapsed-num="1"
    v-bind="$attrs"
    @change="onChange"
  >
    <t-option
      v-for="(item, index) in dict"
      :key="index"
      :label="item.label"
      :value="item.label"
    />
    <template #valueDisplay="{ value: dataList }">
      <t-tag
        v-if="dataList && dataList.length"
        closable
        class="mr-4 mb-4"
        max-width="4em"
        :title="getDataList(dataList)[0].label"
        @close="onDelete()"
      >
        {{ getDataList(dataList)[0].label }}
      </t-tag>
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
</template>

<script>
export default {
  name: 'SelectWithPopup',
  // model: {
  //   prop: 'values',
  //   event: 'update:values'
  // },
  props: {
    values: {
      type: Array,
      default: () => []
    },
    labels: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    // { value: 'value', label: 'label' }
    dict: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    optionList () {
      if (!this.dict.length && this.labels.length) {
        return this.labels.map((label, index) => ({
          label,
          value: this.values[index]
        }))
      }
      return this.dict.map(item => ({
        label: item.label,
        value: item.value
      }))
    }
  },
  methods: {
    onChange (labs) {
      const items = labs.map(name => {
        return this.optionList.find(item => item.label === name)
      }).filter(Boolean)
      this.$emit('update:values', items.map(item => item.value))
      this.$emit('update:labels', labs)
      this.$emit('select-change', items)
    },
    onDelete (row) {
      let vals = []
      let labs = []
      let items = []
      if (row) {
        this.labels.forEach(name => {
          if (name !== row.label) {
            const current = this.optionList.find(item => item.label === name)
            labs.push(name)
            if (current) {
              vals.push(current.value)
              items.push(current)
            }
          }
        })
      } else {
        vals = this.values.slice(1)
        labs = this.labels.slice(1)
        items = labs.map(name => {
          return this.optionList.find(item => item.label === name)
        }).filter(Boolean)
      }
      this.$emit('update:values', vals)
      this.$emit('update:labels', labs)
      this.$emit('select-change', items)
    },
    getDataList (rows) {
      const ret = rows.map(item => {
        return {
          label: item.label || item.value,
          value: item.value
        }
      })
      return ret.filter(Boolean)
    },
    getTagList (labelList) {
      return labelList.map(name => {
        return this.optionList.find(item => item.label === name)
      }).filter(Boolean)
    }
  }
}
</script>

<style lang="scss" scoped>
.input-overflow {
  ::v-deep .t-input__prefix {
    max-width: 100%;
    overflow: hidden;
    > div {
      max-width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
