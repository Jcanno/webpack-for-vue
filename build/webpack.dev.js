const webpackBaseConfig = require('./webpack.base');
const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');

module.exports = WebpackMerge(webpackBaseConfig, {
	mode: 'development',
	devtool: '#cheap-module-eval-source-map',
	devServer: {
		port: 8088,
		open: true,
		overlay: true,
		hot: true
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				exclude: /node_modules/,
				use: [ 'vue-loader' ]
			},
			{
				test: /\.(vue|js|jsx)$/,
				enforce: 'pre',
				exclude: /node_modules/,
				loader: 'eslint-loader'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'happypack/loader?id=css'
				]
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader',
					'sass-loader'
				]
			}
		]
	},
	plugins: [ new webpack.HotModuleReplacementPlugin() ]
});
