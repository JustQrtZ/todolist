import Vue from 'vue'
import App from './App.vue'
import BalmUI from 'balm-ui';
import BalmUIPlus from 'balm-ui/dist/balm-ui-plus';

Vue.config.productionTip = false;

Vue.use(BalmUI);
Vue.use(BalmUIPlus); 

new Vue({
  render: h => h(App)
}).$mount('#app')
