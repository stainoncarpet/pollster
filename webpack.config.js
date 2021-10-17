const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const RobotstxtPlugin = require("robotstxt-webpack-plugin");
const SitemapPlugin = require('sitemap-webpack-plugin').default;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = (env) => {
  const isProduction = env === 'production';

  if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: '.env/test.env' });
  } else if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: '.env/development.env' });
  }

  return {
    entry: "./src/index.jsx",
    output: {
      path: path.join(__dirname, 'build'),
      publicPath: process.env.ASSET_PATH || '/',
      filename: '[name].[contenthash].js'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader']
        },
        {
          test: /\.s[ac]ss$/i,
          use: ['style-loader','css-loader','sass-loader']
        },
        {
          test: /\.(jpg|png|svg)$/,
          use: {
            loader: 'url-loader',
            options: {
              fallback: require.resolve('responsive-loader'),
              quality: 85
            }
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new SitemapPlugin({ base: 'https://pollsterrr.herokuapp.com/', paths: [{
        path: '/',
        lastmod: new Date().toISOString().split('T')[0],
        priority: 1,
        changefreq: 'weekly'
      }] }),
      new RobotstxtPlugin({
        policy: [
          {
            userAgent: "*",
            allow: "*",
            crawlDelay: 10
          }
        ],
        sitemap: "https://pollsterrr.herokuapp.com/sitemap.xml",
        host: "https://pollsterrr.herokuapp.com/",
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, 'src', 'index.html'),
        favicon: './src/favicon.ico',
        inject: "body",
        chunks: "all"
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      new webpack.DefinePlugin({
        AUTH_TOKEN_LIFESPAN_IN_DAYS: JSON.stringify(process.env.AUTH_TOKEN_LIFESPAN_IN_DAYS),
        REFRESH_TOKEN_LIFESPAN_IN_DAYS: JSON.stringify(process.env.REFRESH_TOKEN_LIFESPAN_IN_DAYS),
        ONE_DAY_IN_SECONDS: 86400,
        REFRESH_TOKEN_POLLING_TIME_IN_MILISECONDS: JSON.stringify(process.env.REFRESH_TOKEN_POLLING_TIME_IN_MILISECONDS)
      })
    ],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      compress: true,
      port: 3000,
      proxy: {
        "/user": {"ws": false, "target": "http://localhost:3001"}, 
        "/polls": {"ws": false, "target": "http://localhost:3001"}, 
        "/socket.io": {"ws": true,"target": "ws://localhost:3001"}
      },
      historyApiFallback: true
    },
    resolve: {
      alias: {
        'react-dom': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling'
      }
    },
    optimization: {
      minimize: isProduction,
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all'
      },
    }
  };
};