module.exports = {
  getImagesAddress(filename) {
    const url = filename ? 'http://localhost:8085/images/' + filename : null;

    return url;
  },
};
