module.exports = {
  images: process.env.FILES_PROVIDER_IMAGES || 'http://localhost:8085/images/',
  reports:
    process.env.FILES_PROVIDER_REPORTS || 'http://localhost:8085/reports/'
}
