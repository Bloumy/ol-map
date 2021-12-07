const webpack = require("webpack");
const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
var JsDocPlugin = require('jsdoc-webpack-plugin');
const PolyfillInjectorPlugin = require('webpack-polyfill-injector');

let config = {

  entry: {
    'app': `webpack-polyfill-injector?${JSON.stringify({
      modules: ['./src/index.js'],
      singleFile: true,
      filename: 'polyfill.js'
    })}!`,
    'app.min': `webpack-polyfill-injector?${JSON.stringify({
      modules: ['./src/index.js'],
      singleFile: true,
      filename: 'polyfill.min.js'
    })}!`
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new PolyfillInjectorPlugin({
      polyfills: [
        'Element.prototype.classList',
        'requestAnimationFrame',
      ]
    }),
    new CleanWebpackPlugin({
      verbose: true,
      dry: false
    }),
    new ESLintPlugin({
      extensions: ['js'],
      exclude: ["node_modules"],
      fix: true
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css"
    }),
    new JsDocPlugin({
      conf: 'jsdoc.conf.json',
      cwd: '.',
      preserveTmpFile: false,
      recursive: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          }
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        test: /\.min\.css$/
      }),
      new TerserPlugin({
        test: /\.min\.js$/
      })
    ],
    minimize: true,
  },
  externals: {
    'jquery': '$',
    'ol': 'ol',
  },
}

module.exports = config;
