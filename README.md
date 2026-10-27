# Integration Lab

Local playground for learning web technologies and integrations.

## Run locally

```bash
docker compose up --build -d
docker compose ps
```

- Frontend: http://localhost:5173
- API: http://localhost:3000
- API docs: http://localhost:3000/documentation/

Stop containers with `docker compose down` (database data is preserved).

## Experiments / Goals

### Core stack
- [x] ~~Docker Compose: frontend, API, PostgreSQL~~
- [x] ~~Frontend: Vite, React, Tailwind CSS~~
- [x] ~~Backend: Node.js, Fastify~~

### API and data
- [x] ~~OpenAPI docs for current routes~~
- [ ] GraphQL
- [ ] Authentication and authorization
- [ ] PostgreSQL: CLI, indexes, triggers
- [ ] Webhooks

### Frontend and real-time
- [ ] Web Workers and Service Workers
- [ ] Polling, Server-Sent Events, WebSockets

### Operations
- [ ] GitHub Actions and CI/CD
- [ ] OpenTelemetry: logs, metrics, traces
- [ ] Health checks, alerts, error reporting, profiling
- [ ] Rate limiting and caching

### Integrations and background work
- [ ] Stripe
- [ ] LLM integration and chat over business data
- [ ] Email notifications
- [ ] Redis, BullMQ, background workers

### Later
- [ ] Deployment: Cloud Run or Render

Mark completed items with `[x]` and wrap their text in `~~` for strikethrough.
