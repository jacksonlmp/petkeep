# API — PetKeep

## Base URL

| Environment    | URL                          |
|----------------|------------------------------|
| Production     | `https://api.petkeep.com/`   |
| Development    | `http://localhost:8080/`     |

## Authentication

All protected routes require the header:
```
Authorization: Bearer <access_token>
```

Tokens are obtained via `/api/users/token/`.

---

## Endpoints

### Auth / Users

| Method | Route                          | Description                     | Auth |
|--------|--------------------------------|---------------------------------|------|
| POST   | `/api/users/signup/customer/`  | Register a customer             | No   |
| POST   | `/api/users/signup/petsitter/` | Register a petsitter            | No   |
| POST   | `/api/users/token/`            | Obtain access + refresh token   | No   |
| POST   | `/api/users/token/refresh/`    | Refresh access token            | No   |

> Additional endpoints will be documented as development progresses.
