FROM node:18-alpine

WORKDIR /app

# Copy backend
COPY backend/ ./backend/
COPY migrations/ ./migrations/

# Install and build backend
WORKDIR /app/backend
RUN npm install
RUN npm run build

# Install frontend
WORKDIR /app
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Go back to root
WORKDIR /app

# Expose port
EXPOSE 3001

# Start the backend
CMD ["node", "backend/dist/main"]
