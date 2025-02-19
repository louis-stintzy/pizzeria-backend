# ----- 1. Base stage -----

# Use the official Node.js 22 image
FROM node:22-alpine AS base
# Set the working directory
WORKDIR /app
# Copy the package.json and package-lock.json
COPY package*.json ./
# Install the dependencies
RUN npm install
# Copy the source code
COPY . .


# ----- 2. Development stage -----

# if necessary, you can add a development stage
# FROM base as development
# RUN npm install -g nodemon
# EXPOSE ${PORT:-3200} # mettre variable d'environnement
# CMD ["npm", "run", "dev"]


# ----- 3. Build stage -----

FROM base AS build
RUN npm run build


# ----- 4. Production stage -----

# Use the official Node.js 22 image
FROM node:22-alpine AS production
LABEL app="pizzeria-backend"
# Create a new user non-root
RUN addgroup -S pizzeriagroup && adduser -S pizzeriauser -G pizzeriagroup
# Set the working directory and copy the files
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
# Change the owner of the files and switch to the new user
RUN chown -R pizzeriauser:pizzeriagroup /app
USER pizzeriauser
# Install only production dependencies
RUN npm install --only=production
ENV NODE_ENV=production
# Expose the port and start the application
EXPOSE ${PORT:-3200}
CMD ["node", "dist/index.js"]