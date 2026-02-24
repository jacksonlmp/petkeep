.PHONY: help \
        up up-prod down restart build rebuild logs logs-db ps clean \
        migrate makemigrations shell superuser collectstatic test-backend lint-backend exec exec-db \
        mobile-install mobile-start mobile-android mobile-ios mobile-web

# ── Variables ─────────────────────────────────────────────────────────────────
COMPOSE         = docker compose -f infra/docker-compose.yml
COMPOSE_PROD    = docker compose -f infra/docker-compose.prod.yml
BACKEND         = petkeep_backend
DB              = petkeep_db

# ── Help ──────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "PetKeep — Monorepo commands"
	@echo ""
	@echo "  Infrastructure"
	@echo "    make up              Start all containers (dev)"
	@echo "    make up-prod         Start all containers (production)"
	@echo "    make down            Stop and remove containers"
	@echo "    make restart         Restart all containers"
	@echo "    make build           Build Docker images"
	@echo "    make rebuild         Full rebuild (down → build → up)"
	@echo "    make logs            Stream backend logs"
	@echo "    make logs-db         Stream database logs"
	@echo "    make ps              List running containers"
	@echo "    make clean           Remove containers, volumes and images"
	@echo ""
	@echo "  Backend (Django)"
	@echo "    make migrate         Run database migrations"
	@echo "    make makemigrations  Create new migrations"
	@echo "    make shell           Open Django shell"
	@echo "    make superuser       Create a Django superuser"
	@echo "    make collectstatic   Collect static files"
	@echo "    make test-backend    Run backend test suite (Django test runner)"
	@echo "    make lint-backend    Run flake8 on backend code"
	@echo "    make exec            Open bash inside the backend container"
	@echo "    make exec-db         Open psql inside the database container"
	@echo ""
	@echo "  Mobile (Expo)"
	@echo "    make mobile-install  Install npm dependencies"
	@echo "    make mobile-start    Start Expo dev server"
	@echo "    make mobile-android  Start on Android emulator"
	@echo "    make mobile-ios      Start on iOS simulator"
	@echo "    make mobile-web      Start on web browser"
	@echo ""

# ── Infrastructure ────────────────────────────────────────────────────────────
up:
	$(COMPOSE) up

up-prod:
	$(COMPOSE_PROD) up -d

down:
	$(COMPOSE) down

restart: down up

build:
	$(COMPOSE) build

rebuild: down build up

logs:
	$(COMPOSE) logs -f backend

logs-db:
	$(COMPOSE) logs -f db

ps:
	$(COMPOSE) ps

clean:
	$(COMPOSE) down -v --rmi all

# ── Backend ───────────────────────────────────────────────────────────────────
migrate:
	$(COMPOSE) exec backend python manage.py migrate

makemigrations:
	$(COMPOSE) exec backend python manage.py makemigrations

shell:
	$(COMPOSE) exec backend python manage.py shell

superuser:
	$(COMPOSE) exec backend python manage.py createsuperuser

collectstatic:
	$(COMPOSE) exec backend python manage.py collectstatic --noinput

test-backend:
	$(COMPOSE) exec backend python manage.py test apps --settings=config.test_settings --verbosity=2

lint-backend:
	$(COMPOSE) exec backend flake8 .

exec:
	$(COMPOSE) exec backend bash

exec-db:
	$(COMPOSE) exec db psql -U petkeep_user -d petkeep_db

# ── Mobile ────────────────────────────────────────────────────────────────────
mobile-install:
	cd mobile && npm install

mobile-start:
	cd mobile && npx expo start

mobile-android:
	cd mobile && npx expo start --android

mobile-ios:
	cd mobile && npx expo start --ios

mobile-web:
	cd mobile && npx expo start --web
