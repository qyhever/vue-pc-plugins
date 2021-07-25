<template>
  <div class="page">
    <QuickDayPicker v-model="value" style="width: 400px" />
  </div>
</template>

<script>
import QuickDayPicker from '@/components/quick-day-picker'
export default {
  components: {
    QuickDayPicker
  },
  data () {
    return {
      value: []
      // value: ['2014-09-01', '2018-06-06']
    }
  },
  methods: {
    onChange (val) {
      console.log(val)
    }
  }
}
</script>
