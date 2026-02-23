# API — PetKeep

## Base URL

| Ambiente    | URL                          |
|-------------|------------------------------|
| Produção    | `https://api.petkeep.com/`   |
| Desenvolvimento | `http://localhost:8080/` |

## Autenticação

Todas as rotas protegidas exigem o header:
```
Authorization: Bearer <access_token>
```

Os tokens são obtidos via `/api/users/token/`.

---

## Endpoints

### Auth / Usuários

| Método | Rota                        | Descrição                          | Auth |
|--------|-----------------------------|------------------------------------|------|
| POST   | `/api/users/signup/customer/` | Cadastro de cliente              | Não  |
| POST   | `/api/users/signup/petsitter/` | Cadastro de petsitter           | Não  |
| POST   | `/api/users/token/`          | Obter access + refresh token      | Não  |
| POST   | `/api/users/token/refresh/`  | Renovar access token              | Não  |

> Endpoints adicionais serão documentados conforme o desenvolvimento evolui.
