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
- GraphQL: http://localhost:3000/graphql (editor: /graphiql)

Stop containers with `docker compose down` (database data is preserved).

## Experiments / Goals

### Core stack
- [x] ~~Docker Compose: frontend, API, PostgreSQL~~
- [x] ~~Frontend: Vite, React, Tailwind CSS~~
- [x] ~~Backend: Node.js, Fastify~~

### API and data
- [x] ~~OpenAPI docs for current routes~~
- [x] ~~GraphQL: PostgreSQL status query~~
- [ ] Authentication and authorization
- [x] ~~PostgreSQL basics: CLI, indexes, triggers (practised in the English app)~~
- [ ] Webhooks

#### PostgreSQL learning plan

##### 1. Setup and CLI
- [x] ~~Run PostgreSQL in Docker Compose~~
- [x] ~~Connect with `psql`; inspect the database, tables, and columns~~

##### 2. Schema and data integrity
- [x] ~~Create and evolve schema with migrations and seed data~~
- [x] ~~Use primary/foreign keys, `NOT NULL`, `UNIQUE`, and `CHECK` constraints~~
- [x] ~~Normalize related data and query it with joins~~

##### 3. SQL and application access
- [x] ~~Practice CRUD, filtering, sorting, aggregation, and pagination~~
- [x] ~~Use parameterized queries from Fastify~~
- [x] ~~Use transactions with `COMMIT` and `ROLLBACK`~~
- [ ] Configure and inspect the PostgreSQL connection pool

##### 4. Performance and concurrency
- [ ] Compare query plans with `EXPLAIN` and `EXPLAIN ANALYZE`
- [ ] Explore transaction isolation, concurrent updates, and row locks
- [ ] Try partial/composite indexes and verify when PostgreSQL uses them

##### 5. Advanced database features
- [ ] Try JSONB and full-text search
- [ ] Add an audit trigger and inspect its side effects
- [ ] Create a least-privilege database role and try row-level security
- [ ] Practice backup and restore

##### 6. Reliable events
- [ ] Persist and deduplicate incoming webhook events
- [ ] Add an outbox written in the same transaction as an app change
- [ ] Process outbox events with retries and idempotent delivery
- [ ] Compare PostgreSQL `LISTEN`/`NOTIFY` with the outbox pattern

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
