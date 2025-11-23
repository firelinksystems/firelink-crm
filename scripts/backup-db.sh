#!/bin/bash

# Database Backup Script
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="$BACKUP_DIR/firelink_backup_$TIMESTAMP.sql"

echo "Starting database backup..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Run backup using docker
docker-compose exec -T postgres pg_dump -U firelink_user firelink > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

echo "Backup completed: ${BACKUP_FILE}.gz"

# Remove backups older than 30 days
find $BACKUP_DIR -name "firelink_backup_*.sql.gz" -mtime +30 -delete

echo "Old backups cleaned up."
