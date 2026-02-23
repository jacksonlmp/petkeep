# PetKeep — Architecture

## Overview

PetKeep is a monorepo application composed of three main layers:

```
petkeep-app/
├── backend/   # REST API with Django + PostgreSQL
├── mobile/    # React Native app with Expo
├── infra/     # Infrastructure configuration (Docker, Nginx)
└── docs/      # Project documentation
```

## Components

### Backend (`/backend`)
- **Framework**: Django 4.x + Django REST Framework
- **Database**: PostgreSQL (production) / SQLite (local development)
- **Authentication**: JWT (via Simple JWT)
- **Containerisation**: Docker (`/backend/Dockerfile`)

### Mobile (`/mobile`)
- **Framework**: React Native with Expo (SDK 51+)
- **Language**: TypeScript
- **API communication**: Axios (`/mobile/services/api.ts`)

### Infra (`/infra`)
- **Orchestration**: Docker Compose
  - `docker-compose.yml` — development environment
  - `docker-compose.prod.yml` — production environment
- **Reverse proxy**: Nginx (`/infra/nginx/nginx.conf`)

## Communication Flow

```
[Mobile (Expo)] --> HTTPS --> [Nginx] --> [Django API] --> [PostgreSQL]
```

## Environments

| Environment  | Command                                                       |
|--------------|---------------------------------------------------------------|
| Backend dev  | `cd infra && docker compose up`                               |
| Production   | `cd infra && docker compose -f docker-compose.prod.yml up -d` |
| Mobile dev   | `cd mobile && npx expo start`                                 |
