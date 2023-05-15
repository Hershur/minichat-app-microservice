# Use Node.js 14 as the base image
FROM node:14-alpine

# Create the working directory and set it as the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package.json ./

COPY ./prisma prisma

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port that the microservice will listen on
EXPOSE 3002

# Start the application
CMD ["node", "dist/src/main"]
