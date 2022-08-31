<template>
  <div class="sidebar">
    <el-scrollbar class="scrollbar" wrap-class="menu-scrollbar-wrapper">
      <el-menu
        ref="menu"
        :default-active="getActiveMenu()"
        class="sidebar-menu"
        :collapse="collapse"
        :collapse-transition="false"
        router
      >
        <MenuItem :navs="navs" />
      </el-menu>
    </el-scrollbar>
    <div class="toggle" @click="onMenuToggle">
      toggle
    </div>
  </div>
</template>

<script>
import MenuItem from './menu-item'
export default {
  components: {
    MenuItem
  },
  props: {
    navs: {
      type: Array,
      default: () => []
    },
    collapse: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getActiveMenu () {
      const { meta, path, query } = this.$route
      const { preRouterPath } = query
      if (preRouterPath) {
        return preRouterPath
      }
      if (meta?.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    onMenuToggle () {
      this.$emit('toggleMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  z-index: 10;
  position: fixed;
  top: $header-height;
  bottom: 0;
  width: $aside-width;
  background: #fff;
  transition: width 0.28s;
  transform: translate3d(0, 0, 0);
  box-shadow: 0 0 7px 0 rgba(171, 171, 171, 0.2);
  .toggle {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    line-height: 50px;
    background: #F5F7F9;
    cursor: pointer;
    text-align: center;
  }
}
.scrollbar {
  height: calc(100% - 50px);
}
.sidebar-menu {
  border-right: 0;
}
.sidebar-menu.el-menu--collapse {
  width: 100%;
  ::v-deep .el-submenu {
    & > .el-submenu__title {
      & > span,
      & > i {
        height: 0;
        width: 0;
        overflow: hidden;
        visibility: hidden;
        display: inline-block;
      }
    }
  }
}
</style>

<style lang="scss">
.el-menu--collapse {
  .el-menu-item > .el-tooltip,
  .el-submenu__title {
    padding-left: 15px !important;
  }
}
.menu-scrollbar-wrapper {
  overflow-x: hidden !important;
  height: 100%;
}
</style>
