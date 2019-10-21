const webpack = require('webpack');
const path = require('path');
const libPath = path.resolve(__dirname, '../libs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		lib: [
			'vue', 
			'vue-router', 
			'vuex', 
			'axios', 
			'element-ui',
			'lodash'
		]
	},
	output: {
		path: libPath,
		filename: '[name].[hash:8].js',
		library: '[name]_library'
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.DllPlugin({
      context: __dirname,
      name: '[name]_library',
      path: path.resolve(libPath, '[name]-manifest.json')
    }),
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
}
