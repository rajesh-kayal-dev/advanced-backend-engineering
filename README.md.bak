# Advanced Backend Engineering

A **production-grade backend engineering curriculum** that progresses from containerized microservices to distributed systems architecture. This repository demonstrates real-world backend patterns including Docker orchestration, Redis-powered caching & job queues, Nginx load balancing, and an API Gateway microservices decomposition.

---

## Architecture Overview

```mermaid
graph TB
    subgraph Level3["Level 3 — Microservices & Load Balancing"]
        LB["Nginx Load Balancer"]
        GW1["API Gateway<br/>(express-http-proxy)"]
        GW2["API Gateway<br/>(express-http-proxy)"]
        AS["Auth Service<br/>Port 8001"]
        OS["Order Service<br/>Port 8002"]
        PS["Product Service<br/>Port 8003"]
        LB --> GW1 & GW2
        GW1 --> AS & OS & PS
        GW2 --> AS & OS & PS
    end

    subgraph Level2["Level 2 — Redis & Queues"]
        API2["Express API<br/>Port 8000"]
        MDB[(MongoDB<br/>Mongoose ODM)]
        RDS[("Redis<br/>Cache + Rate Limit")]
        BQ["BullMQ<br/>Queue"]
        WK["Worker<br/>Email Processor"]
        API2 --> MDB
        API2 --> RDS
        API2 --> BQ
        BQ --> WK
    end

    subgraph Level1["Level 1 — Foundations & Docker"]
        S1["Express Server<br/>Docker Container"]
        S2["Docker Compose<br/>Backend + Frontend + Redis"]
    end

    Client["Client"] --> Level3
    Level3 --> Level2
    Level2 --> Level1
```

---

## Levels

### Level 1 — Foundations & Containerization
- **Phase 1:** Dockerize a Node.js/Express server from scratch with Dockerfile best practices
- **Phase 2:** Multi-container orchestration with Docker Compose — backend API, React frontend (Vite), and Redis, all wired together

### Level 2 — Redis, Queues & Background Jobs
- **MongoDB with Mongoose ODM** — schema design, models, and CRUD
- **Redis Caching** — cache-aside pattern for database query optimization
- **BullMQ Job Queue** — async email processing with workers
- **Redis Rate Limiting** — IP-based throttling middleware
- **OTP System** — time-limited OTP generation and verification with Redis

### Level 3 — Distributed Systems & Microservices
- **Phase 1: Nginx Load Balancing** — horizontal scaling with 3 Express server replicas behind a round-robin Nginx reverse proxy
- **Phase 2: Microservices Architecture** — API Gateway pattern with `express-http-proxy` routing to dedicated Auth, Order, and Product services, fronted by Nginx

---

## Docker Architecture

Multi-container orchestration across all levels using Docker and Docker Compose.

```mermaid
graph LR
    subgraph L1P1["Level 1 Phase 1 — Single Container"]
        D1["Dockerfile"] --> C1["express-app<br/>Container"]
        C1 --> P1["Port 3000"]
    end

    subgraph L1P2["Level 1 Phase 2 — Docker Compose"]
        DC1["docker-compose.yml"] --> BE["backend<br/>Express API"]
        DC1 --> FE["frontend<br/>React + Vite"]
        DC1 --> R1["redis<br/>Cache"]
        BE --> P2["Port 7000"]
        FE --> P3["Port 5173"]
    end

    subgraph L2["Level 2 — Redis Services"]
        DC2["docker-compose.yml"] --> R2["redis<br/>Queue Backend"]
        DC2 --> APP["Express App<br/>(host)"]
        APP --> R2
    end

    subgraph L3P1["Level 3 Phase 1 — Load Balancing"]
        DC3["docker-compose.yml"] --> NGINX1["nginx<br/>Load Balancer"]
        DC3 --> SVR1["server1:7000"]
        DC3 --> SVR2["server2:7000"]
        DC3 --> SVR3["server3:7000"]
        NGINX1 -- round-robin --> SVR1 & SVR2 & SVR3
    end

    subgraph L3P2["Level 3 Phase 2 — Microservices"]
        DC4["docker-compose.yml"] --> NGINX2["nginx<br/>Load Balancer"]
        DC4 --> G1["gateway1:8000"]
        DC4 --> G2["gateway2:8000"]
        DC4 --> AUTH["auth:8001"]
        DC4 --> ORDER["order:8002"]
        DC4 --> PROD["product:8003"]
        NGINX2 --> G1 & G2
        G1 --> AUTH & ORDER & PROD
        G2 --> AUTH & ORDER & PROD
    end
```

