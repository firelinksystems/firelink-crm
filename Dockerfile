FROM node:18

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install dependencies
RUN npm install --omit=dev

# Generate Prisma client
RUN npx prisma generate

# Copy backend source
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build backend
RUN npm run build

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node health-check.js

# Start the application
CMD ["npm", "start"]
