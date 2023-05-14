import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import VueApollo from 'vue-apollo'
import apolloProvider from './client/apollo'

Vue.config.productionTip = false

Vue.use(VueApollo)

new Vue({
  store,
  vuetify,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')


