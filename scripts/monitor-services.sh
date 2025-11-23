#!/bin/bash

# Service Monitoring Script
set -e

SERVICES=("postgres" "redis" "backend" "frontend")
ALERT_EMAIL="alerts@firelinksystem.com"

check_service() {
    local service=$1
    if docker-compose ps $service | grep -q "Up"; then
        echo "✓ $service is running"
        return 0
    else
        echo "✗ $service is down"
        return 1
    fi
}

send_alert() {
    local service=$1
    local subject="Alert: $service is down"
    local body="The $service service in FireLink System is not running. Please check immediately."
    
    # In production, you would send an email or notification
    echo "ALERT: $body"
    # mail -s "$subject" $ALERT_EMAIL <<< "$body"
}

echo "Checking FireLink System services..."

for service in "${SERVICES[@]}"; do
    if ! check_service $service; then
        send_alert $service
    fi
done

# Check database connectivity
if docker-compose exec -T postgres pg_isready -U firelink_user; then
    echo "✓ Database is accessible"
else
    echo "✗ Database is not accessible"
    send_alert "Database"
fi

# Check backend health
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✓ Backend API is healthy"
else
    echo "✗ Backend API is not responding"
    send_alert "Backend API"
fi

echo "Service check completed."
