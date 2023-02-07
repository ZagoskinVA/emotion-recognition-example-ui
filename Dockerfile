FROM node:14-alpine
RUN npm install -g @vue/cli
WORKDIR /app
COPY package.json /app/package.json
COPY *.js /app
RUN npm install
COPY public /app/public
COPY src /app/src
RUN npm run build
CMD ["npx", "serve", "dist"]