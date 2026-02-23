# Database — PetKeep

## Databases

- **Development**: SQLite (`/backend/db.sqlite3`) — not versioned
- **Production**: PostgreSQL 15

## Main Models

> Documentation in progress. Run `cd backend && python manage.py inspectdb` to inspect the current schema.

### User (CustomUser)
| Field       | Type        | Description                    |
|-------------|-------------|--------------------------------|
| id          | UUID / int  | Primary key                    |
| email       | EmailField  | Unique login identifier        |
| name        | CharField   | User full name                 |
| role        | CharField   | `customer` or `petsitter`      |
| created_at  | DateTime    | Creation timestamp             |

### AnimalType
| Field | Type      | Description           |
|-------|-----------|-----------------------|
| id    | int       | Primary key           |
| name  | CharField | e.g. Dog, Cat         |

### ServiceType
| Field | Type      | Description              |
|-------|-----------|--------------------------|
| id    | int       | Primary key              |
| name  | CharField | e.g. Walk, Boarding      |

### PetSitter
| Field         | Type              | Description                         |
|---------------|-------------------|-------------------------------------|
| user          | FK → User         | 1:1 relationship                    |
| about         | TextField         | Petsitter bio                       |
| animal_types  | M2M → AnimalType  | Animal types the petsitter handles  |
| service_types | M2M → ServiceType | Services offered                    |

## Migrations

Django migrations are located at `/backend/apps/<app>/migrations/`.

To apply:
```bash
cd infra && docker compose run --rm backend python manage.py migrate
```
