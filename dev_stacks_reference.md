# 📌 DevOps/Dev Stacks Reference (JS + Postgres focus)

---

## 🌐 Consumer-Facing Applications

| Stack | UI | API | DB | Notes |
|-------|----|-----|----|-------|
| **Consumer A** | **Next.js** (React framework for SSR, SEO, PWA) | **Fastify** (lightweight Node.js API framework) + optional **tRPC** (end-to-end typed RPC) | **Postgres + Prisma** (type-safe ORM) | Full TypeScript stack, PWA-friendly, great for portals & dashboards |
| **Consumer B** | **SvelteKit** (modern UI, SSR/CSR hybrid, tiny bundles) | **Hono** (ultra-light Node.js framework) or **Fastify** | **Postgres + Drizzle ORM** (SQL-first, migration-friendly) | Excellent performance and DX, good for fast consumer apps, smaller footprint |

**Shared Tools (Consumer):**
- **Auth:** Keycloak (OIDC) → JWT or secure cookies  
- **Realtime:** Socket.IO or SSE  
- **Storage:** MinIO (S3-compatible, on-prem)  
- **Jobs:** BullMQ (Redis-based)  

---

## 🏢 Enterprise Applications

| Stack | UI | API | DB | Notes |
|-------|----|-----|----|-------|
| **Enterprise 1 (TS)** | **Angular** (opinionated enterprise UI framework) | **NestJS** (modular Node.js framework with decorators, DI, OpenAPI support) | **Postgres + Prisma/TypeORM** | Strong structure, monorepo-friendly (Nx), scales with big teams |
| **Enterprise 2 (Python)** | **Angular** (or React admin) | **FastAPI** (Python, auto OpenAPI, Pydantic validation) | **Postgres + SQLAlchemy/SQLModel** | Schema-driven APIs, good for data-heavy or integration services, async-friendly |

**Shared Tools (Enterprise):**
- **Auth:** Keycloak (SSO, RBAC, OIDC)  
- **Background jobs:** BullMQ (TS) / Celery (Python)  
- **Messaging:** Kafka or RabbitMQ (if needed)  
- **Observability:** OpenTelemetry SDKs → Prometheus + Grafana + Loki  

---

## ⚙️ Tech One-Liner Descriptions

- **Next.js** → React framework with SSR/SSG, great for SEO and PWAs  
- **SvelteKit** → UI framework with SSR + minimal JS, small bundles  
- **Angular** → Full-featured, opinionated UI framework, enterprise-grade  
- **NestJS** → Node.js framework (inspired by Angular), modular, built-in DI & OpenAPI  
- **Fastify** → Lightweight Node.js web framework, very fast, plugin ecosystem  
- **Hono** → Minimal Node.js/Edge framework, tiny footprint  
- **FastAPI** → Python API framework, async-first, Pydantic validation, OpenAPI auto-docs  
- **Prisma** → TypeScript ORM, schema-first, great DX  
- **Drizzle ORM** → SQL-first ORM for TypeScript, lightweight migrations  
- **TypeORM** → Decorator-based TypeScript ORM, common in NestJS apps  
- **SQLAlchemy/SQLModel** → Python ORM for Postgres, schema modeling + migrations (Alembic)  
- **Postgres** → Relational database, strong SQL features, extensible  
- **Keycloak** → Open-source Identity Provider (OIDC/SAML), RBAC, SSO  
- **BullMQ** → Redis-backed job/task queue for Node.js  
- **Celery** → Python distributed task queue, supports Redis/RabbitMQ  
- **MinIO** → S3-compatible object storage, runs on-prem  
- **PgBouncer** → Lightweight Postgres connection pooler  
