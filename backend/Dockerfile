# Use Python 3.10 como base
FROM python:3.10-slim

# Definir variáveis de ambiente
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Criar diretório de trabalho
WORKDIR /app

# Permite instalar dependências de dev (lint/test) no build de dev
ARG INSTALL_DEV=false

# Instalar dependências do sistema necessárias para PostgreSQL
RUN apt-get update && apt-get install -y \
    postgresql-client \
    git \
    gcc \
    python3-dev \
    musl-dev \
    libpq-dev \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primeiro (para cache de layer)
COPY requirements.txt .
COPY requirements-dev.txt .

# Instalar dependências Python
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    if [ "$INSTALL_DEV" = "true" ]; then pip install -r requirements-dev.txt; fi

# Copiar o projeto
COPY . .

# Criar diretórios para static e media
RUN mkdir -p /app/staticfiles /app/media

# Expor a porta 8000
EXPOSE 8000

# Script de entrada
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
