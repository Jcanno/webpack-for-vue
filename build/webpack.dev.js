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
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				exclude: /node_modules/,
				use: [
					'vue-loader'
				]
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
					//TODO sass-loader and happypack
					'style-loader',
					// 'happypack/loader?id=scsss'
					'css-loader', 'postcss-loader', 'sass-loader'
        ]
			},
		]
	},
	plugins: [
	]
})

