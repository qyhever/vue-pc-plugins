<template>
  <form
    class="el-form"
    :class="[labelPosition ? 'el-form--label-' + labelPosition : '', { 'el-form--inline': inline }]"
  >
    <slot />
  </form>
</template>
<script>
import objectAssign from 'element-ui/src/utils/merge'
// import { minBy } from 'lodash'
// import { elementInView } from '@/utils/dom'
import scrollIntoView from 'scroll-into-view-if-needed'

export default {
  name: 'ElForm',

  componentName: 'ElForm',

  provide () {
    return {
      elForm: this
    }
  },

  props: {
    model: Object,
    rules: Object,
    labelPosition: String,
    labelWidth: String,
    labelSuffix: {
      type: String,
      default: ''
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    size: String,
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    },
    scrollToFirstError: {
      type: Boolean,
      default: false
    },
    excludeHeight: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      fields: [],
      potentialLabelWidthArr: [] // use this array to calculate auto width
    }
  },
  computed: {
    autoLabelWidth () {
      if (!this.potentialLabelWidthArr.length) return 0
      const max = Math.max(...this.potentialLabelWidthArr)
      return max ? `${max}px` : ''
    }
  },
  watch: {
    rules () {
      // remove then add event listeners on form-item after form rules change
      this.fields.forEach(field => {
        field.removeValidateEvents()
        field.addValidateEvents()
      })

      if (this.validateOnRuleChange) {
        this.validate(() => {})
      }
    }
  },
  created () {
    this.$on('el.form.addField', field => {
      if (field) {
        this.fields.push(field)
      }
    })
    /* istanbul ignore next */
    this.$on('el.form.removeField', field => {
      if (field.prop) {
        this.fields.splice(this.fields.indexOf(field), 1)
      }
    })
  },
  methods: {
    resetFields () {
      if (!this.model) {
        console.warn('[Element Warn][Form]model is required for resetFields to work.')
        return
      }
      this.fields.forEach(field => {
        field.resetField()
      })
    },
    clearValidate (props = []) {
      const fields = props.length
        ? typeof props === 'string'
          ? this.fields.filter(field => props === field.prop)
          : this.fields.filter(field => props.indexOf(field.prop) > -1)
        : this.fields
      fields.forEach(field => {
        field.clearValidate()
      })
    },
    validate (callback) {
      if (!this.model) {
        console.warn('[Element Warn][Form]model is required for validate to work!')
        return
      }

      let promise
      // if no callback, return promise
      if (typeof callback !== 'function' && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = function (valid) {
            valid ? resolve(valid) : reject(valid)
          }
        })
      }

      let valid = true
      let count = 0
      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (this.fields.length === 0 && callback) {
        callback(true)
      }
      let invalidFields = {}
      const errors = []
      this.fields.forEach(field => {
        field.validate('', (message, invalidField) => {
          if (message) {
            errors.push(invalidField)
            valid = false
          }
          invalidFields = objectAssign({}, invalidFields, invalidField)
          if (typeof callback === 'function' && ++count === this.fields.length) {
            // if (this.scrollToFirstError) {
            //   const errorNodes = []
            //   Object.keys(invalidFields).forEach(propName => {
            //     const component = this.fields.find(item => item.prop === propName)
            //     const isView = elementInView(component.$el, 60)
            //     if (!isView) {
            //       errorNodes.push({
            //         component,
            //         y: component.$el.getBoundingClientRect().y
            //       })
            //     }
            //   })
            //   const minYNode = minBy(errorNodes, node => node.y)
            //   if (minYNode) {
            //     minYNode.component.scrollToView()
            //   }
            // }
            callback(valid, invalidFields)
          }
        })
      })

      // 废弃掉以前的 根据 dom 计算距离位置的方式，使用 scroll-into-view-if-needed 库
      if (scrollToFirstError && errors.length && errors[0]) {
        Object.keys(errors[0]).forEach(propName => {
          const component = this.fields.find(item => item.prop === propName)
          const node = component.$el
          if (node) {
            scrollIntoView(node, {
              scrollMode: 'if-needed',
              block: 'nearest'
            })
          }
        })
      }

      if (promise) {
        return promise
      }
    },
    validateField (props, cb) {
      props = [].concat(props)
      const fields = this.fields.filter(field => props.indexOf(field.prop) !== -1)
      if (!fields.length) {
        console.warn('[Element Warn]please pass correct props!')
        return
      }

      fields.forEach(field => {
        field.validate('', cb)
      })
    },
    getLabelWidthIndex (width) {
      const index = this.potentialLabelWidthArr.indexOf(width)
      // it's impossible
      if (index === -1) {
        throw new Error('[ElementForm]unpected width ', width)
      }
      return index
    },
    registerLabelWidth (val, oldVal) {
      if (val && oldVal) {
        const index = this.getLabelWidthIndex(oldVal)
        this.potentialLabelWidthArr.splice(index, 1, val)
      } else if (val) {
        this.potentialLabelWidthArr.push(val)
      }
    },
    deregisterLabelWidth (val) {
      const index = this.getLabelWidthIndex(val)
      this.potentialLabelWidthArr.splice(index, 1)
    }
  }
}
</script>
