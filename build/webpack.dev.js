const webpackBaseConfig = require('./webpack.base');
const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');

module.exports = WebpackMerge(webpackBaseConfig, {
	mode: 'development',
	devtool: '#cheap-module-eval-source-map',
	devServer: {
		
	},
	module: {
		rules: [

		]
	},
	plugins: [

	]
})

