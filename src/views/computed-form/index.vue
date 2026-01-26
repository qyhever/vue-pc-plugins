src\views\form-computed\index.vue
<template>
  <div class="p-20">
    <BasicForm :form-data.sync="formModel"></BasicForm>
    <div class="mt-20">
      <pre>{{ showForm }}</pre>
    </div>
  </div>
</template>

<script>
import BasicForm from './basic-form.vue'

export default {
  name: 'ComputedForm',
  components: {
    BasicForm
  },
  data () {
    return {
      formModel: {
        name: '',
        mobile: ''
      }
    }
  },
  computed: {
    showForm () {
      return JSON.stringify(this.formModel, null, 2)
    }
  }
}
</script>
