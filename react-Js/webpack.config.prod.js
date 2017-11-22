var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

const extractCSS = new ExtractTextPlugin({
  filename: '[name].bundle.css',
  allChunks: true,
});


var stripLogs = 'strip-loader?strip[]=console.error' +
                            '&strip[]=console.log' +
                            '&strip[]=console.warn';


module.exports = {
  // The base directory for resolving the entry option
  context: __dirname,

  entry: {
    app: './src/index',
    vendor: [
      'babel-polyfill',
      'react',
      'react-dom',
      'flexboxgrid',
    ]
  },

  output: {
    path: path.join(__dirname, 'dist/assets'),
    filename: '[name].bundle.js',
    pathinfo: true
  },

  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')],
    moduleExtensions: ['-loader'],
  },

  resolve: {
    // Directories that contain our modules
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    descriptionFiles: ['package.json'],
    moduleExtensions: ['-loader'],
    // Extensions used to resolve modules
    extensions: ['.js', '.react.js', '.scss', '.css']
  },

  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: extractCSS.extract({
          fallbackLoader: 'style-loader',
          loader: [
            { 
              loader: 'css-loader',
              options: {
                minimize: true,
                modules: true,
                sourceMap: true,
                localIdentName: '[hash:base64:5]'
              } 
            },
            'group-css-media-queries',
            { loader: 'postcss', options: { sourceMap: true } },
            {
              loader: 'sass-loader',
              options: {
                modules: true,
                includePaths: [path.join(__dirname, 'assets/css')]
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|html)$/,
        use: ['file']
      },
      {
        test: /\.js$/,
        use: ['babel', stripLogs],
        include: [path.resolve(__dirname, 'src')],
        exclude: [/node_modules/]
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({'process.env': {NODE_ENV: '"production"'}}),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      filename: 'vendor.js',
      minChunks: Infinity,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    extractCSS,
    new HtmlWebpackPlugin({
      title: 'Demo App',
      filename: 'index.html',
      template: 'index.html.ejs'
    })
  ],

  // Include mocks for when node.js specific modules may be required
  node: {
    fs: 'empty',
    vm: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
