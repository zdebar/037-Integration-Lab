export const openApiOptions = {
  openapi: {
    openapi: '3.0.3',
    info: {
      title: 'Integration Lab API',
      description: 'Local API for the Integration Lab project.',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local development' }],
    tags: [
      { name: 'System', description: 'API and database health checks' },
      { name: 'Practice', description: 'Small PostgreSQL learning examples' },
    ],
  },
}

export const swaggerUiOptions = {
  routePrefix: '/documentation',
}
