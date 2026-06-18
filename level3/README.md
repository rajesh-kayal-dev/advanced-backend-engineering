# Level 3 — Microservices & Load Balancing

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

Scale horizontally with Nginx load balancing and decompose into microservices with an API Gateway pattern.

---

## Core Focus & Objectives

- Configure **Nginx as a reverse proxy** with round-robin load balancing
- Run **3 stateless Express replicas** behind a single entry point
- Implement the **API Gateway pattern** using `express-http-proxy`
- Decompose a monolith into **Auth, Order, and Product microservices**
- Front multiple gateways with Nginx for high availability

---

## Architecture

### Phase 1 — Load Balancing

```mermaid
graph TB
    C["Client"] --> N["Nginx · Port 8000<br/>upstream backend {<br/>  server server1:7000;<br/>  server server2:7000;<br/>  server server3:7000;<br/>}"]
    N --> S1["server1<br/>Port 7000"]
    N --> S2["server2<br/>Port 7000"]
    N --> S3["server3<br/>Port 7000"]
    S1 --- LABEL1["SERVER_NAME=first server"]
    S2 --- LABEL2["SERVER_NAME=second server"]
    S3 --- LABEL3["SERVER_NAME=third server"]
```

### Phase 2 — API Gateway + Microservices

```mermaid
graph TB
    C["Client"] --> N["Nginx · Port 8080"]
    N --> G1["Gateway 1 · Port 8000<br/>SERVER_NAME=first gateway"]
    N --> G2["Gateway 2 · Port 8000<br/>SERVER_NAME=second gateway"]
    G1 --> A["Auth Service<br/>Port 8001"]
    G1 --> O["Order Service<br/>Port 8002"]
    G1 --> P["Product Service<br/>Port 8003"]
    G2 --> A & O & P
```

---

## Files Explained

### Phase 1 — Nginx Load Balancing (`phase1/`)

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Defines Nginx + 3 Express server replicas with environment variables |
| `nginx/nginx.conf` | Upstream block with 3 servers, round-robin, reverse proxy to backend |
| `server/Dockerfile` | Standard Node.js Dockerfile |
| `server/index.js` | Express server returning server name on each request |
| `server/package.json` | Express 5, Mongoose, BullMQ, ioredis |
| `server/.env` | MongoDB Atlas URI and Redis URL |

### Phase 2 — Microservices (`phase2/`)

| File | Purpose |
|------|---------|
| `docker-compose.yml` | 6 services: Nginx, 2 Gateways, Auth, Order, Product |
| `nginx/nginx.conf` | Upstream with 2 gateway servers, proxy to `gateway1:8000`, `gateway2:8000` |
| `backend/gateway/index.js` | Express server with `express-http-proxy` — routes `/auth`, `/order`, `/product` to respective services |
| `backend/gateway/Dockerfile` | Standard Node.js Dockerfile |
| `backend/gateway/package.json` | Express 5 + `express-http-proxy` |
| `backend/services/auth/index.js` | Auth microservice — `GET /` returns "Hello From Auth Service" |
| `backend/services/order/index.js` | Order microservice — `GET /` returns "Hello From Order Service" |
| `backend/services/product/index.js` | Product microservice — `GET /` returns "Hello From Product Service" |
| Each service has: `Dockerfile`, `package.json`, `.env` | Follows the same standardized template |

---

## API Endpoints

### Phase 1
| Method | Route | Response |
|--------|-------|----------|
| `GET` | `/` | Hello message + server name |
| `POST` | `/create` | Creates user + returns server name |
| `GET` | `/get` | Returns server name |

### Phase 2
| Method | Route | Proxied To |
|--------|-------|------------|
| `GET` | `/` | Gateway home |
| `GET` | `/auth` | Auth Service :8001 |
| `GET` | `/order` | Order Service :8002 |
| `GET` | `/product` | Product Service :8003 |

---

## How to Run

```bash
# Phase 1 — Load balancing
cd phase1
docker compose up
# Nginx on http://localhost:8000 — refresh to see round-robin

# Phase 2 — Microservices
cd phase2
docker compose up
# Nginx on http://localhost:8080
# Try /auth, /order, /product routes
```
