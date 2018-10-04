const nodeExternals = require('webpack-node-externals')
const path = require('path')
const webpack = require('webpack')
let isCoverage = process.env.NODE_ENV === 'coverage';


module.exports = {
  devtool: 'inline-cheap-module-source-map',
  mode: 'development',
  entry: './test/index.js',
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  output: {
    filename: 'test.js',
    path: path.resolve(__dirname, 'dist', 'test'),
  },
  module: {
    rules: [
      {
        test: /test\.js$/,
        use: 'mocha-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$|\.jsx$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        },
        enforce: 'post',
        exclude: /node_modules|\.spec\.js$/,
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      TEST: JSON.stringify(true)
    })
  ],
  target: 'node',
  externals: [nodeExternals()]
}
