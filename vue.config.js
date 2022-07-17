const Components = require('unplugin-vue-components/webpack')
const {VarletUIResolver, ArcoResolver} = require('unplugin-vue-components/resolvers')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: {
    resolve: {
      alias: {
        "assets": "@/assets",
        "components": "@/components",
        "views": "@/views",
        "wraps": "@/wraps",
      }
    },
    plugins: [
      Components({
        resolvers: [VarletUIResolver(), ArcoResolver()]
      })
    ]
  }
}
