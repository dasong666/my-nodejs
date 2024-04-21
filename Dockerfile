FROM node:14

WORKDIR /apps

COPY package*.json ./

RUN npm install --production

COPY src/ ./src/

EXPOSE 8088

RUN chown -R node:node /apps

USER node

CMD ["npm", "start"]

