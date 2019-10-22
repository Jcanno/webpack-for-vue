import './index.scss';
import App from './App.vue';
import element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import _ from 'lodash';
import axios from 'axios';
Vue.use(element);
Vue.use(VueRouter);
Vue.use(Vuex);

new Vue({
	el: '#app',
	render: h => h(App)
})