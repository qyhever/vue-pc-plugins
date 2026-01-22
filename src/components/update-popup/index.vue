<template>
  <transition name="boa-update-popup">
    <div
      v-if="visible"
      class="boa-update-popup"
    >
      <p>发现新内容可用</p>
      <button @click="onReload">
        刷新
      </button>
    </div>
  </transition>
</template>

<script>
const localVersion = process.env.LOCAL_VERSION

export default {
  name: 'UpdatePopup',
  data () {
    return {
      visible: false
    }
  },
  created () {
    if (process.env.NODE_ENV !== 'development') {
      this.checkVersion()
      setInterval(this.checkVersion, 30000)
    }
  },
  methods: {
    async checkVersion () {
      try {
        const response = await fetch(process.env.BASE_URL + 'meta.json?t=' + Date.now())
        const data = await response.json()
        console.log('localVersion: ', localVersion, ' metaVersion: ', data.hash)
        if (data.hash !== localVersion) {
          this.visible = true
        }
      } catch (err) {
        console.error('Error checking version:', err)
      }
    },
    onReload () {
      location.reload(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.boa-update-popup {
  position: fixed;
  right: 1em;
  bottom: 1em;
  padding: 1em;
  border: 1px solid #3eaf7c;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 3;
}

.boa-update-popup > button {
  margin-top: 0.5em;
  padding: 0.25em 2em;
}

.boa-update-popup-enter-active, .boa-update-popup-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.boa-update-popup-enter, .boa-update-popup-leave-to {
  opacity: 0;
  transform: translate(0, 50%) scale(0.5);
}
</style>
