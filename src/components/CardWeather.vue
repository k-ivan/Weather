<template>
  <div class="card-weather" :class="{'has-image': checkImage}" v-if="forecast">
    <div class="card-weather__bg" v-if="checkImage" ref="img"></div>
    <button class="card-weather__remove" @click="clear"></button>
    <div class="card-weather__body">
      <div class="card-weather__masthead">
        <div class="card-weather__image" :style="`background-image: url(./img/weathers/${forecast.weather[0].id}.svg)`">
        </div>
        <div class="card-weather__summary">
          <div class="card-weather__state">{{ forecast.weather[0].main }}</div>
          <div class="card-weather__temp">{{ forecast.main.temp | roundDegree }}&deg;</div>
          <div class="card-weather__description"><small>{{ forecast.weather[0].description }}</small></div>
        </div>
      </div>
      <div class="card-weather__city">{{ forecast.name }}</div>
      <div class="card-weather__info">
        Sunrise – {{ forecast.sys.sunrise | toHoursMinutes }}<br>
        Sunset – {{ forecast.sys.sunset | toHoursMinutes }}
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/api/api';

export default {
  props: {
    forecast: Object,
    hasImage: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      checkImage: this.hasImage
    }
  },
  watch: {
    hasImage(data) {
      this.checkImage = this.hasImage;
      this.setImage(data);
    }
  },
  filters: {
    roundDegree(degree) {
      return degree | 0;
    },
    toHoursMinutes(time) {
      const date = new Date(time * 1000);
      let hours = date.getUTCHours();
      let minutes = date.getUTCMinutes();
      let h = (hours < 10) ? `0${hours}` : hours;
      let m = (minutes < 10) ? `0${minutes}` : minutes;
      return `${h}:${m}`;
    }
  },
  methods: {
    setImage(url) {
      this.imgLoad(url).then(src => {
        this.$refs.img.style.cssText = `
          background-image: url(${src});
          opacity: 1;
        `;
      })
      .catch(err => {
        this.checkImage = null;
      });
    },
    imgLoad(url) {
      const image = new Image();
      return new Promise((resolve, reject) => {
        image.onload = () => {
          resolve(url);
        }
        image.onerror = (e) => {
          reject(e);
        }
        image.src = url;
      })
    },
    clear() {
      this.$emit('clear');
    }
  }
}
</script>
