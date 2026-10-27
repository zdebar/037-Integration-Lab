FROM node:22-slim

WORKDIR /app
RUN chown node:node /app

COPY --chown=node:node package*.json ./

USER node
RUN npm ci --include=optional

COPY --chown=node:node index.html vite.config.js ./
COPY --chown=node:node public ./public
COPY --chown=node:node src ./src

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
