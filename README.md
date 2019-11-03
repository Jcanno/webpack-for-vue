从零开始构建基于webpack4.0的Vue项目脚手架(参考资料优先为英文文档)，请按照步骤进行项目配置。
## 1.第一次打包
1. `npm init -y` 初始化项目生成`package.json` `注: 自行配置git初始化`
2. `npm i -D webpack webpack-cli`安装webpack
3. 新建build文件夹作为webpack脚手架配置目录
4. 在build文件下新建`webpack.prod.js`文件，此文件为编译生产代码文件
5. 新建src目录作为项目源代码目录
6. 在src目录下新建`index.js`作为项目入口
7. 在`build/webpack.prod.js`下导出配置对象，先配置入口及出口，添加如下代码
```javascript
const path = require('path');
const entryPath = path.resolve(__dirname, '../src/index.js');
const outputPath = path.resolve(__dirname, '../dist');
module.exports = {
	entry: {
		app: entryPath
	},
	output: {
		path: outputPath,
		filename: 'js/[name].[hash:8].js',
    		publicPath: '/'
	},
}
```
`释:` 
`entry`为webpack的入口，`output`为webpack打包后的出口，其中`path`和`filename`是必须要配置的，分别为出口路径和出口文件名。
`filename`中`[name]`对应入口的键，默认为`main`，项目中为`app`，`[hash:8]`是为文件名添加长度为8位的哈希值，便于缓存。

8. 在`package.json` `script`中添加`"build": "webpack --config=build/webpack.prod.js"`,然后在终端输入`npm run build`进行第一次打包。![第一次打包结果](https://img-blog.csdnimg.cn/20191022091229327.png)
9. 完成了第一次打包！但报了警告，意思告诉我们要添加`mode`为`production`或`development`的选项配置。在`webpack.prod.js`中添加`mode: 'production'`，再次使用`npm run build`打包，警告完美去除，进入下一阶段
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191022091157276.png)
## 2.配置loader
1. loader主要作用是将浏览器不识别的内容转换为浏览器可以识别的内容，例如通过`babel-loader`将`es5+`语法的js转换为`es5`语法。
2. 在`src`目录下新建`index.scss`文件，可以随便写入sass样式，例如
```javascript
#example {
	font-size: 15px;
}
```
3. 在`index.js`中引入
```javascript
import './index.scss';
```
4. 此时使用`npm run build`会报错，因为webpack还不能识别scss文件和sass语法，`npm i -D node-sass sass-loader css-loader postcss-loader autoprefixer`安装相关依赖。
`释:` 
`sass-loader`将`sass`语法转换为`css`，
`css-loader`能识别css中的`import()、 url()`，
`postcss-loader`能根据各个浏览器平台提供css代码兼容方案，
`autoprefixer`通过`postcss-loader`配置自动为css代码添加各个浏览器前缀 ![在这里插入图片描述](https://img-blog.csdnimg.cn/2019102209251929.png)
5. 添加loader之前，我们先配置`postcss-loader`，项目根目录下创建`postcss.config.js`文件，添加如下代码
```javascript
module.exports = {
	plugins: {
		autoprefixer: {}
	}
};
```
6. 在`webpack.prod.js`添加loader
```javascript
...(省略相同代码)
module.exports = {
	...(省略相同代码)
	module: {
		rules: [
			{
        			test: /\.scss$/,
        			use: [
					'css-loader', 'postcss-loader', 'sass-loader'
        			]
			},
		]
	}
}
```
`释:`
要在`module.rules`中添加loader，`test`为匹配的文件，可以用正则来判断文件后缀名，`use`是使用的loader
loader的执行顺序是自下而上的，这里执行的顺序依次是`sass-loader`、`postcss-loader`、`css-loader`。

7. 再次使用`npm run build`打包，打包成功!每一次的打包都激动人心~继续使用更多的loader来匹配项目中的实际情况。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191022094529642.png)
8. `npm i -D @babel/core @babel/plugin-syntax-dynamic-import @babel/preset-env`添加依赖。根目录下添加`babel.config.js`文件，添加如下代码
```javascript
module.exports = {
  presets: [
    ['@babel/env']
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import'
  ]
};
```
`释:` 
`@babel/env`可以根据目标浏览器来提供一系列预设的babel插件,此外还可以配置兼容目标浏览器的版本
`@babel/plugin-syntax-dynamic-import`插件可以识别js中动态引入的代码，如`improt('./index.js')`

