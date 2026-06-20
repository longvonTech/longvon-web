# MATEYOU API — Production Dockerfile
# 多阶段构建，最终镜像仅含运行时所需文件

FROM node:20-bookworm-slim AS base
WORKDIR /workspace

# ---- 依赖安装（利用Layer缓存：仅在package*.json变化时重新安装）----
FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/package.json
COPY packages/database/package.json packages/database/package.json
RUN npm ci --workspace=apps/api --workspace=packages/database --ignore-scripts

# ---- 构建 ----
FROM deps AS build
COPY packages/database packages/database
COPY apps/api apps/api
RUN npm run generate --workspace=packages/database
RUN npm run build --workspace=apps/api

# ---- 生产运行时（最小镜像）----
FROM node:20-bookworm-slim AS runner
WORKDIR /workspace
ENV NODE_ENV=production
# 仅复制生产运行所需文件
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/packages/database/generated ./packages/database/generated
COPY --from=build /workspace/apps/api/dist ./apps/api/dist
COPY --from=build /workspace/apps/api/package.json ./apps/api/package.json
COPY --from=build /workspace/packages/database/package.json ./packages/database/package.json

# 非root用户运行，安全最佳实践
RUN useradd --create-home --uid 1001 appuser && chown -R appuser /workspace
USER appuser

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:4000/health/live || exit 1

CMD ["node", "apps/api/dist/main.js"]
