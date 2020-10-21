module.exports = {
    node: {
      crypto: true,
      http: true,
      https: true,
      os: true,
      vm: true,
      stream: true
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    }
  }