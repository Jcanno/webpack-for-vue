const htmlPath = '../public/index.html';
const faviconPath = '../public/favicon.ico';
const path = require('path');

const WebpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = WebpackMerge(webpackBaseConfig, {
	mode: 'production',
	module: {
		rules: [
			{
				test: /.vue$/,
				loader: 'vue-loader'
			},
			{
        test: /\.css$/,
        use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
        ]
      },
			{
        test: /\.scss$/,
        use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
          'sass-loader'
        ]
			},
			{
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, htmlPath),
			favicon: path.resolve(__dirname, faviconPath),
			filename: 'index.[hash:8].html',
			minify: true
		}),
		new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "css/[name].[hash:8].css",
      chunkFilename: "[id].css"
    })
	]
})