9. 在`webpack.prod.js`中添加babel-loader
```javascript
...(省略相同代码)
module.exports = {
	...(省略相同代码)
	module: {
		rules: [
			{
   				test: /\.js$/,
   				use: 'babel-loader',
   				exclude: /node_modules/
			}
		]
	}
}

```
将`node_modules`文件夹排除，此时我们可以识别`js`代码，继续添加loader

10. 在`src`下添加`App.vue`，并在`index.js`中引入，此时打包必会报错，`npm i -D vue-loader`添加官方推荐的[vue-loader](https://vue-loader.vuejs.org/zh/guide/#%E6%89%8B%E5%8A%A8%E8%AE%BE%E7%BD%AE)
`释:`
`vue-loader`能识别`.vue`文件，将其中的`script` `scss`提取出各自的文件，`V15`版本必须要引入`VueLoaderPlugin`插件(插件配置之后说明，我们先完成vue-loader的配置)
11. 在`webpack.prod.js`中添加`vue-loader`
```javascript
...(省略相同代码)
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
	...(省略相同代码)
	module: {
		rules: [
			...(省略相同代码)
			{
				test: /\.vue$/,
				use: [
					'vue-loader'
				]
			},
		]
	},
	plugins: [
		new VueLoaderPlugin(),
	]
}
```
再次打包，又是一次愉快的成功打包。

12. `npm i -D url-loader`添加依赖
`url-loader`能处理图片、字体等文件类型，在`webpack.prod.js`中配置
```javascript
...(省略相同代码)
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
	...(省略相同代码)
	module: {
		rules: [
			...(省略相同代码)
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
}

```
`释:`
打包在assets目录下，`[name]` `[hash]`之前已经说明，`[ext]`根据原有的文件后缀生成。

13. 在原有loader基础上增加对css文件的loader支持，现全部配置如下
```javascript
...(省略相同代码)
module.exports = {
	...(省略相同代码)
	module: {
		rules: [
			...(省略相同代码)
			{
        			test: /\.css$/,
        			use: [
					'css-loader', 'postcss-loader'
        			]
      			},
		]
	},
	...(省略相同代码)
}
```
现在大部分的loader已经配置完成，可以应对项目大部分的开发需要，继续进入下一阶段

## 3.配置plugin
1. `plugin`主要是在webpack构建过程中提供并添加各样的功能。在loader中我们已经使用过`vueloaderplugin`，在plugins数组中都要实例化`plugin`。
2. `npm i -D html-webpack-plugin`添加依赖
`释:`
这个插件能根据源`html`文件生成同样的`html`文件，并将打包生成的js、css文件自动引入到生成的`html`文件中。

3. 在`public`文件夹下添加`index.html`文件，并添加`html-webpack-plugin`配置
```javascript
...(省略相同代码)
const path = require('path');
const htmlPath = path.resolve(__dirname, '../public/index.html');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	...(省略相同代码)
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: htmlPath,
			filename: 'index.html',
			minify: true
		}),
	]
}
```
4. 打包，生成的`index.html`自动引入了js文件,继续添加插件
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191022104931535.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2p6cTk1MDUyMg==,size_16,color_FFFFFF,t_70)
5. `npm i -D mini-css-extract-plugin`
此插件主要将css代码分离出来
6. 
```javascript
...(省略相同代码)
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	...(省略相同代码)
	module: {
		rules: [
			...(省略相同代码)
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
					'css-loader', 'postcss-loader'
        			]
      			},
		]
	},
	plugins: [
		...(省略相同代码)
		new MiniCssExtractPlugin({
      			filename: "css/[name].[hash:8].css",
      			chunkFilename: "css/[name].[chunkhash:8].css"
		}),
	]
}
```
`filename`是根据源文件打包后文件名，`chunkFilename`是被分离的文件名，分离优化之后再说明
再次打包，结果如下，css代码被分离出到单独的文件夹中

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019102211020913.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2p6cTk1MDUyMg==,size_16,color_FFFFFF,t_70)

