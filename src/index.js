import Vue from 'vue';
import App from './App.vue';
import './index.scss';
// console.log("hahahahaha");
const abbbbb = () => {
	console.log(232);
	
}
abbbbb();
const b = async function()  {
	let a = await Promise.resolve("22");
	return a;
}
b();
new Vue({
	el: '#app',
	// template: '<p>webpack for vue</p>'
  render: h => h(App)
});