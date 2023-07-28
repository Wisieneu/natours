const path = require('path');

module.exports = {
  entry: './public/js/index.js',
  output: {
    path: path.join(__dirname, '/public/js'),
    filename: 'bundle.js',
  },
  mode: 'development', // 'production'
};
