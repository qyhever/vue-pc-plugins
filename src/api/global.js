import request from '@/utils/request'

export function generatePdfByHtml (content) {
  return request({
    method: 'post',
    url: '/common/html2pdf',
    data: {
      content
    },
    responseType: 'blob'
  })
}
