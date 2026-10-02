<div align="center">

# hanpeng · 个人网站

**全栈开发工程师 & AI 工程师的个人站。** 单页作品集 + 一个只依据我真实资料回答问题的 AI 助手「问问 hanpeng」。

[在线访问](https://me.hanpeng.xyz) · [族记（在做产品）](https://hanpeng.xyz) · 邮箱 hanpeng.jack@qq.com

</div>

## 概览

Next.js 16（App Router）+ React 19 + Tailwind v4 的单页站点，内容全部来自 `content/profile.json`；通过 **OpenNext** 部署在 **Cloudflare Workers** 上。改内容只动那一个 JSON，页面和聊天机器人会一起更新。

## 特性

- **内容单一数据源** —— `content/profile.json`：个人信息、经历、项目、技能、指标、机器人文案全在里面，改完不用碰组件代码。
- **What I Build / 精选项目 / AI Lab / 工作经历 / Philosophy / Now / 技术栈 / 联系** 八个区块，空数据（教育、证书）会自动隐藏，不会出现空白面板。
- **「问问 hanpeng」AI 助手** —— 走 OpenRouter 流式输出，system prompt 只用 `profile.json` 的事实，按 IP 限流 + 长度/token 上限；未配密钥时优雅降级成邮箱引导。
- **简历生成脚本** —— `npm run resume` 可从 `profile.json` 生成 `public/resume.pdf`，与网页内容同源；按钮当前隐藏，需要时把 `identity.links.resume` 接回导航即可。
- **隐私友好统计** —— Cloudflare Web Analytics（无 cookie、无需同意弹窗）看浏览量和 Core Web Vitals；按钮点击走自有的 `/api/event`，落在 Worker 日志里。
- **深浅色主题**、圆形揭示动画、自定义指针、`prefers-reduced-motion` 全支持、320px 起响应式、中文有专门字体兜底。
- **SEO** —— canonical / sitemap.xml / robots.txt / OG 图（含中文字体）/ Person JSON-LD，站点地址由 `meta.siteUrl` 一处控制。

## 技术栈

| | |
|---|---|
| 框架 | Next.js 16（App Router）、React 19、TypeScript |
| 样式 | Tailwind CSS v4 + CSS 变量设计令牌、`next-themes` |
| 字体 | `next/font`（自托管）Instrument Serif / Space Grotesk / JetBrains Mono / Inter，中文回退 PingFang SC / 微软雅黑 / Noto Sans SC |
| 聊天 | OpenRouter（OpenAI 兼容流式）经 Edge route handler |
| 限流 | Upstash Redis + `@upstash/ratelimit`（10 条 / IP / 5 分钟） |
| 检索（可选） | Upstash Vector，做私有文档的 RAG |
| 统计 | Cloudflare Web Analytics + 自建 `/api/event` |
| 部署 | Cloudflare Workers（`@opennextjs/cloudflare` + wrangler） |

> 为什么直接用 OpenRouter 的 fetch 而不是 Vercel AI SDK：路由里自己用 `ReadableStream` 拆 SSE，依赖面最小，也避免了 `ai` 与 provider 之间的版本耦合。行为一致：逐字流式、只依据 `profile.json`、限流、密钥只在服务端。

## 本地开发

```bash
git clone https://github.com/hanpenggit/hanpeng-site.git
cd hanpeng-site
npm install
cp .env.example .env.local      # 本地 UI 开发可以不填
npm run dev                     # http://localhost:3000
```

不配任何环境变量也能跑：只是聊天机器人会回「发邮件找我」，限流会空转。

Windows 下也可以双击 `启动网站.bat`（用 `E:/devtools` 的 Node，端口 3026）。

### 环境变量

| 变量 | 是否必须 | 用途 |
|---|---|---|
| `OPENROUTER_API_KEY` | 线上聊天需要 | 机器人模型调用（**仅服务端**） |
| `OPENROUTER_MODEL` | 可选 | 模型 slug，默认 `anthropic/claude-3.5-haiku` |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | 线上限流需要 | 按 IP 限流，防刷 |
| `UPSTASH_VECTOR_REST_URL` / `_TOKEN` | 可选 | RAG 检索，没有就只用 profile.json |
| `NEXT_PUBLIC_SITE_URL` | 建议 | canonical / sitemap / OG，不填则用 `meta.siteUrl` |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | 可选 | Cloudflare Web Analytics，不填则不加载统计脚本 |

`OPENROUTER_API_KEY` 只在 `app/api/chat/route.ts` 里读取，不会进浏览器包。

### 脚本

```bash
npm run dev         # 本地开发
npm run build       # 生产构建
npm run build:cf    # 构建 Cloudflare Worker 产物（.open-next）
npm run preview:cf  # 本地用 wrangler 预览 Worker
npm run deploy:cf   # 部署到 Cloudflare
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run resume      # 从 profile.json 重新生成 public/resume.pdf（需 python + reportlab）
```

## 改内容

只改 **`content/profile.json`**：身份、经历、教育、项目、技能、专长、证书、头部指标、机器人文案、埋点事件清单都在里面，`lib/types.ts` 是其类型镜像。

几个容易踩的点：

- `meta.siteUrl` 是**本站在 Cloudflare 上的地址**（canonical / sitemap / OG / JSON-LD 都用它），和 `identity.links.website`（族记产品站）是两回事。
- `identity.links.resume` 指向 `/resume.pdf`。换成你手做的简历就直接覆盖 `public/resume.pdf`；想保持同步就跑 `npm run resume`。
- `education` / `certifications` 为空时对应区块会自动隐藏，填上就自动出现。
- 聊天机器人开关：`chatbot.enabled`。

## 部署（Cloudflare Workers）

1. 首次在 Cloudflare 建好 Worker 资源后，**密钥用 wrangler 写入**（不会进仓库）：

   ```bash
   npx wrangler secret put OPENROUTER_API_KEY
   npx wrangler secret put UPSTASH_REDIS_REST_URL
   npx wrangler secret put UPSTASH_REDIS_REST_TOKEN
   npx wrangler secret put UPSTASH_VECTOR_REST_URL     # 可选
   npx wrangler secret put UPSTASH_VECTOR_REST_TOKEN   # 可选
   ```

2. 本地部署：`npm run build:cf && npm run deploy:cf`（wrangler 会读 `wrangler.jsonc`，Worker 名 `hanpeng-site`）。

3. **CI 自动部署**：push 到 `main` 触发 `.github/workflows/deploy.yml`。在仓库 Settings 里配置 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` 两个 secret，以及可选的变量 `NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_CF_BEACON_TOKEN`。

4. 自定义域名：Cloudflare 面板 → Workers → `hanpeng-site` → Settings → Domains & Routes → 添加域名；然后把 `meta.siteUrl` 改成它。

5. 看日志：面板 Workers → Logs，或 `npx wrangler tail`（`/api/event` 的点击事件会打印 `site_event`）。

## 安全

- API 密钥仅服务端读取，`.env*` 已 gitignore（只提交 `.env.example` 占位）。
- 聊天接口：按 IP 限流、单条长度上限、`max_tokens` 上限、system prompt 严格限定于 `profile.json`。配合 OpenRouter 的消费上限使用。
- 安全响应头（`X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`、`Permissions-Policy`）在 `next.config.ts` 里；HSTS 建议在 Cloudflare 面板开启。

## 项目结构

```
app/            路由、layout、chat/event API、sitemap、robots、动态 OG 图、404/error 页
components/     layout（导航/页脚/主题/指针/背景）、hero、build、projects、ai-lab、work、philosophy、now、stack、contact、chat、ui
content/        profile.json —— 唯一数据源
lib/            profile 加载、类型、站点 URL、system prompt、限流、检索、统计
public/         头像、favicon
scripts/        gen-resume.py（从 profile.json 生成简历，输出到本地不入库）、ingest.mjs（RAG 入库）
docs/           PRD / 设计说明 / 技术规格
```

## License

[MIT](./LICENSE)

---

<div align="center">
<sub>Next.js 构建，内容在 JSON 里，部署在 Cloudflare Workers。</sub>
</div>
