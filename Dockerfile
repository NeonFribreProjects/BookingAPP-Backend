FROM node:16.18.1-alpine as build
WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:16.18.1-alpine as prod-packages
WORKDIR /app
COPY ./package*.json ./
RUN npm ci --omit=dev

FROM node:16.18.1-alpine as run
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=prod-packages /app/node_modules ./node_modules
COPY ./package*.json ./
COPY ./prisma ./prisma
RUN npx prisma generate
CMD [ "npm", "run", "start" ]
