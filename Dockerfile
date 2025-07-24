# Build stage: use Node.js to build Angular app
FROM --platform=linux/amd64 node:20 AS build
WORKDIR /app

# Whether to use npm ci
ARG USE_NPM_CI=true

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install -g @angular/cli --save-dev
RUN if [ "$USE_NPM_CI" = "true" ]; then npm ci; else npm install; fi

# Copy source and build for production
COPY . .
RUN ng build --configuration production

# Runtime stage: serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/recepcion-fondos-publicos /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
