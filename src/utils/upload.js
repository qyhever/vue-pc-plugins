import request from './request'

const maxRequest = 6

/**
 * 校验文件是否已上传
 * @param md5
 * @param chunks
 */
export const verifyFile = (md5, chunks, fileName) => {
  const extName = fileName.replace(/.+\./, '')
  return request({
    url: '/upload/verifyFile',
    method: 'post',
    data: {
      // chunksObj: { name: md5, chunkNames },
      // fileName: md5 + '.' + extName,
      chunkNames: chunks.map((_, i) => i),
      hashFileName: md5 + '.' + extName
    }
  })
}

/**
 * 文件分片
 * @param file 文件对象
 * @param chunksize 分片大小 默认切片大小 3MB
 */
export const createChunks = (file, chunksize = 3 * 1024 * 1024) => {
  const chunks = []
  // for (let i = 0; i < file.size; i += chunksize) {
  //   chunks.push({
  //     raw: file.slice(i, i + chunksize),
  //     chunkIndex: i
  //   })
  // }
  let start = 0
  let index = 0
  while (start < file.size) {
    const raw = file.slice(start, start + chunksize)
    chunks.push({
      raw,
      chunkIndex: index
    })
    index++
    start += chunksize
  }
  console.log('chunks.length: ', chunks.length)
  return chunks
}

/**
 * 上传chunk
 * @param chunk chunk
 * @param md5 加密串
 * @param fileName 文件名
 * @param index 下标：失败辅助标识
 */
const uploadChunkFile = (chunk, md5 = '', callback, chunkLength) => {
  const formData = new FormData()
  formData.append('file', chunk.raw)
  return request({
    url: '/upload/uploadChunk',
    method: 'post',
    data: formData,
    params: {
      fileHash: md5,
      chunkIndex: chunk.chunkIndex
    }
  }).then(res => {
    callback(
      parseInt((chunk.chunkIndex + 1) / chunkLength * 100, 10)
    )
    return res
  })
}

/**
 * 循环上传chunks
 * @param chunks
 * @param md5 加密串
 * @param fileName 文件名
 */

export const uploadChunks = (chunks, md5, callback) => {
  return new Promise((resolve, reject) => {
    const requestSliceArr = []
    let start = 0
    while (start < chunks.length) {
      requestSliceArr.push(chunks.slice(start, start + maxRequest))
      start += maxRequest
    }
    let index = 0
    const requestReaults = []
    const requestErrReaults = []

    const request = async () => {
      if (index > requestSliceArr.length - 1) {
        resolve(requestReaults)
        return
      }
      const sliceChunks = requestSliceArr[index]
      Promise.all(
        sliceChunks.map(chunk => uploadChunkFile(chunk, md5, callback, chunks.length))
      ).then((res) => {
        requestReaults.push(...(Array.isArray(res) ? res : []))
        index++
        request()
      }).catch((err) => {
        requestErrReaults.push(...(Array.isArray(err) ? err : []))
        reject(requestErrReaults)
      })
    }
    request()
  })
}

/**
 * 合并chunks
 * @param md5
 * @param file
 */
export const mergeChunks = async (md5 = '', fileName) => {
  return request({
    url: '/upload/merge',
    method: 'post',
    data: {
      fileHash: md5,
      fileName
    }
  })
}
