const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = {
  entry: "./src/index.ts",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: path.resolve(__dirname, "assets")
  },
  devServer: {
    static: './dist',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader"
          },
        ],
      },
      {
       test: /\.png/,
       type: 'asset/resource'
     }
    ]
  },
  ignoreWarnings: [/failed to load source map/],
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
};

module.exports = config;
