const entryPath = '../src/index.js';
const outputPath = '../dist';
const htmlPath = '../public/index.html';
const faviconPath = '../public/favicon.ico';

const path = require('path');
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: 5 });
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	entry: {
		app: path.resolve(__dirname, entryPath)
	},
	output: {
		path: path.resolve(__dirname, outputPath),
		filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
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
			template: path.resolve(__dirname, htmlPath),
			favicon: path.resolve(__dirname, faviconPath),
			filename: 'index.html',
			minify: true
		}),
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
	]
}