async function practiceRoutes(app, { pool }) {
  app.get('/practice/:id', {
    schema: {
      tags: ['Practice'],
      summary: 'Fetch one practice row with a parameterized query',
      params: {
        type: 'object',
        properties: { id: { type: 'integer', minimum: 1 } },
        required: ['id'],
        additionalProperties: false,
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            label: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'label', 'created_at'],
          additionalProperties: false,
        },
        404: {
          type: 'object',
          properties: { error: { type: 'string' } },
          required: ['error'],
          additionalProperties: false,
        },
      },
    },
  }, async (request, reply) => {
    const result = await pool.query(
      'SELECT id, label, created_at FROM cli_practice WHERE id = $1',
      [request.params.id],
    )

    if (result.rowCount === 0) {
      return reply.code(404).send({ error: 'Practice row not found' })
    }

    return result.rows[0]
  })

  app.post('/practice/batch', {
    schema: {
      tags: ['Practice'],
      summary: 'Insert several practice rows in one transaction',
      body: {
        type: 'object',
        properties: {
          labels: {
            type: 'array',
            minItems: 1,
            maxItems: 20,
            items: { type: 'string', minLength: 1 },
          },
        },
        required: ['labels'],
        additionalProperties: false,
      },
      response: {
        201: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  label: { type: 'string' },
                  created_at: { type: 'string', format: 'date-time' },
                },
                required: ['id', 'label', 'created_at'],
                additionalProperties: false,
              },
            },
          },
          required: ['items'],
          additionalProperties: false,
        },
      },
    },
  }, async (request, reply) => {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const result = await client.query(
        `INSERT INTO cli_practice (label)
         SELECT label
         FROM unnest($1::text[]) AS input(label)
         RETURNING id, label, created_at`,
        [request.body.labels],
      )

      await client.query('COMMIT')
      return reply.code(201).send({ items: result.rows })
    } catch (error) {
      try {
        await client.query('ROLLBACK')
      } catch (rollbackError) {
        app.log.error(rollbackError, 'Failed to roll back practice batch')
      }
      throw error
    } finally {
      client.release()
    }
  })
}

export default practiceRoutes
