<template>
  <div class="p-20">
    <QuickMonthPicker v-model="value" style="width: 400px" />
  </div>
</template>

<script>
import QuickMonthPicker from '@/components/quick-month-picker'
export default {
  components: {
    QuickMonthPicker
  },
  data () {
    return {
      value: []
      // value: ['2014-09', '2018-06']
    }
  },
  methods: {
    onChange (val) {
      console.log(val)
    }
  }
}
</script>
