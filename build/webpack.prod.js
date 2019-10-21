const path = require('path');
const htmlPath = '../public/index.html';
const faviconPath = '../public/favicon.ico';
const libPath = path.resolve(__dirname, '../lib');
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: 5 });

const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const webpackBaseConfig = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require('vue-loader');
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
			{
        test: /\.js$/,
        use: 'happypack/loader?id=babel',
        exclude: /node_modules/
			},
			{
        test: /\.(png|jpg|gif|svg|ttf|eot|woff|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'static/assets/[name].[hash:8].[ext]'
            }
          }
        ]
      }
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
		new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../lib/lib-manifest.json')
		}),
		new AddAssetHtmlPlugin({
      // publicPath: 'js/',
      filepath: path.resolve(__dirname, '../lib/*.js'),
      outputPath: 'js/'
    }),
		// new HappyPack({
    //   id: 'scsss',
    //   threadPool: HappyThreadPool,
		// 	loaders: ['css-loader', 'postcss-loader', 'sass-loader'],
		// }),
		new HappyPack({
      id: 'css',
      threadPool: HappyThreadPool,
			loaders: ['css-loader', 'postcss-loader'],
    }),
		new HappyPack({
			id: 'babel',
      loaders: ['babel-loader'],
      threadPool: HappyThreadPool,
		}),
		new BundleAnalyzerPlugin(),
		
		new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css",
      chunkFilename: "[name].[chunkhash:8].css"
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
	],
	optimization: {
		// minimize: true
	}
})