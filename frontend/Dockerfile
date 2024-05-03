ARG NODE_VERSION=21.5.0

FROM node:${NODE_VERSION}-alpine


WORKDIR /app

# Copy the rest of the source files into the image.
COPY . .

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN npm install

# Expose the port that the application listens on.
EXPOSE 8080

# Run the application.
CMD npm start
