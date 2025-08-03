
# Use the official Node.js image as a base for the build environment
FROM node:18-alpine AS build


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


RUN npm run build


# Use a smaller, more secure base image for the final production environment
FROM node:18-alpine


WORKDIR /app

# Copy the build output from the 'build' stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public


EXPOSE 3000

# Define the command to start the production server
CMD ["npm", "start"]