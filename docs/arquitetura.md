# Arquitetura do PetKeep

## Visão Geral

O PetKeep é uma aplicação monorepo composta por três camadas principais:

```
petkeep-app/
├── backend/   # API REST com Django + PostgreSQL
├── mobile/    # Aplicativo React Native com Expo
├── infra/     # Configurações de infraestrutura (Docker, Nginx)
└── docs/      # Documentação do projeto
```

## Componentes

### Backend (`/backend`)
- **Framework**: Django 4.x + Django REST Framework
- **Banco de dados**: PostgreSQL (produção) / SQLite (desenvolvimento local)
- **Autenticação**: JWT (via Simple JWT)
- **Containerização**: Docker (Dockerfile em `/backend/Dockerfile`)

### Mobile (`/mobile`)
- **Framework**: React Native com Expo (SDK 51+)
- **Linguagem**: TypeScript
- **Comunicação com API**: Axios (`/mobile/services/api.ts`)

### Infra (`/infra`)
- **Orquestração**: Docker Compose
  - `docker-compose.yml` — ambiente de desenvolvimento
  - `docker-compose.prod.yml` — ambiente de produção
- **Proxy reverso**: Nginx (`/infra/nginx/nginx.conf`)

## Fluxo de Comunicação

```
[Mobile (Expo)] --> HTTPS --> [Nginx] --> [Django API] --> [PostgreSQL]
```

## Ambientes

| Ambiente    | Comando                                      |
|-------------|----------------------------------------------|
| Dev backend | `cd infra && docker compose up`              |
| Prod        | `cd infra && docker compose -f docker-compose.prod.yml up -d` |
| Mobile dev  | `cd mobile && npx expo start`                |
