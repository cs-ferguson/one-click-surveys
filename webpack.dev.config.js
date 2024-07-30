const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    watch: true,
    entry: './src/js/index.js',
    output: {
    filename: './js/index.js',
    path: path.resolve(__dirname, 'public'),
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html', inject: false }),
    new MiniCssExtractPlugin({ filename: './css/styles.css'}),
  ],
  module: {
    rules: [
        {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
    ],
  },
  
};