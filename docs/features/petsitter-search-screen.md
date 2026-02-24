# Feature: PetSitter Search Screen

## What was built

### Backend (`backend/apps/users/views.py`)

`PetSitterListView` now supports three optional query parameters:

| Param | Type | Description |
|---|---|---|
| `search` | string | Case-insensitive search on `full_name` **or** `location` |
| `animal_type` | string | Comma-separated animal keys: `dog`, `cat`, `bird`, `rabbit`, `chicken`, `hamster`, `other` |
| `service_type` | string | Comma-separated service keys: `keepsitter`, `keephost`, `keepwalk` |

Example: `GET /api/v1/petsitters/?search=Maria&animal_type=dog,cat&service_type=keepwalk`

The filter uses `Q` objects with `icontains` for text search and `__in` lookups for multi-value filters. `.distinct()` prevents duplicate rows from M2M joins.

---

### Mobile

#### `services/api.ts`
- Added `AsyncStorage`-backed token management (`getToken`, `setToken`, `removeToken`) using the key `@petkeep_token`.
- Added `LoginPayload`, `LoginResponse`, and `PetSitter` TypeScript interfaces.
- `api.auth.login()` — calls `/auth/login/`, stores the returned token automatically.
- `api.auth.logout()` — calls `/auth/logout/`, removes the stored token.
- `api.petsitters.list(params)` — authenticated GET to `/petsitters/` with optional search/filter query params.
- Internal `request()` now accepts a `requiresAuth` flag that injects `Authorization: Token <token>`.

#### `app/login.tsx`
- `onSubmit` now calls `api.auth.login()` and navigates to `/(tabs)` on success.
- Shows `ActivityIndicator` while loading; shows `Alert` on error.
- Login button is `disabled` while the request is in-flight.

#### `constants/theme.ts`
Added the `Brand` palette (exported alongside `Colors`):
- `primary`, `primaryDark`, `primaryLight` — violet shades
- `gradientStart` / `gradientEnd` — used in the header and card avatars
- `success` — green, used for the "Verificado" badge
- `surface`, `text`, `textSecondary`, `textMuted`, `border`, `white`, `cardBg`

#### `components/filter-modal.tsx` *(new)*
Bottom-sheet modal triggered by the filter button. Features:
- **Tipo de Animal** — grid of 6 toggleable animal-type cards with emoji icons.
- **Modalidades de Serviço** — list of 3 toggleable service-type cards with descriptions.
- **Limpar** — resets selections without closing.
- **Aplicar Filtros** — applies selection and triggers a new API call.
- Selected items are highlighted in violet (`Brand.primary`).
- The filter button in the header shows an active state + a badge with the count of active filters.

#### `app/(tabs)/index.tsx` *(rebuilt)*
Full customer home/search screen:
- **Purple gradient header** (`Brand.gradientStart → Brand.gradientEnd`) with title and subtitle.
- **Search bar** with 400 ms debounce — sends `?search=` to the API.
- **Filter button** (right of search bar) — opens `FilterModal`, turns solid purple when filters are active.
- **FlatList** of `PetSitterCard` components with pull-to-refresh.
- **PetSitterCard**: colored gradient avatar with initials (placeholder for future photo), "Verificado" badge, name, location, animal emoji row, service chip row.
- **Empty state**, **error state** with retry, and **loading spinner**.

#### Makefile
- `test-backend` updated to use `python manage.py test apps --settings=config.test_settings` — no extra dependencies needed in the container.

---

## What's NOT there yet (future work)
- PetSitter profile photos (model field + upload endpoint)
- Rating / price fields on the `PetSitter` model
- A proper `/petsitter/:id` detail screen (tapping a card currently navigates but the route doesn't exist)
- Authentication guard — the home screen currently shows an API error if the user isn't logged in
