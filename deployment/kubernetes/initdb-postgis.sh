#!/bin/bash

set -e
# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"

# Load PostGIS into both template_database and $POSTGRES_DB
echo "Loading PostGIS extensions into $POSTGRES_DB"
psql -d $POSTGRES_DB -c "CREATE EXTENSION IF NOT EXISTS postgis"