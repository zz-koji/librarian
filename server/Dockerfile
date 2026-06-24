FROM node:22-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install --immutable 
COPY . .

FROM deps AS build
RUN yarn build
RUN yarn workspaces focus --production

FROM deps AS migrate
CMD ["yarn", "db:migrate"]

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package.json ./package.json
USER node
CMD ["node", "dist/src/main.js"]