const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
require('env-yaml').config({path: '.././Analytics/settings/config.env.yml'});

module.exports = (env) => {
  return {
    devServer: {
    historyApiFallback: true,
    host:process.env.NODE_HOST,
    port:process.env.NODE_DEV_PORT,
    },
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: "babel-loader"
        },
        {
          test: /\.html$/,
          use: {
            loader: "html-loader",
            options: { minimize: true }
          }
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: "file-loader"
        },
        {
          test: /\.less$/,
          use: ["style-loader", "css-loader", "less-loader"]
        },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.(woff|woff2|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        },
        {
          test: /\.geojson$/,
          loader: "json-loader"
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/template.html",
        filename: "./index.html"
      }),
      new webpack.DefinePlugin({ 
        'process.env.NODE_HOST': JSON.stringify(`${process.env.NODE_HOST}`),
        'process.env.API_PORT': JSON.stringify(`${process.env.NODE_API_PORT}`),
        'process.env.HOST_PORT': JSON.stringify(`${process.env.NODE_DEV_PORT}`)
      })
    ],
    devServer: {
      historyApiFallback: true,
    },
    node: { fs: 'empty' }
  }
};
