const path = require('path')
const VersionFile = require('webpack-version-file')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@resources': path.resolve(__dirname, 'resources')
      }
    },
    plugins: [
      new VersionFile({
        output: './dist/version.txt',
        package: './package.json'
      })
    ]
  },
  transpileDependencies: [
    'vuetify'
  ]
}
