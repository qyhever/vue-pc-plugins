<template>
  <div class="p-20">
    <div class="upload-file">
      <el-button>点击上传</el-button>
      <input
        ref="fileInput"
        type="file"
        class="input-file"
        @change="onChange"
      >
    </div>
    <div class="flex items-center pt-10 text-color-regular">
      <i class="el-icon-info fs-16" />
      <span class="ml-6 fs-12">只能上传: mp4</span>
    </div>
    <div class="pt-10">
      <div class="text-color-regular">
        {{ fileInfo.name }}
      </div>
      <div v-if="status" class="pt-6 text-color-secondary">
        <div v-if="status === 'done'">
          <div>
            <span>上传完成: </span>
            <span>文件路径 {{ fileURL }}</span>
          </div>
          <span>计算hash耗时: {{ timeInfo.hash }}s</span>
          <span class="ml-6">上传切片耗时: {{ timeInfo.chunk }}s</span>
          <span class="ml-6">合并切片耗时: {{ timeInfo.merge }}s</span>
          <span class="ml-6">总耗时: {{ totalTime }}s</span>
        </div>
        <template v-else>
          <i class="el-icon-loading" />
          <span v-if="status === 'hashing'">生成文件hash中 {{ progressInfo.hash }}%</span>
          <span v-else-if="status === 'chunking'">文件切片上传中 {{ progressInfo.chunk }}%</span>
          <span v-else-if="status === 'merging'">文件切片合并中...</span>
          <span v-else>上传中...</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {
  verifyFile,
  createChunks,
  uploadChunks,
  mergeChunks
} from '@/utils/upload'
import { toFixed } from '@/utils'

function getInterval (start) {
  const end = new Date().getTime()
  const interval = (end - start) / 1000
  return toFixed(interval)
}

export default {
  data () {
    return {
      fileInfo: {},
      timeInfo: {
        hash: 0,
        chunk: 0,
        merge: 0
      },
      progressInfo: {
        hash: 0,
        chunk: 0
      },
      status: '',
      fileURL: ''
    }
  },
  computed: {
    totalTime () {
      return toFixed(this.timeInfo.hash + this.timeInfo.chunk + this.timeInfo.merge)
    }
  },
  created () {},
  methods: {
    checkFile (file) {
      if (file.size > 10 * 1024 * 1024 * 1024) {
        this.$message.closeAll()
        this.$message.error('上传文件不超过10G')
        return false
      }
      if (file.name.replace(/.+\./, '') !== 'mp4') {
        this.$message.closeAll()
        this.$message.error('上传文件仅支持MP4格式')
        return false
      }
      return true
    },
    onChange (event) {
      const file = event.target.files[0]
      this.$refs.fileInput.value = ''
      if (!this.checkFile(file)) {
        return
      }
      this.reset()
      this.fileInfo = file
      const chunks = createChunks(file)
      console.log('chunks: ', chunks)
      const hashStart = new Date().getTime()
      this.status = 'hashing'
      const worker = new Worker('./hash.js')
      worker.postMessage({
        chunks,
        file
      })
      worker.onerror = (err) => {
        console.log('worker.onerror', err)
        worker.terminate()
      }
      worker.onmessage = async event => {
        this.timeInfo.hash = +getInterval(hashStart)
        const { type } = event.data
        if (type === 'progress') {
          const percent = event.data.data
          this.progressInfo.hash = percent
          return
        }
        const fileHash = event.data.data
        console.log('fileHash: ', fileHash)
        worker.terminate()
        const res = await verifyFile(fileHash, chunks, file.name)
        if (res.fileURL) { // 已上传过，直接返回
          this.fileURL = res.fileURL
          this.status = 'done'
          return
        }
        // console.log('uploadChunks: ', uploadChunks)
        // console.log('mergeChunks: ', mergeChunks)
        const chunkStart = new Date().getTime()
        this.status = 'chunking'
        await uploadChunks(chunks, fileHash, val => {
          this.progressInfo.chunk = val
        })
        this.timeInfo.chunk = +getInterval(chunkStart)
        const mergeStart = new Date().getTime()
        this.status = 'merging'
        const url = await mergeChunks(fileHash, file.name)
        this.status = 'done'
        this.timeInfo.merge = +getInterval(mergeStart)
        this.fileURL = url
        // verifyFile(fileHash, chunks, file)
      }
    },
    reset () {
      this.timeInfo = {
        hash: 0,
        chunk: 0,
        merge: 0
      }
      this.progressInfo = {
        hash: 0,
        chunk: 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-file {
  position: relative;
  display: inline-block;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
.input-file {
  opacity: 0;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
}
</style>
