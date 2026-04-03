FROM node:24-alpine AS development

WORKDIR /app

RUN npm install -g browser-sync@3

ENV APP_MODE=development
ENV RUNTIME_CONFIG_DIR=/runtime

COPY web ./web
COPY docker /opt/docker

RUN chmod +x /opt/docker/*.sh && mkdir -p /runtime

EXPOSE 3000

ENTRYPOINT ["/opt/docker/entrypoint.sh"]
CMD ["browser-sync", "start", "--server", "/app/web", "--serveStatic", "/runtime", "--host", "0.0.0.0", "--port", "3000", "--files", "/app/web/**/*,/runtime/env.js", "--no-open", "--no-ui"]

FROM nginx:stable-alpine AS production

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

ENV APP_MODE=production
ENV RUNTIME_CONFIG_DIR=/usr/share/nginx/html

COPY web/ ./
COPY docker /opt/docker

RUN chmod +x /opt/docker/*.sh

EXPOSE 80

ENTRYPOINT ["/opt/docker/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
