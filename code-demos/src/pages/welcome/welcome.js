import Vue from 'vue'
import Welcome from './welcome.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Welcome)
}).$mount('#app')
