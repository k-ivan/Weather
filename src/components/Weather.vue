<template>
  <div class="weather">
    <h1>{{ msg }}</h1>

    <div class="weather__units">
      <div class="switch-btns">
        <button class="switch-btns__item" :class="{'is-active': units === 'metric'}"  @click="units = 'metric'">C°</button>
        <button class="switch-btns__item" :class="{'is-active': units === 'imperial'}"  @click="units = 'imperial'">F°</button>
      </div>
    </div>

    <form action="#0" @submit.prevent="getByName" class="form">
      <div class="form__group">
        <input type="text" class="form__input weather__input" v-model.trim="location" placeholder="enter the city">
        <button class="form__btn">show</button>
      </div>
    </form>

    <div class="weather__content">

      <div v-if="loading" class="is-loading"></div>
      <div class="weather__result" v-else>
        <Card-Weather :forecast="forecast" :hasImage="cityImage" v-if="forecast" @clear="clearCard"></Card-Weather>
        <div v-else class="weather__result-empty">
          <span v-if="notFound">Not found 😢</span>
          <span v-else>Enter the city</span>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import API from '@/api/api';
import CardWeather from '@/components/CardWeather';

export default {
  name: 'Weather',
  props: ['msg'],
  components: {
    CardWeather
  },
  data() {
    return {
      location: null,
      forecast: null,
      notFound: false,
      loading: false,
      cityImage: null,
      units: localStorage.units || 'metric'
    }
  },
  watch: {
    units(value) {
      localStorage.units = value;
      this.getStorage();
    }
  },
  created() {
    if (this.getStorage()) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const {latitude, longitude} = position.coords;
        this.geoLocation(latitude, longitude, this.units);
      });
    }
  },
  methods: {
    getStorage() {
      const {latitude, longitude} = localStorage;
      if (latitude && longitude) {
        this.geoLocation(latitude, longitude, this.units);
        return true;
      }
    },
    async geoLocation(latitude, longitude) {
      this.loading = true;
      try {
        this.forecast = await API.getForecast(latitude, longitude, this.units);
        this.loading = false;
        localStorage.latitude = latitude;
        localStorage.longitude = longitude;
        this.setImage(this.forecast.name.toLowerCase());
      }
      catch(err) {
        this.loading = false;
        this.forecast = null;
        this.notFound = true;
      }

    },
    async getByName(e) {
      if (!this.location) return;

      this.loading = true;
      this.notFound = false;

      try {
        const data = await API.getLocation(this.location, this.units);

        this.location = '';
        this.loading = false;

        this.forecast = data;
        localStorage.latitude = data.coord.lat;
        localStorage.longitude = data.coord.lon;

        this.setImage(data.name);
      } catch(err) {
        this.loading = false;
        this.forecast = null;
        this.notFound = true;
      }
    },

    setImage(name) {
      this.cityImage = null;
      API.getCityImage(name.toLowerCase())
        .then(response => {
          const image = response.photos[0].image.mobile;
          if (!image) return;
          this.cityImage = image;
        })
        .catch(err => {
          this.cityImage = null;
        })
    },

    clearCard() {
      localStorage.clear();
      this.forecast = null;
      this.cityImage = null;
      this.location = null;
    },
  }
}
</script>

<style lang="scss">
.weather__result-empty {
  text-align: center;
  font-size: 2rem;
  font-weight: 300;
  color: #999;
}
.weather__units {
  margin-bottom: 30px;
  text-align: center;
}
</style>
