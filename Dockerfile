# Set base image
FROM node:18-alpine

# Create working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Set NODE_ENV variable for production (optional)
ENV NODE_ENV production

# Copy remaining application files
COPY . .

# Expose Discord bot port (5000)
EXPOSE 3000

# Start the bot using PM2
CMD ["npm", "run", "start"]