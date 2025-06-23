# Etapa 1: Build da aplicação
FROM node:lts AS builder

WORKDIR /app

COPY app/package*.json ./
RUN npm i

COPY app/ .
RUN npm run build

# Etapa 2: Servir com nginx
FROM nginxinc/nginx-unprivileged:stable-alpine

# Copia arquivos estáticos do build para o nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração customizada do nginx (opcional)
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

#CMD ["nginx", "-g", "daemon off;"]
