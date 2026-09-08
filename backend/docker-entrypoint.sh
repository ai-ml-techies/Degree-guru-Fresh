#!/usr/bin/env bash
set -e

echo "==> Starting Degree Guru Backend..."

# Wait for MySQL to be available
echo "==> Checking database connection..."
MAX_TRIES=30
COUNT=0

until php -r "
    \$host = getenv('DB_HOST') ?: 'db';
    \$port = getenv('DB_PORT') ?: '3306';
    \$user = getenv('DB_USER') ?: 'root';
    \$pass = getenv('DB_PASSWORD') ?: '';
    \$name = getenv('DB_NAME') ?: 'degree_guru';
    try {
        new PDO(\"mysql:host=\$host;port=\$port;dbname=\$name\", \$user, \$pass, [PDO::ATTR_TIMEOUT => 3]);
        exit(0);
    } catch (Exception \$e) {
        exit(1);
    }
" 2>/dev/null; do
    COUNT=$((COUNT + 1))
    if [ "$COUNT" -ge "$MAX_TRIES" ]; then
        echo "==> [WARN] Could not connect to database after $MAX_TRIES attempts. Continuing startup..."
        break
    fi
    echo "==> Database ($DB_HOST) not ready yet. Retrying ($COUNT/$MAX_TRIES)..."
    sleep 2
done

if [ "$COUNT" -lt "$MAX_TRIES" ]; then
    echo "==> Database connection established!"
    echo "==> Running Yii2 migrations..."
    php yii migrate --interactive=0 || echo "==> [WARN] Migration exited with code $?"
fi

# Ensure runtime directories exist and have proper permissions
mkdir -p runtime web/assets
chown -R www-data:www-data runtime web/assets
chmod -R 775 runtime web/assets

echo "==> Backend ready. Executing command: $@"
exec "$@"
