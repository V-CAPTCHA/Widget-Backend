FROM node:17.4.0
ENV NODE_ENV=production
EXPOSE 5000
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "index.js" ]