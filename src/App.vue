<template>
  <div id="app">
    <router-view />
    <UpdatePopup />
  </div>
</template>

<script>
import UpdatePopup from '@/components/update-popup'

export default {
  name: 'App',
  components: {
    UpdatePopup
  }
}
</script>
