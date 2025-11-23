#!/bin/bash

# Simple build script for FireLink System
set -e

echo "Building FireLink System Backend..."

cd backend

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build TypeScript
echo "Building TypeScript..."
npm run build

echo "Build completed successfully!"
