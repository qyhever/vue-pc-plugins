<template>
  <div>
    <vue-preview class="slides" :slides="images" @close="onClose" />
  </div>
</template>

<script>
const { BASE_URL } = process.env
export default {
  data () {
    return {
      images: [
        {
          src: BASE_URL + 'images/1.jpg',
          msrc: BASE_URL + 'images/1.jpg',
          alt: '1',
          title: 'Image 1',
          w: 765,
          h: 574
        },
        {
          src: BASE_URL + 'images/2.jpg',
          msrc: BASE_URL + 'images/2.jpg',
          alt: '2',
          title: 'Image 2',
          w: 765,
          h: 574
        }
      ]
    }
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
