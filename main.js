import Vue from 'vue'
import App from './App'
import { http } from '@/common/service.js' // 全局挂载引入，配置相关在该index.js文件里修改
import uView from "uview-ui";
Vue.use(uView);

Vue.prototype.$http = http
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
