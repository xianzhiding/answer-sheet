module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    ["component", {
      'libraryName': "umy-ui",
      "styleLibraryName": "theme-chalk"
    }, "umy-ui"]
  ]
}