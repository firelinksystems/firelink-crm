FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies (use npm install instead of npm ci)
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy source code
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY migrations/ ./migrations/

# Build applications
RUN cd backend && npm run build
RUN cd frontend && npm run build

# Expose port
EXPOSE 3001

# Start the backend
CMD ["node", "backend/dist/main"]
