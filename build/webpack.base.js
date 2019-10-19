const entryPath = '../src/index.js';
const outputPath = '../dist';

const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		app: path.resolve(__dirname, entryPath)
	},
	output: {
		path: path.resolve(__dirname, outputPath),
		filename: 'js/[name].[hash:12].js',
		// filename: 'static/js/[name].[hash:8].js',
    // chunkFilename: 'static/js/[name].[chunkhash:8].js',
    publicPath: '/'
	},
	module: {
		rules: [
			
		]
	}
}