---

## Redis Patterns

Redis is used across Level 2 for caching, rate limiting, OTP management, and background job queues.

```mermaid
graph TB
    subgraph Patterns["Redis Use Cases"]
        direction TB
        CACHE["Cache-Aside Pattern<br/><br/>GET /cache -> Redis lookup<br/>Miss -> Query MongoDB<br/>Set Redis with TTL"]
        RL["Rate Limiting<br/><br/>IP-based counter in Redis<br/>5 requests / 60s window<br/>429 when exceeded"]
        OTP["OTP System<br/><br/>Generate 6-digit code<br/>Store in Redis with 30s TTL<br/>Verify & delete on match"]
        BULL["BullMQ Queue<br/><br/>Enqueue email job<br/>Worker processes async<br/>Mock email sender"]
    end

    subgraph Data["Data Stores"]
        MDB[(MongoDB<br/>Persistent Storage)]
        RDS[("Redis<br/>In-Memory Store")]
    end

    CACHE --> MDB
    CACHE --> RDS
    RL --> RDS
    OTP --> RDS
    BULL --> RDS

    style RDS fill:#f9f,stroke:#333,stroke-width:2px
    style MDB fill:#dfd,stroke:#333,stroke-width:2px
```

---

## System Design — Microservices Flow

Request flow through the Level 3 Phase 2 microservices architecture.

```mermaid
sequenceDiagram
    participant C as Client
    participant N as Nginx (Port 80)
    participant G as API Gateway (Port 8000)
    participant A as Auth Service (Port 8001)
    participant O as Order Service (Port 8002)
    participant P as Product Service (Port 8003)

    Note over C,P: Load Balancing Phase
    C->>N: HTTP Request
    N->>N: Round-robin selection
    N->>G: Proxy to gateway

    Note over G,P: API Gateway Phase
    alt /auth/*
        G->>A: Proxy to Auth Service
        A-->>G: Response
    else /order/*
        G->>O: Proxy to Order Service
        O-->>G: Response
    else /product/*
        G->>P: Proxy to Product Service
        P-->>G: Response
    end
    G-->>N: Forward Response
    N-->>C: HTTP Response
```

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js (ES Modules) |
| **Framework** | Express.js 5 |
| **Database** | MongoDB + Mongoose ODM |
| **Caching & Queue** | Redis + BullMQ + ioredis |
| **Containerization** | Docker + Docker Compose |
| **Load Balancing** | Nginx |
| **API Gateway** | express-http-proxy |
| **Frontend** | React 19 + Vite |

---

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB (local or Atlas)

### Run Each Phase

```bash
# Level 1 — Dockerized Express server
cd level1/phase1/Dockerfilefolder
docker build -t express-app .
docker run -p 3000:3000 express-app

# Level 1 — Full stack with Docker Compose
cd level1/phase2
docker compose up

# Level 2 — Redis, queues, rate limiting
cd level2/phase1
npm install
docker compose up -d    # starts Redis
npm run dev

# Level 3 — Nginx load balancing
cd level3/phase1
docker compose up

# Level 3 — Microservices with API Gateway
cd level3/phase2
docker compose up
```

---

## Project Structure

```
.
├── level1/                   # Foundations
│   ├── phase1/               #   Docker basics
│   └── phase2/               #   Docker Compose (backend + frontend + Redis)
├── level2/                   # Redis, Queues, Middleware
│   └── phase1/               #   Caching, BullMQ, rate limiting, OTP
└── level3/                   # Distributed Systems
    ├── phase1/               #   Nginx load balancing
    └── phase2/               #   Microservices + API Gateway
        └── backend/
            ├── gateway/      #     API Gateway (express-http-proxy)
            └── services/
                ├── auth/     #     Auth microservice
                ├── order/    #     Order microservice
                └── product/  #     Product microservice
```

---

## Key Patterns Demonstrated

- **Containerization:** Multi-stage Dockerfiles, Docker Compose networking
- **Caching Strategy:** Cache-aside (lazy loading) with Redis TTL invalidation
- **Background Jobs:** BullMQ producers and workers for async email processing
- **Rate Limiting:** Sliding window rate limiter using Redis (5 req/min per IP)
- **OTP Workflow:** Time-based OTP generation with 30s expiry and verification
- **Load Balancing:** Nginx upstream with round-robin across stateless replicas
- **API Gateway:** Centralized routing, service abstraction, and proxy forwarding
- **Microservices:** Service decomposition with isolated Docker containers

---

## License

MIT
