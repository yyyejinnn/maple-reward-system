FROM node:18

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY libs ./libs

COPY apps/gateway ./apps/gateway

RUN npm install
RUN npm run build:gateway

CMD ["node", "dist/apps/gateway/src/main"]


