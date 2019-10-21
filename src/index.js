import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import _ from 'lodash';
import './index.scss';

new Vue({
	el: '#app',
  render: h => h(App)
});