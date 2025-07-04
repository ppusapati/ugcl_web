# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Build your app
RUN npm run build

# Expose port (Cloud Run default is 8080)
ENV PORT 8080

# Start the server
CMD ["npm", "start"]
