const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');

module.exports = {
  devServer: {
   historyApiFallback: true,
   host:'localhost',
   port:'8080',
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
    new Dotenv(),
    new HtmlWebPackPlugin({
      template: "./src/template.html",
      filename: "./index.html"
    })
  ],
  devServer: {
    historyApiFallback: true,
  },
};
