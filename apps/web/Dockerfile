# MATEYOU Web — Production Dockerfile (Next.js standalone mode)

FROM node:20-bookworm-slim AS base
WORKDIR /workspace

FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci --workspace=apps/web --ignore-scripts

FROM deps AS build
COPY apps/web apps/web
# Next.js standalone output模式：将server.js和所有依赖打包进.next/standalone，
# 极大减小生产镜像体积（通常从500MB+缩小到100MB以内）
# 需要在next.config.ts中设置output:'standalone'
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace=apps/web

FROM node:20-bookworm-slim AS runner
WORKDIR /workspace
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN useradd --create-home --uid 1001 appuser

# standalone模式：只复制.next/standalone下的独立产物
COPY --from=build --chown=appuser /workspace/apps/web/.next/standalone ./
COPY --from=build --chown=appuser /workspace/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=appuser /workspace/apps/web/public ./apps/web/public

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# standalone模式的启动命令（不再需要npx next start）
CMD ["node", "apps/web/server.js"]
