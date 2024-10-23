<template>
  <div class="p-20">
    <div style="width: 200px;">
      <SelectWithPopup v-model="selected" :dict="dict" />
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
      selected: [],
      dict: [
        { label: '张伟', value: 'a' },
        { label: '刘洋', value: 'b' },
        { label: '王芳', value: 'c' },
        { label: '陈昊', value: 'd' },
        { label: '朱迪', value: 'e' },
        { label: '兰阳', value: 'f' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>

</style>
