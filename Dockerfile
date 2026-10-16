# Этап 1: Сборка приложения
FROM node:20-alpine AS builder

RUN npm install -g pnpm@10

WORKDIR /app

# Vite инлайнит эти переменные в JS-бандл во время сборки,
# поэтому они нужны именно здесь, а не в runtime
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

ARG VITE_BASE_API_URL
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL

ARG VITE_GLITCHTIP_DSN
ENV VITE_GLITCHTIP_DSN=$VITE_GLITCHTIP_DSN

ARG VITE_GLITCHTIP_ENVIRONMENT
ENV VITE_GLITCHTIP_ENVIRONMENT=$VITE_GLITCHTIP_ENVIRONMENT

ARG VITE_GLITCHTIP_RELEASE
ENV VITE_GLITCHTIP_RELEASE=$VITE_GLITCHTIP_RELEASE

ARG VITE_UMAMI_URL
ENV VITE_UMAMI_URL=$VITE_UMAMI_URL
ARG VITE_UMAMI_WEBSITE_ID
ENV VITE_UMAMI_WEBSITE_ID=$VITE_UMAMI_WEBSITE_ID

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM scratch AS dist-assets

COPY --from=builder /app/dist /app

# Этап 2: Продакшн образ с nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

FROM nginx:alpine AS prebuilt-dist

ARG PREBUILT_DIST_DIR=.tmp/glitchtip-dist/app

COPY ${PREBUILT_DIST_DIR}/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
