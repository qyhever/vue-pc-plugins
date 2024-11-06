<template>
  <div class="basic-layout" :class="{ collapse: collapse }">
    <div class="header">
      header
    </div>
    <div class="header-padding" />
    <Sidebar
      ref="sidebar"
      :navs="navs"
      :collapse="collapse"
      @toggleMenu="onMenuToggle"
    />
    <div id="appMain" class="app-main">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Sidebar from './sidebar'
import { menuRoutes } from '@/router'

const generateMenus = (list) => {
  return list.map(item => {
    const { path, icon = 'smile', hidden, meta } = item
    const { title = '' } = meta || {}
    if (Array.isArray(item.children) && item.children.length) {
      return {
        path,
        title,
        icon,
        hidden,
        children: generateMenus(item.children)
      }
    }
    return {
      path,
      title,
      icon,
      hidden
    }
  })
}

function getAccessMenus (list) {
  return list.filter(item => {
    if (item?.meta?.menuAuth) { // 需要验证
      if (Array.isArray(item.children)) {
        item.children = getAccessMenus(item.children)
      }
      // return authInfo[item.meta.menuAuth]
      return true
    }
    return true
  })
}

export default {
  components: {
    Sidebar
  },
  data () {
    return {
      navs: []
    }
  },
  computed: {
    ...mapState(['collapse'])
  },
  created () {
    this.navs = generateMenus(getAccessMenus(menuRoutes))
  },
  methods: {
    onMenuToggle () {
      this.$store.commit('SET_COLLAPSE')
    }
  }
}
</script>

<style lang="scss" soped>
.basic-layout {
  height: 100%;
  font-size: 14px;
  display: flex;
  flex-direction: column;
}
.header {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-width: 1200px;
  height: 60px;
  color: #fff;
  background-color: #1890ff;
}
.header-padding {
  width: 100%;
  height: 60px;
  flex: 0 0 60px;
}
.app-main {
  flex: 1;
  padding-left: 210px;
  background: #F5F7F9;
  transition: padding-left 0.28s;
}
// 折叠状态
.collapse {
  .sidebar {
    width: 50px;
  }
  .app-main {
    padding-left: 50px;
  }
}
</style>
