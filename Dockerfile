# syntax=docker/dockerfile:1
FROM node:18
WORKDIR /data
COPY package.json .
COPY pnpm-lock.yaml .
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build
CMD ["pnpm", "run", "start"]
