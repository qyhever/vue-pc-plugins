<template>
  <div class="menus">
    <div v-for="(item, index) in navs" :key="index">
      <template v-if="!item.hidden">
        <el-submenu
          v-if="item.children && item.children.length"
          :index="item.path"
          :class="{ top: topLevel, ['level-' + level]: true }"
          popper-class="submenu-popper"
        >
          <template v-slot:title>
            <ComSvgIcon v-if="topLevel" :name="item.icon" class="menu-item__icon" />
            <span>{{ item.title }}</span>
          </template>
          <MenuItem :navs="item.children" :top-level="false" :level="level + 1" />
        </el-submenu>
        <el-menu-item v-else :index="item.path" :class="{ top: topLevel }">
          <ComSvgIcon v-if="topLevel" :name="item.icon" class="menu-item__icon" />
          <template v-slot:title>
            <span>{{ item.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    navs: {
      type: Array,
      default: () => []
    },
    topLevel: {
      type: Boolean,
      default: true
    },
    level: {
      type: Number,
      default: 1
    }
  }
}
</script>

<style lang="scss" scoped>
.menus {
  ::v-deep .el-menu-item,
  ::v-deep .el-submenu__title {
    height: 40px;
    line-height: 40px;
    color: $color-text-regular;
  }
  ::v-deep .el-menu-item {
    &.top > span {
      color: $color-text-primary;
    }
    &.is-active,
    &:hover,
    &:active,
    &:focus {
      background-color: #f5f7f9;
      color: $color-primary;
      &.top > span,
      .menu-item__icon {
        color: $color-primary;
      }
    }
  }
  ::v-deep .el-submenu {
    @for $i from 1 to 10 {
      &.level-#{$i} {
        .el-menu-item {
          padding-left: (50px + 20px * ($i - 1)) !important;
        }
        &:not(.top) {
          .el-submenu__title {
            padding-left: (30px + 20px * ($i - 1)) !important;
          }
        }
      }
    }
    .el-menu-item {
      padding-left: 50px !important;
    }
    &.top {
      .el-submenu__title > span {
        color: $color-text-primary;
      }
    }
    .el-submenu__title {
      &:hover {
        background-color: #f5f7f9;
        color: $color-primary;
        > span,
        .menu-item__icon,
        .el-submenu__icon-arrow {
          color: $color-primary;
        }
      }
      > span {
        color: $color-text-primary;
      }
    }
  }
}
.menu-item__icon {
  display: inline-block !important;
  font-size: 20px;
  margin-right: 12px;
  color: $color-text-primary;
}
</style>

<style lang="scss">
.submenu-popper .el-menu--popup {
  border-radius: 6px;
}
</style>
