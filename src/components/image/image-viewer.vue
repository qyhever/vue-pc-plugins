<template>
  <transition name="viewer-fade">
    <div
      v-if="visible"
      ref="com-image-viewer__wrapper"
      tabindex="-1"
      class="com-image-viewer__wrapper"
      :style="{ 'z-index': viewerZIndex }"
    >
      <div class="com-image-viewer__mask" />
      <!-- CLOSE -->
      <span class="com-image-viewer__btn com-image-viewer__close" @click="hide">
        <ComSvgIcon name="circle-close" class="com-icon-circle-close" />
      </span>
      <!-- ARROW -->
      <template v-if="!isSingle">
        <span
          class="com-image-viewer__btn com-image-viewer__prev"
          :class="{ 'is-disabled': !infinite && isFirst }"
          @click="prev"
        >
          <ComSvgIcon name="arrow-left" />
        </span>
        <span
          class="com-image-viewer__btn com-image-viewer__next"
          :class="{ 'is-disabled': !infinite && isLast }"
          @click="next"
        >
          <ComSvgIcon name="arrow-right" />
        </span>
      </template>
      <!-- ACTIONS -->
      <div class="com-image-viewer__btn com-image-viewer__actions">
        <div class="com-image-viewer__actions__inner">
          <ComSvgIcon name="zoom-out" @click="handleActions('zoomOut')" />
          <ComSvgIcon name="zoom-in" @click="handleActions('zoomIn')" />
          <i class="com-image-viewer__actions__divider" />
          <ComSvgIcon :name="mode.icon" @click="toggleMode" />
          <i class="com-image-viewer__actions__divider" />
          <ComSvgIcon name="refresh-left" @click="handleActions('anticlocelise')" />
          <ComSvgIcon name="refresh-right" @click="handleActions('clocelise')" />
        </div>
      </div>
      <!-- CANVAS -->
      <div class="com-image-viewer__canvas">
        <img
          v-for="(url, i) in urlList"
          v-show="i === index"
          ref="img"
          :key="i"
          class="com-image-viewer__img"
          :src="currentImg"
          :style="imgStyle"
          @load="handleImgLoad"
          @error="handleImgError"
          @mousedown="handleMouseDown"
        >
      </div>
    </div>
  </transition>
</template>

