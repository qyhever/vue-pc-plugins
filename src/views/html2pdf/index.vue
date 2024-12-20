<template>
  <div class="p-20">
    <t-textarea
      v-model="content"
      placeholder="请输入"
      :autosize="{ maxRows: 6, minRows: 3 }"
    />
    <div class="pt-20">
      <t-button @click="onSubmit">
        提交
      </t-button>
    </div>
  </div>
</template>

<script>
import { generatePdfByHtml } from '@/api/global'
import { downloadFileByApi } from '@/utils'

export default {
  name: 'Html2pdf',
  data () {
    return {
      content: ''
    }
  },
  methods: {
    async onSubmit () {
      const val = `
        <html>
          <head>
            <title>PDF Example</title>
          </head>
          <body>
            ${this.content}
          </body>
        </html>
      `
      const [err] = await downloadFileByApi(
        () => generatePdfByHtml(val)
      )
      console.log('err: ', err)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
