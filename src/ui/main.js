import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './sass/style.scss'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted() {
    setInterval(() => {
      this.$store.state.runner.doLoop()
    }, this.$store.state.runner.timeOutloop)
  }
})
