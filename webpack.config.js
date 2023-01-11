const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const CnameWebpackPlugin = require('cname-webpack-plugin');
const settings = require('./settings');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const entry = path.join(__dirname, './src/index.tsx');
const port = 8262;
const output = path.join(__dirname, './dist');
const publicPath = mode === 'production' ? settings.repoPath || '/' : '/';

module.exports = {

  mode,
  optimization: {
    minimizer: [new TerserJSPlugin({})],
    runtimeChunk: 'single',
  },

  devServer: {
    port,
    compress: true,
    contentBase: output,
    publicPath,
    stats: { colors: true },
    hot: true,
    historyApiFallback: true,
    open: true,
  },

  devtool: mode === 'production' ? false : 'eval',

  entry:
    mode === 'production'
      ? entry
      : [
          `webpack-dev-server/client?http://localhost:${port}`,
          'webpack/hot/only-dev-server',
          entry,
        ],

  output: {
    path: output,
    filename: '[name].js',
    publicPath,
  },

  resolve: {
    modules: [path.join(__dirname, './node_modules')],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, './src'),
        use: 'ts-loader',
      },
      {
        test: /\.(svg|png|jpg|gif|woff|woff2|otf|ttf|eot)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(css|sass|scss)$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /node_modules\/https-proxy-agent\//,
        use: 'null-loader',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
      },
    }),
    new HtmlWebpackPlugin({
      favicon: path.join(__dirname, './favicon-32x32.png'),
      templateContent: ({ htmlWebpackPlugin }) => `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta property='og:title' content='${settings.title}'/>
            <meta property='og:image' content='https://i.ibb.co/R2RsKnM/nm-slippi-thumb.png'/>
            <meta property='og:description' content='${settings.title}'/>
            <meta property=’og:url’ content='https://izzythecubemaster.github.io/NMSlippiLeaderboard/#/'/>
            <meta property='og:image:width' content='1200' />
            <meta property='og:image:height' content='627' />
            <meta property="og:type" content='website'/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
            <link rel="manifest" href='data:application/manifest+json,{
              "name":"","short_name":"","icons":[{"src":"/android-chrome-192x192.png","sizes":"192x192","type":"image/png"},{"src":"/android-chrome-512x512.png","sizes":"512x512","type":"image/png"}],"theme_color":"#ffffff","background_color":"#ffffff","display":"standalone"
            }' />
            <title>${settings.title}</title>
          </head>
          <body class="bg-gray-600">
            <noscript>
              Enable JavaScript to use Frontend toolbox
            </noscript>

            <div id="app"></div>
            ${htmlWebpackPlugin.tags.bodyTags}
          </body>
        </html>
      `,
    }),
    ...(mode !== 'production'
      ? [new webpack.HotModuleReplacementPlugin()]
      : [...(settings.cname ? [new CnameWebpackPlugin({ domain: settings.cname })] : [])]),
  ],
};
