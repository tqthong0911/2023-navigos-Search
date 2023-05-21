/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

/** @type {(env: any, arg: {mode: string}) => import('webpack').Configuration} **/
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  const isAnalyze = Boolean(env?.analyze)
  /** @type {import('webpack').Configuration} **/
  const config = {
    resolve: {
      // Giải quyết các file theo thứ tự ưu tiên từ trái sang phải nếu import
      // các file cùng một tên nhưng các đuôi mở rộng
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        // Cấu hình alias cho webpack
        // để khi import cho ngắn gọn
        // Ví dụ: import Login from '@pages/Login'
        // Thay vì: import Login from '../pages/Login' chẳng hạn
        '@pages': path.resolve(__dirname, './src/pages'),
        '@common': path.resolve(__dirname, './src/common'),
        '@components': path.resolve(__dirname, './src/components')
      }
    },
    // File start cho webpack
    entry: ['./src/index.tsx'],
    // Module dùng trong webpack
    module: {
      rules: [
        {
          test: /\.tsx?$/, // duyệt các file .ts || .tsx
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.(s[ac]ss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader', // dùng import 'filename.css' trong file tsx, ts
              options: { sourceMap: !isProduction } // Hiển thị sourcemap ở môi trường dev cho dễ debug
            },
            {
              loader: 'sass-loader', // biên dịch sass sang css
              options: { sourceMap: !isProduction }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/, // Dùng để import file ảnh, nếu có video/ảnh định dạng khác thì thêm vào đây
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isProduction ? 'static/media/[name].[contenthash:6].[ext]' : '[path][name].[ext]'
              }
            }
          ]
        }
      ]
    },

    output: {
      filename: 'static/js/main.[contenthash:6].js', // Thêm mã hash 6 kí tự vào tên file để tránh bị cache bởi CDN hay browser.
      path: path.resolve(__dirname, 'dist'), // Thư mục output build
      publicPath: '/'
    },
    devServer: {
      hot: true, // Hot reload
      port: 3000, // Port dev
      historyApiFallback: true, // Support lazyload module React
      static: {
        directory: path.resolve(__dirname, 'public', 'index.html'),
        serveIndex: true,
        watch: true // watch content trong index.html thì reload
      }
    },
    devtool: isProduction ? false : 'source-map',
    plugins: [
      // Đưa css ra thành một file .css riêng biệt thay vì bỏ vào file .js
      new MiniCssExtractPlugin({
        filename: isProduction ? 'static/css/[name].[contenthash:6].css' : '[name].css'
      }),
      // Sử dụng env
      new Dotenv(),
      // Copy mọi files trong folder public trừ file index.html
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: '.',
            filter: (name) => {
              return !name.endsWith('index.html')
            }
          }
        ]
      }),

      // Plugin hỗ trợ thêm tag style và script vào index.html
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
        filename: 'index.html'
      }),
      // Thêm eslint cho webpack
      new ESLintPlugin({
        extensions: ['.tsx', '.ts', '.js', '.jsx']
      })
    ]
  }

  if (isProduction) {
    config.plugins = [
      ...config.plugins,
      new webpack.ProgressPlugin(), // Hiển thị % khi build
      // Nén brotli css và js
      new CompressionPlugin({
        test: /\.(css|js)$/,
        algorithm: 'brotliCompress'
      }),
      new CleanWebpackPlugin() // Clean thư mục build trước khi build
    ]
    if (isAnalyze) {
      config.plugins = [...config.plugins, new BundleAnalyzerPlugin()]
    }
    config.optimization = {
      minimizer: [
        `...`, // Cú pháp kế thừa bộ minimizers mặc định trong webpack 5 (i.e. `terser-webpack-plugin`)
        new CssMinimizerPlugin() // minify css
      ]
    }
  }
  return config
}
