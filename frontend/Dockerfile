FROM node:18-alpine

WORKDIR /app

COPY . /app

RUN npm install -g pnpm --global-dir=/usr/local/lib/pnpm

RUN pnpm install

RUN pnpm run build

EXPOSE 6500

#RUN npm install  serve
#CMD ["npm", "serve"]
#CMD ["pnpm", "server",  "start"]
#RUN pnpm install serve
#CMD ["serve", "./dist",  "-l", "tcp://0.0.0.0:6500"]

CMD ["pnpm", "run", "dev", "--host"]