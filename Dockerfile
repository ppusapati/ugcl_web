FROM node:18-alpine

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files and install
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm ssr

# Set PORT for Cloud Run
ENV PORT=8080
EXPOSE 8080

# Start the SSR server
CMD ["node", "dist/entry.ssr.js"]
