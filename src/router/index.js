import Vue from 'vue'
import VueRouter from 'vue-router'

import BasicLayout from '@/layouts/basic'
import BlankLayout from '@/layouts/blank'

Vue.use(VueRouter)

const basicRoutes = [
  {
    path: '/home',
    component: () => import('@/views/home'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/independent',
    component: BlankLayout,
    meta: {
      title: '自主开发'
    },
    children: [
      {
        path: '/scroll-nav',
        component: () => import('@/views/scroll-nav'),
        meta: {
          title: 'scroll-nav'
        }
      },
      {
        path: '/sticky-header',
        component: () => import('@/views/sticky-header'),
        meta: {
          title: 'sticky-header'
        }
      },
      {
        path: '/infinite-scroll',
        component: () => import('@/views/infinite-scroll'),
        meta: {
          title: 'infinite-scroll'
        }
      },
      {
        path: '/calendar',
        component: () => import('@/views/calendar'),
        meta: {
          title: 'calendar'
        }
      },
      {
        path: '/large-upload',
        component: () => import('@/views/large-upload'),
        meta: {
          title: 'large-upload'
        }
      }
    ]
  },
  {
    path: '/secondary',
    component: BlankLayout,
    meta: {
      title: '二次开发'
    },
    children: [
      {
        path: '/date-picker/quick-day',
        component: () => import('@/views/date-picker/quick-day'),
        meta: {
          title: 'quick-day'
        }
      },
      {
        path: '/date-picker/quick-month',
        component: () => import('@/views/date-picker/quick-month'),
        meta: {
          title: 'quick-month'
        }
      },
      {
        path: '/tags',
        component: () => import('@/views/tags'),
        meta: {
          title: 'tags'
        }
      },
      {
        path: '/ellipsis-text',
        component: () => import('@/views/ellipsis-text'),
        meta: {
          title: 'ellipsis-text'
        }
      },
      {
        path: '/remote-select',
        component: () => import('@/views/remote-select'),
        meta: {
          title: 'remote-select'
        }
      },
      {
        path: '/select-with-popup-page',
        component: () => import('@/views/select-with-popup-page'),
        meta: {
          title: 'select-with-popup'
        }
      },
      {
        path: '/remote-staff-select-page',
        component: () => import('@/views/remote-staff-select-page'),
        meta: {
          title: 'remote-staff-select'
        }
      }
    ]
  },
  {
    path: '/external',
    component: BlankLayout,
    meta: {
      title: '第三方'
    },
    children: [
      {
        path: '/vue-preview',
        component: () => import('@/views/vue-preview'),
        meta: {
          title: 'vue-preview'
        }
      },
      {
        path: '/lightgallery',
        component: () => import('@/views/lightgallery'),
        meta: {
          title: 'lightgallery'
        }
      },
      {
        path: '/drag-table',
        component: () => import('@/views/drag-table'),
        meta: {
          title: 'drag-table'
        }
      },
      {
        path: '/quill-page',
        component: () => import('@/views/quill-page'),
        meta: {
          title: 'quill-editor'
        }
      }
    ]
  },
  {
    path: '/html2pdf',
    component: () => import('@/views/html2pdf'),
    meta: {
      title: 'html2pdf'
    }
  }
]

const blankRoutes = [
  {
    path: '/amap',
    component: () => import('@/views/amap'),
    meta: {
      title: 'amap'
    }
  },
  {
    path: '/amap-ui',
    component: () => import('@/views/amap-ui'),
    meta: {
      title: 'amap-ui'
    }
  },
  {
    path: '/amap-custom',
    component: () => import('@/views/amap/custom'),
    meta: {
      title: 'amap-custom'
    }
  }
]

export const menuRoutes = [
  ...basicRoutes,
  ...blankRoutes
]

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/',
    component: BasicLayout,
    children: basicRoutes
  },
  ...blankRoutes
]

console.log('process.env: ', process.env)
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
