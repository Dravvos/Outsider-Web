import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import {
  StyleClass, Tooltip, DialogService,
  ConfirmationService, ToastService, Toast,
  ConfirmDialog, Dialog
} from 'primevue'
import oidc from './plugins/oidc';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { fas, faR, faL, faT } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(fas)
library.add(faR)
library.add(faL)
library.add(faT)

const app = createApp(App)

app.directive('styleclass', StyleClass)
app.directive('tooltip', Tooltip)
app.use(PrimeVue,
  {
    theme: {
      preset: Aura,
      options: {
        prefix: 'p',
        cssLayer: false,
      }
    }
  }
)
app.use(oidc);
app.use(ConfirmationService)
app.use(ToastService)
app.use(DialogService)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('ConfirmDialog', ConfirmDialog)
app.component('Toast', Toast)
app.component('Dialog', Dialog)
app.mount('#app')
