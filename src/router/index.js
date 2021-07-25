import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('@/views/home')
  },
  {
    path: '/date-picker/quick-day',
    component: () => import('@/views/date-picker/quick-day')
  },
  {
    path: '/date-picker/quick-month',
    component: () => import('@/views/date-picker/quick-month')
  },
  {
    path: '/tags',
    component: () => import('@/views/tags')
  },
  {
    path: '/ellipsis-text',
    component: () => import('@/views/ellipsis-text')
  },
  {
    path: '/remote-select',
    component: () => import('@/views/remote-select')
  },
  {
    path: '/vue-preview',
    component: () => import('@/views/vue-preview')
  },
  {
    path: '/lightgallery',
    component: () => import('@/views/lightgallery')
  },
  {
    path: '/drag-table',
    component: () => import('@/views/drag-table')
  },
  {
    path: '/scroll-nav',
    component: () => import('@/views/scroll-nav')
  },
  {
    path: '/sticky-header',
    component: () => import('@/views/sticky-header')
  },
  {
    path: '/infinite-scroll',
    component: () => import('@/views/infinite-scroll')
  },
  {
    path: '/calendar',
    component: () => import('@/views/calendar')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
