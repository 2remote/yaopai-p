const path = require('path')// 用于定位路径
const HtmlwebpackPlugin = require('html-webpack-plugin')// HTML template 处理
const OpenBrowserPlugin = require('open-browser-webpack-plugin')// 处理完自动打开浏览器
const webpack = require('webpack')// The Webpack
const merge = require('webpack-merge')// 合并配置
const Clean = require('clean-webpack-plugin')// 清理build用

// 配置思路
// 4个环境：
// 1. dev环境 - user端
// 2. dev环境 - grapher端
// 3. prod环境 - user端
// 4. prod环境 - grapher端

/* 1. 基本常量 */
const ROOT_PATH = path.resolve(__dirname) // 根路径
const APP_PATH = path.resolve(ROOT_PATH, 'app') // 源码路径
const DIST_PATH = path.resolve(ROOT_PATH, 'dist')
/* 2. 决定环境的变量 */
const TARGET = process.env.NODE_ENV // 从npm中获取目标环境
const autoOpenBrowser = !process.env.YAOPAI_DISABLE_AUTO
const PORT = process.env.YAOPAI_PORT_P || 8000
// TODO: 从target转换成env和app信息
const targetEnv = (TARGET === 'production' ? 'prod' : 'dev')


// alias放这里，看着方便
const alias = {
  app: APP_PATH, // app root
  // 功能组件
  main: path.resolve(APP_PATH, 'main'), // 主页
  user: path.resolve(APP_PATH, 'user'), // 用户
  photographer: path.resolve(APP_PATH, 'photographer'), // 摄影师
  makeupartist: path.resolve(APP_PATH, 'makeupartist'), // 化妆师
  mote: path.resolve(APP_PATH, 'mote'), // 模特
  routes: path.resolve(APP_PATH, 'routes'),
  // 工具类
  util: path.resolve(APP_PATH, 'util'),
  yaopai: path.resolve(APP_PATH, 'yaopai'), // 邀拍组件
  components: path.resolve(APP_PATH, 'scripts', 'components'), // old shit

  // assets
  image: path.resolve(APP_PATH, 'image'), // 图片
  css: path.resolve(APP_PATH, './css'), // 样式
}

// 这些变量存设置
let common = { }// 通用
let envConfig = {
  resolve: {},
  module: {},
  plugins: [],
}

/* 4. 通用配置 */
common = {
  /* ================================================================ */
  /* 入口: entry */
  /* ================================================================ */
  entry: path.resolve(APP_PATH, 'app.js'),
  exclude: path.resolve(ROOT_PATH, 'node_modules'),
  /* ================================================================ */
  /* 输出 */
  /* ================================================================ */
  output: {
    path: DIST_PATH,
    filename: 'bundle.js',
  },
  /* ================================================================ */
  /* 增强debug: 全环境都要有source-map */
  /* ================================================================ */
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js', '.jsx'],
    /* ================================================================ */
    /* 关联: alias */
    /* ================================================================ */
    alias,
  },
  module: {
    /* ================================================================ */
    /* XXX: 这是啥 */
    /* ================================================================ */
    noParse: /validate\.js/,
    loaders: [
      /* ================================================================ */
      /* babel transcompiles React code (js & jsx) */
      /* ================================================================ */
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        // include: path.resolve(APP_PATH, 'app'),
      },
      /* ================================================================ */
      /* 处理scss代码 IDEA: @可乐 这个要不要增加处理sass, css的扩展名 */
      /* ================================================================ */
      {
        test: /\.s?css$/,
        loaders: ['style', 'css'],
      },
      /* ================================================================ */
      /* TODO: 处理图片 */
      /* ================================================================ */
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
      /* ================================================================ */
      /* XXX: 这个是什么鬼 */
      /* ================================================================ */
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  plugins: [
    /* ================================================================ */
    /* HTML模板处理 */
    /* ================================================================ */
    new HtmlwebpackPlugin({
      template: path.resolve(APP_PATH, 'index.tpl'),
      minify: {
        removeComments: true, // 移除注释
      },
    }),
  ],
  // node: {
  //   fs: 'empty',
  //   net: 'empty',
  //   tls: 'empty',
  // },
}
/* 5. 开发 || 正式 */
if (targetEnv === 'dev') { // dev
  envConfig = {
    /* ================================================================ */
    /* 预处理: preLoader */
    /* ================================================================ */
    // module: {
    //   preLoaders: [{
    //     test: /\.jsx?$/,
    //     loaders: ['eslint'],
    //   }],
    // },
    /* ================================================================ */
    /* 插件: plugins */
    /* ================================================================ */
    plugins: [
      // 热替换
      new webpack.HotModuleReplacementPlugin(),
    ],
    /* ================================================================ */
    /* 开发服务器: devServer */
    /* ================================================================ */
    devServer: {
      histroyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      port: PORT,
      // proxy: {
      //   '/imgs/*': 'http://localhost:5000/',
      // },
      host: '0.0.0.0', // 允许局域网访问
    },
  }

  if (autoOpenBrowser) {
    envConfig.plugins.push(// 自动打开浏览器
      new OpenBrowserPlugin({
        url: `http://localhost:${PORT}`, // IDEA: 这个port能不能import进来？
        // 这里写要打开的浏览器名字，若不填，会打开默认浏览器
        // Mac系统下可以选：Safari, Google Chrome, Firefox
        // browser: 'Google Chrome',
      })
    )
  }
}

if (targetEnv === 'prod') { // prod
  envConfig = {
    /* ================================================================ */
    /* 入口分为app和vendor */
    /* 参考：http://webpack.github.io/docs/code-splitting.html */
    /* ================================================================ */
    entry: {
      app: path.resolve(APP_PATH, 'scripts', 'app.js'),
      vendor: [
        'jquery',
        'react',
        'react-dom',
        // 'react-redux',
        'react-router',
        // 'react-router-redux',
        // 'redux',
        // 'redux-thunk'
      ],
    },
    /* ================================================================ */
    /* app -> bundle.js */
    /* ================================================================ */
    output: {
      path: DIST_PATH,
      filename: 'bundle.js?[chunkhash]',
    },
    plugins: [
      /* ================================================================ */
      /* IDEA: 这个要不要配置成路径？ */
      /* ================================================================ */
      new Clean([DIST_PATH]),
      /* ================================================================ */
      /* 把公用的module抽出来放进vendor里 */
      /* （然后原本bundle.js中的这些来源于vendor的module就抽出来了） */
      /* ================================================================ */
      new webpack.optimize.CommonsChunkPlugin(
        'vendor',
        'vendor.bundle.js'
      ),
      /* ================================================================ */
      /*  Uglify */
      /* ================================================================ */
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      /* ================================================================ */
      /* 注入环境变量 NODE_ENV 为 production */
      /* 不用这个的时候，Redux会报错说用的版本不是生产版本 */
      /* 参考：https://github.com/reactjs/redux/issues/1029 */
      /* ================================================================ */
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
      }),
    ],
  }
}

/**
 * 根据前面的逻辑做完config配置，合并一下输出
 * envConfig放最后：prod环境下envConfig的配置要覆盖前面(common)的配置
 * @param: common: 通用配置
 * @param: envConfig: 根据是dev还是prod的配置定制
**/
module.exports = merge(common, envConfig)
