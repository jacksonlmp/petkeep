# PetKeep App

Monorepo do projeto PetKeep — plataforma de conexão entre tutores de animais e petsitters.

## Estrutura

```
petkeep-app/
├── backend/   # API REST (Django + PostgreSQL)
├── mobile/    # Aplicativo mobile (React Native / Expo)
├── infra/     # Infraestrutura (Docker Compose, Nginx)
└── docs/      # Documentação
    ├── arquitetura.md
    ├── database.md
    └── api.md
```

## Pré-requisitos

- Docker & Docker Compose
- Node.js >= 18 + npm
- Python >= 3.10 (para desenvolvimento local sem Docker)

## Como rodar

### Backend (via Docker)

```bash
cd infra
docker compose up --build
```

API disponível em `http://localhost:8080`.

### Mobile

```bash
cd mobile
npm install
npx expo start
```

## Documentação

Consulte a pasta [`/docs`](./docs) para detalhes sobre:
- [Arquitetura](./docs/arquitetura.md)
- [Banco de dados](./docs/database.md)
- [API](./docs/api.md)
