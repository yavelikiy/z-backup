const webpack = require("webpack");
const path = require('path');

module.exports = {
    entry: {
        popup: path.join(__dirname, 'src/popup/popup.tsx'),
        background: path.join(__dirname, 'src/background/background.ts'),
    },
    output: {
        path: path.join(__dirname, 'dist/js'),
        filename: '[name].js'
    },

    module: {
      rules: [{
        test: /\.scss$/,
        include: [
          path.join(__dirname, 'node_modules/wix-style-react'),
          path.join(__dirname, 'src')
        ],
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader?modules&importLoaders=1&camelCase&localIdentName=[name]__[local]___[hash:base64:5]" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
            options: {
              includePaths: ["node_modules", "absolute/path/b"]
            }
          }
        ]
      },
        {
          test: /\.tsx?$/,
          use: [{
            loader: 'ts-loader'
          }]
        }]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.scss']
    },
    plugins: [

        // pack common vender files
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     minChunks: Infinity
        // }),

        // minify
        // new webpack.optimize.UglifyJsPlugin()
    ]
};
