export async function getDbCheck(pool) {
  const result = await pool.query('SELECT NOW() AS time, current_database() AS database')
  const row = result.rows[0]

  return {
    time: row.time.toISOString(),
    database: row.database,
  }
}
