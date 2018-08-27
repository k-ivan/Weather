<template>
  <div id="app" class="wrap">
    <Weather msg="Weather App"/>
  </div>
</template>

<script>
import Weather from './components/Weather.vue'

export default {
  name: 'app',
  components: {
    Weather
  }
}
</script>

<style lang="scss">
@import './assets/scss/app.scss';
</style>
