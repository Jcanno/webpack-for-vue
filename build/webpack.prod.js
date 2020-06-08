const path = require('path');
const libPath = path.resolve(__dirname, '../libs');
const webpackBaseConfig = require('./webpack.base');
const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const getDllReferencePlugins = function() {
	const names = ['element', 'lib'];

	return names.reduce((res, name) => {
		res.push(
			new webpack.DllReferencePlugin({
				context: __dirname,
				manifest: path.resolve(__dirname, `../libs/${name}-manifest.json`)
			})
		);

		return res;
	}, []);
};

module.exports = WebpackMerge(webpackBaseConfig, {
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: [
					'thread-loader',
					'vue-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader', 'postcss-loader', 'sass-loader'
				]
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'happypack/loader?id=css'
				]
			}
		]
	},
	plugins: [
		new BundleAnalyzerPlugin(),
		new CleanWebpackPlugin(),
		new HtmlWebpackExternalsPlugin({
			externals: [
				{
					module: 'lodash',
					entry: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.15/lodash.min.js',
					global: 'lodash'
				},
				{
					module: 'vue',
					entry: 'https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js',
					global: 'Vue'
				}
			]
		}),
		...getDllReferencePlugins(),
		new AddAssetHtmlPlugin({
			filepath: path.resolve(libPath, '*.js'),
			outputPath: 'js/',
			publicPath: '/js/'
		}),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[hash:8].css',
			chunkFilename: 'css/[name].[chunkhash:8].css'
		}),
		new OptimizeCssAssetsPlugin(),
		new UglifyJsPlugin({
			parallel: true,
			cache: true,
			uglifyOptions: {
				warnings: false,         // 删除警告
				compress: {
					drop_console: true,     // 去除日志
					drop_debugger: true     // 去除debugger
				},
				output: {
					comments: false         // 去除注释
				}
			}
		})
	]
});
