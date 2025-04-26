<template>
  <div>
    <div id="lightgallery">
      <a
        v-for="(item, index) in images"
        :key="index"
        :href="item.src"
      >
        <img :src="item.src" :alt="item.alt">
      </a>
    </div>
  </div>
</template>

<script>
const { BASE_URL } = process.env
export default {
  data () {
    return {
      images: [
        {
          src: BASE_URL + '/images/1.jpg',
          msrc: BASE_URL + '/images/1.jpg',
          alt: '1',
          title: 'Image 1',
          w: 765,
          h: 574
        },
        {
          src: BASE_URL + '/images/2.jpg',
          msrc: BASE_URL + '/images/2.jpg',
          alt: '2',
          title: 'Image 2',
          w: 765,
          h: 574
        }
      ]
    }
  },
  mounted () {
    const el = document.getElementById('lightgallery')
    this.el = el
    window.lightGallery(el)
  },
  beforeDestroy () {
    // this.el.destroy()
  },
  methods: {
    onClose () {
      console.log('onClose')
    }
  }
}
</script>

<style lang="scss" scoped>
  .slides {
    ::v-deep figure a img {
      width: 152px;
      height: 114px;
    }
  }
</style>
