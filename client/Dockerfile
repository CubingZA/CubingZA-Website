# Stage 1: Build Angular app
FROM node:18

WORKDIR /cubingza
RUN npm install -g @angular/cli
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN ng build --configuration production
RUN ./analytics.sh


# Stage 2: Serve via nginx
FROM nginx:1.23

COPY --from=0 /cubingza/dist/client /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
