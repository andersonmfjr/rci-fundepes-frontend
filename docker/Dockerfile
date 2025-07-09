# Etapa 1: Build da aplicação
FROM node:lts AS builder

WORKDIR /app

COPY app/package*.json ./
RUN npm i

COPY app/ .
RUN npm run build

# Etapa 2: Servir com nginx
FROM nginxinc/nginx-unprivileged:stable-alpine

# Instala dependencias
USER root

RUN apk add --no-cache gettext

USER 101

# Copia arquivos estáticos do build para o nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração customizada do nginx (opcional)
COPY docker/nginx/nginx-template.conf ./nginx.conf.template

EXPOSE 8080

# Copia script de entrypoint
COPY --chown=101 entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]
