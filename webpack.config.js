const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    // project: './src/modules/Project.js',
    // storage: './src/modules/Storage.js',
    // task: './src/modules/Task.js',
    // todolist: './src/modules/TodoList.js',
    // UI: './src/modules/UI.js',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};