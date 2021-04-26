<template>
  <div>
    <div class="placeholder">
      placeholder
    </div>
    <div class="wrapper">
      <div class="main">
        <Sticky>
          <ul class="navs">
            <li
              class="nav-item"
              v-for="(item, index) in navs"
              :key="index"
              :class="{active: activeValue === item.value}"
              @click="onNavItemClick(item.value)"
            >
              {{item.label}}
            </li>
          </ul>
        </Sticky>
        <div class="profession">职业影响力</div>
        <div class="answer">答辩文档</div>
        <div class="channel">通道专家</div>
        <div class="recommended">推荐学习</div>
      </div>
      <div class="aside">
        <div class="level">晋升</div>
        <div class="my">我的成长</div>
        <div class="study">学习</div>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/sticky'
export default {
  components: {
    Sticky
  },
  data() {
    return {
      navs: [
        { label: '职业影响力', value: 'profession' },
        { label: '答辩文档', value: 'answer' },
        { label: '通道专家', value: 'channel' },
        { label: '推荐学习', value: 'recommended' }
      ],
      activeValue: 'profession'
    }
  },
  methods: {
    onNavItemClick(value) {
      this.activeValue = value
    }
  }
}
</script>

<style lang="scss" scoped>
  .placeholder {
    height: 300px;
    background: skyblue;
  }
  .wrapper {
    width: 80%;
    margin: 20px auto 0;
    display: flex;
  }
  .main {
    flex: 1;
    margin-right: 15px;
  }
  .aside {
    width: 240px;
    flex: 0 0 240px;
    .level, .my, .study {
      height: 300px;
      background: skyblue;
    }
    .level, .my {
      margin-bottom: 10px;
    }
  }
  .navs {
    display: flex;
    height: 36px;
    margin-bottom: 10px;
    background: #f2f2f2;
  }
  .nav-item {
    position: relative;
    width: 7em;
    height: 36px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
    &.active {
      color: #3464e0;
      &:after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        background: #3464e0;
      }
    }
  }
  .profession, .answer, .channel, .recommended {
    height: 300px;
    background: pink;
    margin-bottom: 10px;
  }
</style>
