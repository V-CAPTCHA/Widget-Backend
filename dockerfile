FROM node:12.18.1
ENV NODE_ENV=production
EXPOSE 3000
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "index.js" ]