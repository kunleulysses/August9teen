module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      },
      modules: false // Keep ES modules for Jest ESM support
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }]
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: 'current'
          },
          modules: 'commonjs' // Use CommonJS for Jest
        }],
        ['@babel/preset-react', {
          runtime: 'automatic'
        }]
      ]
    }
  }
};