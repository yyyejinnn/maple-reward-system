FROM node:18

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY libs ./libs

COPY apps/gateway ./apps/gateway

RUN npm install
RUN npm run build:gateway

CMD sh -c "node dist/apps/gateway/src/seeds/seeder.js || echo '⚠️ Seed failed'; node dist/apps/gateway/src/main.js"



