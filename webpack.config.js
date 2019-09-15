const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/_entrypoint.ts',
    output: {
        path: path.join(__dirname, 'doc')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                  appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
              test: /\.html$/,
              loader: "html-loader"
            },
            {
              test: /\.scss$/,
              loader: 'vue-style-loader!css-loader!sass-loader'
            },
            {
              test: /\.sass$/,
              loader: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
            }
        ]
    },
    resolve: {
      extensions: [
        '.js',
        '.ts',
        '.vue'
      ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({title: null})
    ],
    devServer: {
      port: 8888,
      hot: true,
      overlay: true
    }
};