<script>
import { on, off } from 'element-ui/src/utils/dom'
import { rafThrottle, isFirefox } from 'element-ui/src/utils/util'
import { PopupManager } from 'element-ui/src/utils/popup'
// import ComSvgIcon from '@/components/svg-icon'
const Mode = {
  CONTAIN: {
    name: 'contain',
    icon: 'full-screen'
  },
  ORIGINAL: {
    name: 'original',
    icon: 'scale-original'
  }
}
const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel'
let prevOverflow = ''
export default {
  name: 'ImageViewer',
  components: {
    // ComSvgIcon
  },
  // props: {
  //   urlList: {
  //     type: Array,
  //     default: () => []
  //   },
  //   zIndex: {
  //     type: Number,
  //     default: 2000
  //   },
  //   onSwitch: {
  //     type: Function,
  //     default: () => {}
  //   },
  //   onClose: {
  //     type: Function,
  //     default: () => {}
  //   },
  //   initialIndex: {
  //     type: Number,
  //     default: 0
  //   },
  //   appendToBody: {
  //     type: Boolean,
  //     default: true
  //   },
  //   maskClosable: {
  //     type: Boolean,
  //     default: true
  //   }
  // },
  data () {
    return {
      urlList: [],
      zIndex: 2000,
      onSwitch: () => {},
      onClose: () => {},
      initialIndex: 0,
      appendToBody: true,
      maskClosable: true,

      index: this.initialIndex,
      isShow: false,
      infinite: true,
      loading: false,
      mode: Mode.CONTAIN,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    }
  },
  computed: {
    currentUrlList () {
      return this.urlList.filter((_, i) => i === this.index)
    },
    isSingle () {
      return this.urlList.length <= 1
    },
    isFirst () {
      return this.index === 0
    },
    isLast () {
      return this.index === this.urlList.length - 1
    },
    currentImg () {
      return this.urlList[this.index]
    },
    imgStyle () {
      const { scale, deg, offsetX, offsetY, enableTransition } = this.transform
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? 'transform .3s' : '',
        'margin-left': `${offsetX}px`,
        'margin-top': `${offsetY}px`
      }
      if (this.mode === Mode.CONTAIN) {
        style.maxWidth = style.maxHeight = '100%'
      }
      return style
    },
    viewerZIndex () {
      const nextZIndex = PopupManager.nextZIndex()
      return this.zIndex > nextZIndex ? this.zIndex : nextZIndex
    }
  },
  watch: {
    index: {
      handler (val) {
        this.reset()
        this.onSwitch(val)
      }
    },
    currentImg () {
      this.$nextTick(_ => {
        const $img = this.$refs.img[0]
        if (!$img.complete) {
          this.loading = true
        }
      })
    }
    // visible(val) {
    //   if (val) {
    //     // prevent body scroll
    //     prevOverflow = document.body.style.overflow
    //     document.body.style.overflow = 'hidden'
    //   } else {
    //     document.body.style.overflow = prevOverflow
    //   }
    // }
  },
  mounted () {
    this.deviceSupportInstall()
    if (this.appendToBody) {
      document.body.appendChild(this.$el)
    }
    // add tabindex then wrapper can be focusable via Javascript
    // focus wrapper so arrow key can't cause inner scroll behavior underneath
    const wrapper = this.$refs['com-image-viewer__wrapper']
    wrapper && wrapper.focus()
    // prevent body scroll
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  },
  beforeUnmount () {
    document.body.style.overflow = prevOverflow
  },
  methods: {
    hide () {
      this.visible = false
      this.deviceSupportUninstall()
      this.onClose()
    },
    deviceSupportInstall () {
      this._keyDownHandler = rafThrottle(e => {
        const keyCode = e.keyCode
        const handler = {
          27: () => this.hide(), // ESC
          32: () => this.toggleMode(), // SPACE
          37: () => this.prev(), // LEFT_ARROW
          38: () => this.handleActions('zoomIn'), // UP_ARROW
          39: () => this.next(), // RIGHT_ARROW
          40: () => this.handleActions('zoomOut') // DOWN_ARROW
        }[keyCode]
        handler && handler()
      })
      this._mouseWheelHandler = rafThrottle(e => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail
        if (delta > 0) {
          this.handleActions('zoomIn', {
            zoomRate: 0.015,
            enableTransition: false
          })
        } else {
          this.handleActions('zoomOut', {
            zoomRate: 0.015,
            enableTransition: false
          })
        }
      })
      on(document, 'keydown', this._keyDownHandler)
      on(document, mousewheelEventName, this._mouseWheelHandler)
    },
    deviceSupportUninstall () {
      off(document, 'keydown', this._keyDownHandler)
      off(document, mousewheelEventName, this._mouseWheelHandler)
      this._keyDownHandler = null
      this._mouseWheelHandler = null
    },
    handleImgLoad () {
      this.loading = false
    },
    handleImgError (e) {
      this.loading = false
      e.target.alt = '加载失败'
    },
    handleMouseDown (e) {
      if (this.loading || e.button !== 0) return
      const { offsetX, offsetY } = this.transform
      const startX = e.pageX
      const startY = e.pageY
      this._dragHandler = rafThrottle(ev => {
        this.transform.offsetX = offsetX + ev.pageX - startX
        this.transform.offsetY = offsetY + ev.pageY - startY
      })
      on(document, 'mousemove', this._dragHandler)
      on(document, 'mouseup', () => {
        off(document, 'mousemove', this._dragHandler)
      })
      e.preventDefault()
    },
    reset () {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    },
    toggleMode () {
      if (this.loading) return
      const modeNames = Object.keys(Mode)
      const modeValues = Object.values(Mode)
      const index = modeValues.indexOf(this.mode)
      const nextIndex = (index + 1) % modeNames.length
      this.mode = Mode[modeNames[nextIndex]]
      this.reset()
    },
    prev () {
      if (this.isFirst && !this.infinite) return
      const len = this.urlList.length
      this.index = (this.index - 1 + len) % len
    },
    next () {
      if (this.isLast && !this.infinite) return
      const len = this.urlList.length
      this.index = (this.index + 1) % len
    },
    handleActions (action, options = {}) {
      if (this.loading) return
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      }
      const { transform } = this
      switch (action) {
        case 'zoomOut':
          if (transform.scale > 0.2) {
            transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3))
          }
          break
        case 'zoomIn':
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3))
          break
        case 'clocelise':
          transform.deg += rotateDeg
          break
        case 'anticlocelise':
          transform.deg -= rotateDeg
          break
        default:
          console.error('Does not support the current action')
      }
      transform.enableTransition = enableTransition
    }
  }
}
</script>
