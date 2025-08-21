# 📌 DevOps/Dev Stacks Reference (JavaScript + Postgres focus)

---

## 🌐 Consumer-Facing Applications

| Stack | UI | API | DB | Notes |
|-------|----|-----|----|-------|
| **Consumer A** | **Next.js (JS)** (React framework for SSR, SEO, PWA) | **Fastify (JS)** (lightweight Node.js API framework) + optional REST/tRPC | **Postgres** (via Sequelize or Prisma in JS mode) | JS end-to-end, PWA-ready, great for portals & dashboards |
| **Consumer B** | **SvelteKit (JS)** (modern UI, SSR/CSR hybrid, tiny bundles) | **Express** or **Fastify (JS)** | **Postgres** (via Sequelize or Knex.js) | Minimal boilerplate, excellent performance, smaller footprint |

**Shared Tools (Consumer):**
- **Auth:** Keycloak (OIDC) → JWT or secure cookies  
- **Realtime:** Socket.IO or SSE  
- **Storage:** MinIO (S3-compatible, on-prem)  
- **Jobs:** BullMQ (Redis-based)  

---

## 🏢 Enterprise Applications

| Stack | UI | API | DB | Notes |
|-------|----|-----|----|-------|
| **Enterprise 1 (JS)** | **React (Vite, JS)** | **Express (JS)** or **Fastify (JS)** | **Postgres + Sequelize/Knex.js** | Fully JS, avoids TypeScript; simpler tooling, works well with monorepo (Turborepo) |
| **Enterprise 2 (Python)** | **React (JS)** (or Angular if TS acceptable) | **FastAPI (Python)** | **Postgres + SQLAlchemy** | Strong API contracts, async-first, fits data/integration services |

**Shared Tools (Enterprise):**
- **Auth:** Keycloak (SSO, RBAC, OIDC)  
- **Background jobs:** BullMQ (JS) / Celery (Python)  
- **Messaging:** Kafka or RabbitMQ (if needed)  
- **Observability:** OpenTelemetry SDKs → Prometheus + Grafana + Loki  

---

## ⚙️ Tech One-Liner Descriptions (JS-first)

- **Next.js (JS)** → React framework with SSR/SSG, PWA, SEO-friendly  
- **SvelteKit (JS)** → UI framework with SSR + minimal JS runtime  
- **React (JS)** → Component-based UI library, flexible for enterprise or consumer apps  
- **Angular (TS)** → Enterprise UI framework, requires TypeScript (skip if strictly JS-only)  
- **Express (JS)** → Minimalist Node.js web framework, mature ecosystem  
- **Fastify (JS)** → Faster Node.js framework, plugin system, modern alternative to Express  
- **Sequelize (JS ORM)** → Popular JS ORM for SQL DBs, migrations included  
- **Knex.js (Query builder)** → SQL query builder for JS, migration support  
- **Postgres** → Relational DB, extensible, battle-tested  
- **Keycloak** → Identity Provider (OIDC/SAML) for auth/SSO  
- **BullMQ** → Redis-backed job/task queue for Node.js  
- **Celery** → Python distributed task queue  
- **MinIO** → S3-compatible object storage, runs on-prem  
- **PgBouncer** → Lightweight Postgres connection pooler  
