const path = require('path');

module.exports = {

  entry: {
    home: './client/home/index.jsx',
    about: './client/about/index.jsx',
    email: './client/email/index.jsx',
    links: './client/links/index.jsx',
    miniapps: './client/miniapps/index.jsx'
  },

  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        use: [{ loader: 'babel-loader'}],
        exclude: /(node_modules)/,
      },

      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader'},
          { loader: 'css-loader', options: { modules: true } },
        ],
      },

      {
        test: /.(png|jpe?g|svg)$/,
        use: [
          { loader: 'file-loader'}
        ],
        exclude: /.(png|jpe?g|svg)$/,
      },

      {
        test: /\.html$/,
        use: [
          { loader: 'file-loader' },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  output: {
    filename: 'bundles/[name]-bundle.js',
    path: path.resolve(__dirname, 'public'),
  },

};
