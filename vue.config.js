module.exports = {
  // https://cli.vuejs.org/config/#css-extract

  configureWebpack: {
    devtool: 'source-map',
  },

  css: {
    extract: process.env.NODE_ENV === 'production' && { ignoreOrder: true },
    sourceMap: process.env.NODE_ENV === 'production',
    loaderOptions: {
      sass: {
        additionalData: "@import '~@/assets/scss/vuetify/variables'",
      },
      scss: {
        additionalData: "@import '~@/assets/scss/vuetify/variables';",
      },
    },
  },

  chainWebpack: (config) => {
    // Remove the following lines to add Vue Prefetch and Preload on index.html
    // https://cli.vuejs.org/guide/html-and-static-assets.html#disable-index-generation
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
  },

  lintOnSave: false,
  transpileDependencies: ['vuetify'],
};
