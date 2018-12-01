const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: [path.join(__dirname, 'src', 'public/js/index.js')],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'src/dist'),
    publicPath: '/'
  },

  plugins: [
    new CleanWebpackPlugin(['src/dist']),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'OurPic',
      template: path.join(__dirname, 'src', 'public/index.html')
    }),
    new HtmlWebpackPlugin({
      filename: '404.html',
      title: 'OurPic-404',
      template: path.join(__dirname, 'src', 'public/404.html'),
      chunks: ['404']
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  }
};
