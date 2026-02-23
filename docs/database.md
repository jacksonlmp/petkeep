# Database — PetKeep

## Banco de Dados

- **Desenvolvimento**: SQLite (`/backend/db.sqlite3`) — não versionado
- **Produção**: PostgreSQL 15

## Modelos Principais

> Documentação em construção. Use `cd backend && python manage.py inspectdb` para inspecionar o schema atual.

### User (CustomUser)
| Campo       | Tipo        | Descrição                        |
|-------------|-------------|----------------------------------|
| id          | UUID / int  | Chave primária                   |
| email       | EmailField  | Identificador único de login     |
| name        | CharField   | Nome do usuário                  |
| role        | CharField   | `customer` ou `petsitter`        |
| created_at  | DateTime    | Data de criação                  |

### AnimalType
| Campo | Tipo      | Descrição           |
|-------|-----------|---------------------|
| id    | int       | Chave primária      |
| name  | CharField | Ex.: Cão, Gato      |

### ServiceType
| Campo | Tipo      | Descrição              |
|-------|-----------|------------------------|
| id    | int       | Chave primária         |
| name  | CharField | Ex.: Passeio, Hospedagem |

### PetSitter
| Campo         | Tipo          | Descrição                          |
|---------------|---------------|------------------------------------|
| user          | FK → User     | Relacionamento 1:1                 |
| about         | TextField     | Descrição do petsitter             |
| animal_types  | M2M → AnimalType | Tipos de animais atendidos      |
| service_types | M2M → ServiceType | Serviços oferecidos            |

## Migrations

As migrations Django ficam em `/backend/apps/<app>/migrations/`.

Para aplicar:
```bash
cd infra && docker compose run --rm backend python manage.py migrate
```
