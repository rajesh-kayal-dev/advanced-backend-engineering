# Fastify Task API

![Node](https://img.shields.io/badge/Node-20%2B-339933?logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-5-000000?logo=fastify)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens)

A RESTful Task Management API with **Fastify**, **Prisma ORM**, **PostgreSQL**, and **JWT Authentication** — demonstrating a clean modular backend architecture.

---

## Tech Stack

| Layer           | Technology                                                        |
| --------------- | ----------------------------------------------------------------- |
| **Runtime**     | Node.js 20+                                                       |
| **Framework**   | Fastify 5                                                         |
| **Language**    | JavaScript (ESM)                                                  |
| **ORM**         | Prisma 6                                                          |
| **Database**    | PostgreSQL 16                                                      |
| **Auth**        | JWT (Access + Refresh Tokens) via `@fastify/jwt`                  |
| **Hashing**     | Bcrypt                                                            |
| **Validation**  | Fastify JSON Schema (`type: "object"` + `properties`)             |
| **API Docs**    | Swagger UI via `@fastify/swagger` + `@fastify/swagger-ui`         |
| **Security**    | Helmet, CORS, Rate Limiting                                       |
| **Tooling**     | `tsx` (watch mode), Nodemon                                       |

---

## Architecture

### System Flow

```mermaid
flowchart TB
  Client["🌐 Client<br/>(Postman / Frontend)"]

  subgraph Fastify_Server["⚡ Fastify Server"]
    direction TB
    PL["Plugins<br/>@fastify/env, @fastify/jwt,<br/>@fastify/cors, @fastify/helmet,<br/>@fastify/rate-limit, @fastify/swagger"]
    AUTH["🔐 Auth Plugin<br/>app.authenticate<br/>(JWT preHandler)"]
    RT["📡 Routes"]
    VAL["✅ Request Validation<br/>(JSON Schema)"]
    CTRL["🎮 Controllers"]
    SVC["🧠 Services<br/>(Business Logic)"]
    PRISMA["📦 Prisma Client"]
  end

  DB[("🗄️ PostgreSQL<br/>Users & Tasks Tables")]
  SW[("📖 Swagger UI<br/>/docs")]

  Client -->|"HTTP Request"| PL
  PL --> AUTH
  AUTH --> RT
  RT --> VAL
  VAL --> CTRL
  CTRL --> SVC
  SVC --> PRISMA
  PRISMA --> DB
  RT -.->|"schema reflection"| SW
```

### Entity Relationship

```mermaid
erDiagram
  User {
    int id PK
    string name
    string email UK
    string password
    datetime createdAt
    datetime updatedAt
  }
  Task {
    int id PK
    string title
    string description
    boolean completed
    int userId FK
    datetime createdAt
    datetime updatedAt
  }
  User ||--o{ Task : "has many"
```

### Request Lifecycle (Register → Login → Create Task)

```mermaid
sequenceDiagram
  actor C as Client
  participant R as Fastify Router
  participant A as Auth Plugin
  participant V as JSON Schema
  participant Ctrl as Controller
  participant Svc as Service
  participant P as Prisma
  participant DB as PostgreSQL

  Note over C,DB: 📝 Register
  C->>R: POST /auth/register { name, email, password }
  R->>V: validate body
  V->>Ctrl: register()
  Ctrl->>Svc: hash password (bcrypt)
  Svc->>P: prisma.user.create()
  P->>DB: INSERT INTO users
  DB-->>P: user row
  P-->>Svc: user obj
  Svc-->>Ctrl: { user, accessToken, refreshToken }
  Ctrl-->>C: 201 { user, tokens }

  Note over C,DB: 🔑 Login
  C->>R: POST /auth/login { email, password }
  R->>V: validate body
  V->>Ctrl: login()
  Ctrl->>Svc: verify password (bcrypt)
  Svc->>P: prisma.user.findUnique()
  P->>DB: SELECT FROM users
  DB-->>P: user row
  P-->>Svc: user
  Svc-->>Ctrl: { accessToken, refreshToken }
  Ctrl-->>C: 200 { tokens }

  Note over C,DB: ✅ Create Task (Protected)
  C->>R: POST /tasks { title, description }
  R->>A: preHandler: app.authenticate
  A->>A: verify JWT
  A-->>R: ✅ decoded payload
  R->>V: validate body
  V->>Ctrl: create()
  Ctrl->>Svc: extract userId from token
  Svc->>P: prisma.task.create()
  P->>DB: INSERT INTO tasks
  DB-->>P: task row
  P-->>Svc: task
  Svc-->>Ctrl: task
  Ctrl-->>C: 201 { task }
```

---

## Features

### Authentication

| Feature              | Endpoints                           |
| -------------------- | ----------------------------------- |
| User Registration    | `POST /auth/register`               |
| User Login           | `POST /auth/login`                  |
| Token Refresh        | `POST /auth/refresh`                |
| Logout               | `POST /auth/logout`                 |

### Task Management (All Protected)

| Feature      | Method | Endpoint            |
| ------------ | ------ | ------------------- |
| Create Task  | POST   | `/tasks`            |
| List Tasks   | GET    | `/tasks`            |
| Get Task     | GET    | `/tasks/:id`        |
| Update Task  | PATCH  | `/tasks/:id`        |
| Delete Task  | DELETE | `/tasks/:id`        |
| Search Tasks | GET    | `/tasks/search`     |
| Pagination   | GET    | `/tasks/pagination` |

### Users

| Feature         | Method | Endpoint          |
| --------------- | ------ | ----------------- |
| View Profile    | GET    | `/users/profile`  |

### Utilities

| Feature   | Method | Endpoint |
| --------- | ------ | -------- |
| Health    | GET    | `/`      |

### Security

- Password Hashing with Bcrypt
- JWT Access + Refresh Token Rotation
- CORS (via `@fastify/cors`)
- Helmet security headers (via `@fastify/helmet`)
- Rate Limiting (via `@fastify/rate-limit`)
- Request Validation via Fastify JSON Schema

---

## Project Structure

```
src/
├── config/         # Environment variables (via @fastify/env)
├── controllers/    # Request handlers (auth, task, user)
├── generated/      # Prisma-generated client (if applicable)
├── plugins/        # Fastify plugins (auth decorator, swagger)
├── routes/         # Route definitions (auth, task, user, root)
├── schemas/        # JSON Schema validation schemas
├── services/       # Business logic layer
├── utils/          # Utility helpers
├── app.js          # Fastify app setup & plugin registration
└── server.js       # Entry point (starts the server)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm

### Installation

```bash
git clone <repository-url>
cd task-api
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
JWT_SECRET="your-secret-key"
```

### Database Setup

```bash
# Apply migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### Run

```bash
npm run dev
```

Server starts at `http://localhost:3000`.

### API Documentation

Swagger UI is available at:

```
http://localhost:3000/docs
```

---

## Data Models

### User

| Field     | Type     | Notes                |
| --------- | -------- | -------------------- |
| id        | Int      | Primary Key (auto)   |
| name      | String   |                      |
| email     | String   | Unique                |
| password  | String   | Bcrypt hashed         |
| createdAt | DateTime | Auto                  |
| updatedAt | DateTime | Auto                  |

### Task

| Field       | Type     | Notes                     |
| ----------- | -------- | ------------------------- |
| id          | Int      | Primary Key (auto)        |
| title       | String   |                           |
| description | String?  | Optional                   |
| completed   | Boolean  | Default: false            |
| userId      | Int      | Foreign Key → User        |
| createdAt   | DateTime | Auto                      |
| updatedAt   | DateTime | Auto                      |

---

## Learning Goals

- Fastify Plugin Architecture
- REST API Design
- Prisma ORM (Migrations, Client, Relations)
- PostgreSQL
- JWT Authentication (Access + Refresh Tokens)
- Request Validation with JSON Schema
- Error Handling patterns
- Modular Backend Structure
- API Documentation with Swagger

---

## License

This project is for learning and portfolio purposes.
