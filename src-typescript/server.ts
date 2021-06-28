import { App } from './app'

const PORT = process.env.PORT || 8085

const app = new App()

app.application.listen(PORT, () => {
  console.log(`⚡️ Server listening on port ${PORT}`)
})
