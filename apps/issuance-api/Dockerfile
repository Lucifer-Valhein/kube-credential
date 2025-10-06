# -------------------------------
# Stage 1: Build Stage
# -------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript into dist/
RUN npm run build


# -------------------------------
# Stage 2: Runtime Stage
# -------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy package.json for runtime info
COPY package*.json ./

# Install only production deps
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose container port
EXPOSE 8080

CMD ["node", "dist/index.js"]