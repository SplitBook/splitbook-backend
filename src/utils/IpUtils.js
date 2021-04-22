const fileProviderConfig = require('../config/fileProviderConfig')

module.exports = {
  getImagesAddress(filename) {
    const url = filename ? fileProviderConfig.images + filename : null

    return url
  },

  getReportsAddress(filename) {
    const url = filename ? fileProviderConfig.reports + filename : null

    return url
  }
}
