// const API_URL = 'https://api.darksky.net/forecast/';
// const API_KEY = 'c56e567b9e5593957b23d80b21459c2b';
const PROXY   = 'https://cors-anywhere.herokuapp.com/';
const API_URL = 'http://api.openweathermap.org/data/2.5/weather';
const API_KEY = '36a45c89da8b8b29124baf8e6f94aa7c';
const API_IMAGE = 'https://api.teleport.org/api/urban_areas/slug:';

export default {

  getForecast(lat, lon, units = 'metric') {
    // return axios.get(`${PROXY}${API_URL}${API_KEY}/${lat},${lon}`)
    return axios.get(`${PROXY}${API_URL}`, {
      params: {
        lat: lat,
        lon: lon,
        units: units,
        lang: 'en',
        APPID: API_KEY
      }
    })
    .then(response => {
      return response.data;
    })
  },

  getLocation(city, units = 'metric') {
    return axios.get(`${PROXY}${API_URL}`, {
      params: {
        q: city,
        units: units,
        lang: 'en',
        type: 'accurate',
        APPID: API_KEY
      }
    })
    .then(response => {
      return response.data;
    })
  },

  getCityImage(city) {
    return axios.get(`${API_IMAGE}${city}/images`)
    .then(response => {
      return response.data;
    })
  }

};