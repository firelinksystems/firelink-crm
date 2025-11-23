#!/bin/bash

# Production Deployment Script
set -e

echo "Starting production deployment..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Build and push Docker images
echo "Building Docker images..."
docker-compose -f docker-compose.prod.yml build

echo "Pushing images to registry..."
docker-compose -f docker-compose.prod.yml push

# Deploy to production server
echo "Deploying to production..."
ssh $PRODUCTION_SERVER "cd /opt/firelink-system && docker-compose pull && docker-compose up -d"

# Run database migrations
echo "Running database migrations..."
ssh $PRODUCTION_SERVER "cd /opt/firelink-system && docker-compose exec backend npm run db:migrate"

# Health check
echo "Performing health check..."
sleep 30
curl -f https://firelinksystem.com/health || exit 1

echo "Deployment completed successfully!"
