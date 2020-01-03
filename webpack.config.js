const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ExtensionReloader  = require('webpack-extension-reloader');


module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'content': './content.js', 
    'background': './background.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new CopyPlugin([
      { from: 'manifest.json' }
    ]),
    new ExtensionReloader({
      manifest: path.resolve(__dirname, "dist/manifest.json"),
      reloadPage: false,
    }),
  ],
};
