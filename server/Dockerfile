FROM node:18

# Create app directory
WORKDIR /cubingza-api

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy app source and build
COPY . .

# Expose port
EXPOSE 9000

# Serve website
CMD ["npm", "start"]
