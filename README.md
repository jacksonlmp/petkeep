# PetKeep App

Monorepo for the PetKeep project — a platform connecting pet owners with petsitters.

## Structure

```
petkeep-app/
├── backend/   # REST API (Django + PostgreSQL)
├── mobile/    # Mobile app (React Native / Expo)
├── infra/     # Infrastructure (Docker Compose, Nginx)
└── docs/      # Documentation
    ├── architecture.md
    ├── database.md
    └── api.md
```

## Prerequisites

- Docker & Docker Compose
- Node.js >= 18 + npm
- Python >= 3.10 (for local development without Docker)

## Getting Started

### Backend (via Docker)

```bash
cd infra
docker compose up --build
```

API available at `http://localhost:8080`.

### Mobile

```bash
cd mobile
npm install
npx expo start
```

## Documentation

See the [`/docs`](./docs) folder for details on:
- [Architecture](./docs/architecture.md)
- [Database](./docs/database.md)
- [API](./docs/api.md)
