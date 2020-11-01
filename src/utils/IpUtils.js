module.exports = {
  getImagesAddress(filename) {
    const url = filename
      ? (process.env.IMAGES_URL || 'http://localhost:8085/images/') + filename
      : null;

    return url;
  },

  getReportsAddress(filename) {
    const url = filename
      ? (process.env.REPORTS_URL || 'http://localhost:8085/reports/') + filename
      : null;

    return url;
  },
};
