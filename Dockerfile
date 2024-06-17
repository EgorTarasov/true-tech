# Build stage
FROM node:18-alpine as builder

WORKDIR /app

COPY . /app

RUN npm install -g pnpm --global-dir=/usr/local/lib/pnpm

RUN pnpm install

RUN pnpm run build


CMD ["npm", "run", "serve"]

# Final stage
FROM node:18-alpine

WORKDIR /app

# Copy built artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Install serve to serve the application, if necessary
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist"]