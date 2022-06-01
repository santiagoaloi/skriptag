module.exports = {
  // https://cli.vuejs.org/config/#css-extract

  configureWebpack: {
    devtool: 'source-map',
  },

  css: {
    extract: { ignoreOrder: true },
    loaderOptions: {
      sass: {
        additionalData: "@import '~@/assets/scss/vuetify/variables'",
      },
      scss: {
        additionalData: "@import '~@/assets/scss/vuetify/variables';",
      },
    },
  },

  lintOnSave: false,
  transpileDependencies: ['vuetify'],
};
