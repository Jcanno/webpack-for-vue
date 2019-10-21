const entryPath = '../src/index.js';
const outputPath = '../dist';
// const htmlPath = '../public/index.html';
// const faviconPath = '../public/favicon.ico';

const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
	// mode: 'production',
	entry: {
		app: path.resolve(__dirname, entryPath)
	},
	output: {
		path: path.resolve(__dirname, outputPath),
		filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    publicPath: '/'
	},
	// module: {
	// 	rules: [
	// 		{
	// 			test: /.vue$/,
	// 			loader: 'vue-loader'
	// 		},
	// 		{
  //       test: /\.css$/,
  //       use: [
	// 				MiniCssExtractPlugin.loader,
  //         // 'style-loader',
	// 				'css-loader',
	// 				'postcss-loader',
  //       ]
  //     },
	// 		{
  //       test: /\.scss$/,
  //       use: [
	// 				MiniCssExtractPlugin.loader,
  //         // 'style-loader',
	// 				'css-loader',
	// 				'postcss-loader',
  //         'sass-loader'
  //       ]
	// 		},
	// 		{
  //       test: /\.js$/,
  //       use: 'babel-loader',
  //       exclude: /node_modules/
  //     },
	// 	],
	// },
	// plugins: [
	// 	new CleanWebpackPlugin(),
	// 	new VueLoaderPlugin(),
	// 	new HtmlWebpackPlugin({
	// 		template: path.resolve(__dirname, htmlPath),
	// 		favicon: path.resolve(__dirname, faviconPath),
	// 		filename: 'index.[hash:8].html',
	// 		minify: true
	// 	}),
	// 	new MiniCssExtractPlugin({
  //     // Options similar to the same options in webpackOptions.output
  //     // both options are optional
  //     filename: "[name].css",
  //     chunkFilename: "[id].css"
  //   })
	// ]
}