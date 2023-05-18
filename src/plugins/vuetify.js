import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#0277bd',
        secondary: '#0a3055',
        accent: '#67a509',
        error: '#cf000f',
        info: '#ffffff',
        success: '#67a509',
        warning: '#cf000f'
      }
    }
  }
})
