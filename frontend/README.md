# RetailInsight Agent Frontend

RetailInsight Agent 的聊天式问数前端，技术栈为 React + Vite + Tailwind CSS + pnpm。

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

默认通过 Vite 代理访问后端 `/api/query`。如需指定后端地址，可复制 `.env.example` 为 `.env` 并配置 `VITE_DEV_PROXY_TARGET`。
