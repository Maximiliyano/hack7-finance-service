import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from '@/router'
import { Auth0Plugin } from '@/auth'
import authConfig from '../auth_config.json'
import JsonTreeViewer from 'vue-json-tree-viewer'
import store from '@/store/store'

Vue.config.productionTip = false

Vue.use(Auth0Plugin, {
  domain: authConfig.domain,
  clientId: authConfig.clientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    )
  }
})

Vue.use(JsonTreeViewer)
Vue.filter('formatDate', (dates) => dates ? dates.map(date => date.split('-').reverse().join('.')).sort().join(' - ') : '')
Vue.filter('formatOneDate', (date) => date ? date.split('-').reverse().join('.') : '')
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
