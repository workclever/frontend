module.exports = {
  plugins: [],
  webpack: {
    configure: (webpackConfig) => {
      // Remove the ModuleScopePlugin which throws when we try to import something outside of src/.
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );
      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return webpackConfig;
    },
  },
};