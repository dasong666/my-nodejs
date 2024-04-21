# Step 1: Specify the base image.
FROM node:14

# Step 2: Create app directory and set as workdir
WORKDIR /apps

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Step 4: Copy the application source files
COPY src/ ./apps/

# Step 5: Expose the port the app runs on
EXPOSE 8088

# Step 6: Optionally, specify the user to run the container as non-root for security
# First, ensure permissions allow for the node user to access the necessary directories
# This is important if the base image supports it, Node images typically come with a node user configured
RUN chown -R node:node /apps
USER node

# Step 7: Define the command to run the app
CMD ["node", "apps/app.js"]

