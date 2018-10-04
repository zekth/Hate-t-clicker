const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const webpack = require('webpack')
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist', 'ui'),
    compress: true,
    port: 4000,
    // hot: true,
    // noInfo: false,
    // progress: true,
    // inline: true,
    // publicPath: '/dist/ui/',
    watchOptions: {
      // aggregateTimeout: 300,
      poll: true
    },
    open: true
  },
  entry: {
    app: ['babel-polyfill', './src/ui/main.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist', 'ui')
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src')
    },
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'src', 'ui'),
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      },
      // {
      //   test: /\.vue$/,
      //   loader: 'vue-loader',
      //   options: {
      //     loaders: {
      //       css: {
      //         test: /\.css$/,
      //         use: ['vue-style-loader', { loader: 'css-loader' }]
      //       },
      //       sass: {
      //         test: /\.sass$/,
      //         use: ['vue-style-loader', { loader: 'sass-loader' }]
      //       },
      //       scss: {
      //         test: /\.scss$/,
      //         use: ['vue-style-loader', { loader: 'sass-loader' }]
      //       }
      //     }
      //   }
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ['vue-style-loader', 'css-loader', 'sass-loader'],
            sass: ['vue-style-loader', 'css-loader', 'sass-loader'],
            scss: ['vue-style-loader', 'css-loader', 'sass-loader']
          }
        }
      },
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   exclude: /(node_modules|bower_components)/,
      //   include: [resolve('src/js'), resolve('src/ui')]
      // },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          // {
          //   loader: 'style-loader'
          // },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      TEST: JSON.stringify(true)
    }),
    new VueLoaderPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/ui/index.html',
      inject: true
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'assets/css/[name].css',
      chunkFilename: 'assets/css/[id].css'
    })
    // new BrowserSyncPlugin({
    //   host: 'localhost',
    //   port: 4000,
    //   server: { baseDir: ['dist/ui'] }
    // })
  ]
}
