import pg from 'pg'
import databasePoolConfig from '../config/databasePool.js'

const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...databasePoolConfig,
})

export default pool
