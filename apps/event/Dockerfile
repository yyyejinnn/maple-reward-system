FROM node:18

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY libs ./libs

COPY apps/event ./apps/event

RUN npm install
RUN npm run build:event

CMD ["node", "dist/apps/event/src/main"]

