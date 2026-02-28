# PetSitter welcome screen (`petsitter-welcome`)

## What was implemented

A welcome/marketing screen for users who want to become a PetSitter, based on the provided Figma layout.

### Layout

- **Background gradient**: light indigo → light purple → light pink (`#e0e7ff`, `#faf5ff`, `#fce7f3`), consistent with the app.
- **Back**: “Voltar” button at the top-left to return to the previous screen.
- **Title**: “Faça o que você Ama” (neutral) + “e Ganhe Dinheiro” (purple).
- **Subtitle**: “Transforme seu amor por animais em uma oportunidade de renda”.
- **Carousel**: the three feature cards are displayed **one at a time**, with **left/right arrows** and **pagination dots**.
- **CTA**: gradient button “Quero ser uma PetSitter” → navigates to the registration form (`/signup-petsitter`).
- **Login**: “Já tem uma conta? Entrar” → navigates to `/login`.
- **Footer**: “Cadastro 100% gratuito • Comece a trabalhar imediatamente”.

### Navigation flow

1. User goes to **Signup** (`/signup`) and taps “Cadastro de Petsitter”.
2. App opens **PetSitter welcome** (`/petsitter-welcome`).
3. “Quero ser uma PetSitter” → **PetSitter signup form** (`/signup-petsitter`).
4. “Já tem uma conta? Entrar” → **Login** (`/login`).

### Files changed / created

- **New**: `mobile/app/petsitter-welcome.tsx` — PetSitter welcome screen (responsive + carousel).
- **Changed**: `mobile/app/_layout.tsx` — registered `petsitter-welcome` route (no header).
- **Changed**: `mobile/app/signup.tsx` — PetSitter option now navigates to `/petsitter-welcome` instead of `/signup-petsitter`.

---

## Backend + form integration

### Backend

- **Endpoint**: `POST /api/v1/petsitters/signup/`
- **Payload** (already used by the app in `signup-petsitter.tsx`):
  - `full_name` (string, required)
  - `email` (string, required)
  - `phone` (string, required)
  - `password` (string, required)
  - `confirm_password` (string, required)
  - `location` (string, required)
  - `about` (string, required)
  - `animal_types` (string[], required; e.g. `["dog","cat"]`)
  - `service_types` (string[], required; e.g. `["keepsitter","keepwalk"]`)
  - `other_animals` (string, optional; required when `animal_types` includes `"other"`)

No backend changes were needed for this feature. The welcome screen only routes the user to the existing signup form, which is already integrated with the endpoint above.

### Mobile form

- **File**: `mobile/app/signup-petsitter.tsx`
- **API call**: `api.petsitters.signup(payload)` in `mobile/services/api.ts` → `POST /petsitters/signup/`.
- **Success behavior**: redirects to `/login` with `success=petsitter`.
