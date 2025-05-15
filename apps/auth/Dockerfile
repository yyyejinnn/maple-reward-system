FROM node:18

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY libs ./libs

COPY apps/auth ./apps/auth

RUN npm install
RUN npm run build:auth

CMD ["node", "dist/apps/auth/src/main"]
