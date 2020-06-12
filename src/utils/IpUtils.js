module.exports = {
  getImagesAddress(filename) {
    const url = filename ? 'http://localhost:8085/images/' + filename : null;

    return url;
  },

  getReportsAddress(filename) {
    const url = filename ? 'http://localhost:8085/reports/' + filename : null;

    return url;
  },
};