7. `npm i -D clean-webpack-plugin`添加依赖
```javascript
...(省略相同代码)
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	...(省略相同代码)
	plugins: [
		...(省略相同代码)
		new CleanWebpackPlugin(),
	]
}
```
现在我们每次打包，`clean-webpack-plugin`会先清除dist文件夹下所有的内容，进入下一阶段
## 4.优化配置
1. 通过一系列的插件来优化打包结果。
2. `npm i -D uglifyjs-webpack-plugin optimize-css-assets-webpack-plugin`
`uglifyjs-webpack-plugin optimize-css-assets-webpack-plugin` 分别是压缩js、css的插件
```javascript
...(省略相同代码)
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
	...(省略相同代码)
	plugins: [
		...(省略相同代码)
		new OptimizeCssAssetsPlugin(),
		new UglifyJsPlugin({
			parallel: true,				// 开启多线程压缩
			cache: true,				// 使用缓存
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
}
```
通过使用压缩插件前后的打包对比
![使用插件压缩结果](https://img-blog.csdnimg.cn/20191022112340642.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2p6cTk1MDUyMg==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191022112447552.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2p6cTk1MDUyMg==,size_16,color_FFFFFF,t_70)
因为目前的代码量不多，但还是能看到压缩插件对打包后文件体积的优化。

3. `npm i -D happypack thread-loader`添加依赖
`释:`
js的node环境是单线程，`happypack`主要通过开启多个进程来加快打包过程，并不是绝对加快，`thread-loader`也是同样的作用，需要加在被加速的loader的前面
```javascript
...(省略相同代码)
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: 2 });

module.exports = {
	...(省略相同代码)
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
      			},
			{
        			test: /\.js$/,
        			use: 'happypack/loader?id=babel',
        			exclude: /node_modules/
			},
		]
	},
	plugins: [
		...(省略相同代码)
		new HappyPack({
      		id: 'css',
      		threadPool: HappyThreadPool,
			loaders: ['css-loader', 'postcss-loader'],
    		}),
		new HappyPack({
			id: 'babel',
      			loaders: ['babel-loader'],
      			threadPool: HappyThreadPool,
		})
	]
}
```
`注:` `vue-loader v15`已经不支持`happypack`，因此用`thread-loader`代替
`happypack` `thread-loader`目前最新版本不支持`sass-loader 8.0.1`，暂时不使用

4. 配置dll来缓存第三方库，`npm i -S vue vue-router vuex element-ui lodash axios`添加依赖并在`index.js`中引入
```javascript
import './index.scss';
import App from './App.vue';
import element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import axios from 'axios';
import _ from 'lodash';
Vue.use(element);
Vue.use(VueRouter);
Vue.use(Vuex);

new Vue({
	el: '#app',
	render: h => h(App)
})
```
现在打包结果如下![在这里插入图片描述](https://img-blog.csdnimg.cn/20191022114934468.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2p6cTk1MDUyMg==,size_16,color_FFFFFF,t_70)
可见项目体积变大了很多，很多第三方库不是我们经常改动的地方，每次打包不用每次都打包这块代码，除非要升级第三方库的版本。使用`dllPlugin`来预先打包第三方库。
在`build`文件夹下新建`webpack.dll.js`文件
```javascript
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
```
在`package.json`中添加`script` `"build-dll": "webpack --config=build/webpack.dll.js"`
现在通过`npm run build-dll`打包第三方库，在出口中的library是打包好的library标识，与dllPlugin里的name相同，并生成`manifest.json`文件,主要是标明library的模块连接。
最后在`webpack.prod.js`将打包好的第三方库来与其他包进行整合，`npm i -D add-asset-html-webpack-plugin`
```javascript
...(省略相同代码)
const path = require('path');
const libPath = path.resolve(__dirname, '../libs');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = {
	...(省略相同代码)
	plugins: [
		new HtmlWebpackPlugin({
			template: htmlPath,
			filename: 'index.html',
			minify: true
		}),
		new webpack.DllReferencePlugin({
      			context: __dirname,
      			manifest: require('../libs/lib-manifest.json')
		}),
		new AddAssetHtmlPlugin({
      			filepath: path.resolve(libPath, '*.js'),
      			outputPath: 'js'
    		}),
	]
}
```
dllReferencePlugin是对第三方库`manifest.json`的引用，可以通过此文件排除已打包好的内容，`add-asset-html-webpack-plugin`能将打包好的第三方库复制到目标目录下。再次构建，使用`dllPlugin`前后的构建速度差异巨大
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191022134710630.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191022134724122.png)

5. 使用`optimization`来配置缓存组等优化配置
```javascript
...(省略相同代码)
module.exports = {
	...(省略相同代码)
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
      		cacheGroups: {
        		vendors: {
          			name: "vendors",
          			test: /[\\/]node_modules[\\/]/,
          			chunks: "all",
          			priority: -10,
          			reuseExistingChunk: true,
				},
			}
		}
	}
}
```
`释:` 
`runtimeChunk`将各个chunk运行时文件单独打包出来
`splitChunks`的`cacheGroups`开启缓存组，对`node_modules`进行缓存复用，同样作用于开发时配置。现在打包结果如下，进入下一阶段![在这里插入图片描述](https://img-blog.csdnimg.cn/20191022135833197.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2p6cTk1MDUyMg==,size_16,color_FFFFFF,t_70)
## 5.配置dev
1. `npm i -D style-loader webpack-dev-server`添加依赖
2. 在`package.json` `scripts`中添加`"dev": "webpack-dev-server --progress --config=build/webpack.dev.js"`
3. 
```javascript
// webpack.dev.js
const path = require('path');
const entryPath = path.resolve(__dirname, '../src/index.js');
const outputPath = path.resolve(__dirname, '../dist');
const htmlPath = path.resolve(__dirname, '../public/index.html');
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: 2 });
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	entry: {
		app: entryPath
	},
	output: {
		path: outputPath,
		filename: 'js/[name].[hash:8].js',
    	publicPath: '/'
	},
	devtool: '#cheap-module-eval-source-map',
	devServer: {
		port: 8088,
		open: true,
		overlay: true,
		hot: true
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
					'style-loader',
					'css-loader', 
					'postcss-loader', 
					'sass-loader'
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
              						name: 'assets/[name].[hash:8].[ext]'
            					}
          				}
        			]
      			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: htmlPath,
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
	],
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
      		cacheGroups: {
        	vendors: {
          		name: "vendors",
          		test: /[\\/]node_modules[\\/]/,
          		chunks: "all",
          		priority: -10,
          		reuseExistingChunk: true,
				},
			}
		}
	}
}
```
`释:`主要`devServer`的配置，`port`为浏览器监听端口，`open`自动打开浏览器，`overlay`将错误和警告输出到浏览器上，`hot`配合`HotModuleReplacementPlugin`使用热更新
`npm run dev`便可以进行浏览器调试

## 6.合并配置
1. 现在`webpack.dev.js`和`webpack.prod.js`有许多相同的配置，通过`webpack-merge`来合并配置简化代码
2. `npm i -D webpack-merge`添加依赖
3. `build`文件夹下新建`webpack.base.js`文件，提取`webpack.dev.js`和`webpack.prod.js`的相同配置到此文件中。(过程略)。
4. 现各文件代码如下
```javascript
// webpack.base.js
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
			loaders: ['css-loader', 'postcss-loader'],
    		}),
		new HappyPack({
			id: 'babel',
      			loaders: ['babel-loader'],
      			threadPool: HappyThreadPool,
		}),
	],
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
      			cacheGroups: {
        			vendors: {
          				name: "vendors",
          				test: /[\\/]node_modules[\\/]/,
          				chunks: "all",
          				priority: -10,
          				reuseExistingChunk: true,
				},
			}
		}
	}
}
```
```javascript
// webpack.dev.js
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
		hot: true
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
					'style-loader',
					'css-loader', 
					'postcss-loader', 
					'sass-loader'
        			]
			},
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
})
```
```javascript
const path = require('path');
const libPath = path.resolve(__dirname, '../libs');
const webpackBaseConfig = require('./webpack.base');
const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

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
		new CleanWebpackPlugin(),
		new webpack.DllReferencePlugin({
      			context: __dirname,
      			manifest: require('../libs/lib-manifest.json')
		}),
		new AddAssetHtmlPlugin({
      			filepath: path.resolve(libPath, '*.js'),
      			outputPath: 'js'
    		}),
		new MiniCssExtractPlugin({
      			filename: "css/[name].[hash:8].css",
      			chunkFilename: "css/[name].[chunkhash:8].css"
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
```

## 7.eslint-loader
1.`npm i -D eslint eslint-laoder eslint-plugin-vue`添加依赖 使用`eslint-loader`来进行代码检查
2.根目录下添加`.eslintrc.js`配置文件，编写基于个人实际情况的代码规范规则
3.在`webpack.dev.js`中加入`eslint-loader`，在开发中进行代码检查
```javascript
...(省略相同代码)
module.exports = WebpackMerge(webpackBaseConfig, {
	...(省略相同代码)
	module: {
		rules: [
			...(省略相同代码)
			{
				test: /\.(vue|js|jsx)$/,
				enforce: 'pre',
				exclude: /node_modules/,
				loader: 'eslint-loader'
			}
		]
	},
	...(省略相同代码)
});
```

## 8.结语
目前是较为通用的webpack版本，开发者可以根据项目的实际情况和[官方文档](https://www.webpackjs.com/concepts/)在进行深入优化配置。
