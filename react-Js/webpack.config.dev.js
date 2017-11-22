const path = require('path');
var webpack = require('webpack');

module.exports = {
  // The base directory for resolving the entry option
  context: __dirname,
  devtool: 'eval',

  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://0.0.0.0:7070',
      'webpack/hot/only-dev-server',
      './src/index.hot'
    ],
    vendor: [
      'react',
      'react-dom',
      'flexboxgrid',
    ],
  },

  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/assets/',
    filename: '[name].dev.js',
    pathinfo: true
  },

  // Where to resolve our loaders
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')],
    moduleExtensions: ['-loader'],
  },

  resolve: {
    // Directories that contain our modules
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ],
    descriptionFiles: ['package.json'],
    moduleExtensions: ['-loader'],
    // Extensions used to resolve modules
    extensions: ['.js', '.react.js', '.scss', '.css']
  },

  module: {
    rules: [
            {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        use: ['file']
      },
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          'babel',
          'react-hot-loader/webpack'
        ],
        exclude: [/node_modules/]
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({'process.env': {NODE_ENV: '"development"'}}),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: Infinity,
    }),
    ],

  // Include mocks for when node.js specific modules may be required
  node: {
    fs: 'empty',
    vm: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
