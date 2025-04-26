<template>
  <div class="p-20">
    <div style="width: 400px">
      <OverflowTooltip :content="text2" />
      <div class="pt-15" />
      <MultipleOverflowTooltip :content="text2" />
      <div class="pt-15" />
    </div>

    <t-tooltip content="vue.js是通过数据驱动的，vue.js实例化对象将dom和数据进行绑定，一旦绑定，dom和数据将保持同步，每当数据发生变化，">
      <div class="parent">
        <span class="son">vue.js是通过数据驱动的，vue.js实例化对象将dom和数据进行绑定，一旦绑定，dom和数据将保持同步，每当数据发生变化，</span>
      </div>
    </t-tooltip>
  </div>
</template>

<script>
import OverflowTooltip from '@/components/overflow-tooltip'
import MultipleOverflowTooltip from '@/components/overflow-tooltip/multiple.vue'

export default {
  components: {
    OverflowTooltip,
    MultipleOverflowTooltip
  },
  data () {
    return {
      text1: Array(100).fill('place').join(''),
      text2: 'vue.js是通过数据驱动的，vue.js实例化对象将dom和数据进行绑定，一旦绑定，dom和数据将保持同步，每当数据发生变化，dom也会随着变化；ViewModel是Vue.js的核心，它是Vue.js的一个实例。Vue.js会针对某个HTML元素进行实例化，这个HTML元素可以是body，也可以是某个css选择器所指代的元素。DOM Listeners和Data Bindings是实现双向绑定的关键。DOM Listeners监听页面所有View层中的DOM元素，当发生变化时，Model层的数据随之变化。Data Bindings会监听Model层的数据，当数据发生变化时，View层的DOM元素也随之变化。'
    }
  }
}
</script>

<style lang="scss">
.wrapper {
  width: 400px;
  background-color: #f2f2f2;
}
.parent {
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #000;
  &:hover {
    color: skyblue;
  }
}
.son {
  // color: pink;
}
</style>
