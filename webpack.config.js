const path = require('path');

module.exports = {
  entry: './scripts/main_original.js', // Entry point of your JavaScript
  output: {
    filename: 'bundle.js', // Bundled file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'production', // Set to production mode to enable optimizations
  module: {
    rules: [
      {
        test: /\.js$/, // Apply to .js files
        exclude: /node_modules/, // Exclude node_modules
        use: {
          loader: 'babel-loader', // Use Babel for transpiling
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
