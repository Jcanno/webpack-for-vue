const path = require('path');
const entryPath = path.resolve(__dirname, '../src/index.js');
const outputPath = path.resolve(__dirname, '../dist');
const htmlPath = path.resolve(__dirname, '../public/index.html');

const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: 2 });
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: entryPath
	},
	output: {
		path: outputPath,
		filename: 'js/[name].[hash:8].js',
		publicPath: '/'
	},
	module: {
		rules: [
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
							name: 'assets/[name].[hash:8].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: htmlPath,
			filename: 'index.html',
			minify: true
		}),
		new HappyPack({
			id: 'css',
			threadPool: HappyThreadPool,
			loaders: ['css-loader', 'postcss-loader']
		}),
		new HappyPack({
			id: 'babel',
			loaders: ['babel-loader'],
			threadPool: HappyThreadPool
		})
	],
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendors: {
					name: 'vendors',
					test: /[\\/]node_modules[\\/]/,
					chunks: 'all',
					priority: -10,
					reuseExistingChunk: true
				}
			}
		}
	}
};
