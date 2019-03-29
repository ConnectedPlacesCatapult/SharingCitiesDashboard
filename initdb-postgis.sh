#!/bin/sh

set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"

# Load PostGIS into both template_database and $POSTGRES_DB
echo "Loading PostGIS extensions into test_analytics"
"${psql[@]}" --dbname=test_analytics <<-'EOSQL'
    CREATE EXTENSION IF NOT EXISTS postgis;
EOSQL
