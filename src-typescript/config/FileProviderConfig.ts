type FileProviderConfig = {
  images: string
  reports: string
}

export const FileProviderConfig: FileProviderConfig = {
  images:
    process.env.FILE_PROVIDER_IMAGES_URI || 'http://localhost:8085/images/',
  reports:
    process.env.FILE_PROVIDER_REPORTS_URI || 'http://localhos:8085/reports/'
}
