FROM node:18.10-alpine

WORKDIR /app
COPY ./src /app/src
COPY ./next.config.js /app/next.config.js
COPY ./next-env.d.ts /app/next-env.d.ts
COPY ./nodemon.json /app/nodemon.json
COPY ./package.json /app/package.json
COPY ./tsconfig.json /app/tsconfig.json
COPY ./tsconfig.server.json /app/tsconfig.server.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn
RUN yarn build

CMD ["yarn", "prod"]
