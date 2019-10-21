<template>
	<div id="title">
		webpack for vue
	</div>
</template>

<script>

export default {
	name: 'app',

	components:{},

	data () {
		return {
		}
	},

	methods: {
		test() {
			let str = 'example'
			const a = import(/* webpackChunkName: "example" */'./dynamic');
			console.log(a);
		}
	},

	computed: {},

	created() {},

	mounted() {},
}
</script>


<style lang='scss'>
	#title {
		color: black;
	}
</style>