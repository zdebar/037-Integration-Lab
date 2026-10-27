import 'dotenv/config'
import app from './app.js'

const port = Number(process.env.PORT ?? 3000)

try {
  await app.listen({ port, host: '0.0.0.0' })
} catch (error) {
  app.log.error(error)
  await app.close()
  process.exitCode = 1
}
