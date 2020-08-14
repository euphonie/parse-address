const path = require("path");

module.exports = {
  entry: "./src/address.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "address-parser.min.js",
    libraryTarget: 'commonjs',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/, //using regex to tell babel exactly what files to transcompile
        exclude: /node_modules/, // files to be ignored
        use: {
          loader: "babel-loader" // specify the loader
        }
      }
    ]
  }
};
