#!/usr/bin/env ash
set -e

# Exporta variáveis a partir dos arquivos *_FILE
for var in $(env | grep '_FILE=' | sed 's/=.*//'); do
    var_name=$(echo "$var" | sed 's/_FILE$//')
    file_path=$(eval echo "\$$var")

    if [ -f "$file_path" ]; then
        export "$var_name"="$(cat "$file_path")"
        unset "$var"
    else
        echo "Aviso: Arquivo '$file_path' para variável '$var' não encontrado." >&2
    fi
done

# Substituindo variáveis no template do Nginx...
envsubst '$WEBHOOK_HOST $WEBHOOK_PORT' < ./nginx.conf.template > /etc/nginx/conf.d/default.conf

# Executa o comando para iniciar o Nginx
nginx -g "daemon off;"

# Executa o comando original passado para o container
exec "$@"