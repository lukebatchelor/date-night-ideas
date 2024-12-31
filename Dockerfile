# Dockerfile.prod
# Build frontend
FROM oven/bun as frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/bun.lockb ./
RUN bun install
COPY frontend/ .
RUN bun run build

# Production image
FROM oven/bun
WORKDIR /app

# Copy backend files and install production dependencies
COPY backend/package.json backend/bun.lockb ./
RUN bun install --production

# Copy backend source
COPY backend/ .

# Create the frontend/dist directory and copy the built files
RUN mkdir -p ../frontend/dist
COPY --from=frontend-builder /app/dist ../frontend/dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "src/index.ts"]