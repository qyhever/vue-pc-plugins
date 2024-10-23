<template>
  <t-select
    class="input-overflow"
    :value="modelValue"
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
      :value="item.value"
    />
    <template #valueDisplay="{ value: dataList }">
      <t-tag
        v-if="dataList && dataList[0]"
        closable
        class="mr-4 mb-4"
        max-width="4em"
        :title="dataList[0].label"
        @close="onDelete(dataList[0])"
      >
        {{ dataList[0].label }}
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
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  props: {
    modelValue: {
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
  methods: {
    onChange (val) {
      this.$emit('update:modelValue', val)
      this.$emit('select-change', val)
    },
    onDelete (row) {
      const ret = this.modelValue.filter(id => id !== row.value)
      this.$emit('update:modelValue', ret)
      this.$emit('select-change', ret)
    },
    getTagList (valueList) {
      return valueList.map(id => {
        return this.dict.find(item => item.value === id)
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
