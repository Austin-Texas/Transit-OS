FROM node:22-bookworm-slim AS build
WORKDIR /app
ARG VITE_PUBLIC_DEMO=true
ENV VITE_PUBLIC_DEMO=${VITE_PUBLIC_DEMO}
ARG VITE_BASE44_APP_ID
ARG VITE_BASE44_APP_BASE_URL
ENV VITE_BASE44_APP_ID=${VITE_BASE44_APP_ID}
ENV VITE_BASE44_APP_BASE_URL=${VITE_BASE44_APP_BASE_URL}
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
# Vite preview host validation for the Cloudflare public hostname.
ENV __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=transit.hastenload.com
COPY --from=build /app /app
EXPOSE 80
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80"]
