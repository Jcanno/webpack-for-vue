const path = require('path');
const libPath = path.resolve(__dirname, '../libs');

const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const webpackBaseConfig = require('./webpack.base');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
        test: /\.css$/,
        use: [
					MiniCssExtractPlugin.loader,
					'happypack/loader?id=css'
        ]
      },
			{
        test: /\.scss$/,
        use: [
					//TODO sass-loader and happypack
					MiniCssExtractPlugin.loader,
					// 'happypack/loader?id=scsss'
					'css-loader', 'postcss-loader', 'sass-loader'
        ]
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../libs/lib-manifest.json')
		}),
		new AddAssetHtmlPlugin({
      filepath: path.resolve(libPath, '*.js'),
      outputPath: 'js'
    }),
		// new HappyPack({
    //   id: 'scsss',
    //   threadPool: HappyThreadPool,
		// 	loaders: ['css-loader', 'postcss-loader', 'sass-loader'],
		// }),
		new BundleAnalyzerPlugin(),
		
		new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css",
      chunkFilename: "css/[name].[chunkhash:12].css"
		}),
		new OptimizeCssAssetsPlugin(),
		new UglifyJsPlugin({
			parallel: true,
			cache: true,
			uglifyOptions: {
				warnings: false,          // 删除警告
				compress: {
					drop_console: true,     // 去除日志
					drop_debugger: true     // 去除debugger
				},
				output: {
					comments: false         // 去除注释
				}
			},
		})
	]
})