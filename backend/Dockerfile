FROM node:16.11.0-alpine
WORKDIR /var/www
COPY package.json package-lock.json ./
RUN npm ci
COPY . /var/www/
RUN npm run build
EXPOSE 8000
ENTRYPOINT npm run start:prod