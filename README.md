<div align="center">

# hanpeng · 个人网站

**全栈开发工程师 & AI 工程师的个人站。** 单页作品集 + 一个只依据我真实资料回答问题的 AI 助手「问问 hanpeng」。

[在线访问](https://my.hanpeng.xyz) · [族记（在做产品）](https://hanpeng.xyz) · 邮箱 hanpeng.jack@qq.com

</div>

## 概览

Next.js 16（App Router）+ React 19 + Tailwind v4 的单页站点，内容全部来自 `content/profile.json`；通过 **OpenNext** 部署在 **Cloudflare Workers** 上。改内容只动那一个 JSON，页面和聊天机器人会一起更新。

## 特性

- **内容单一数据源** —— `content/profile.json`：个人信息、经历、项目、技能、指标、机器人文案全在里面，改完不用碰组件代码。
- **What I Build / 精选项目 / AI Lab / 工作经历 / Philosophy / Now / 技术栈 / 联系** 八个区块，空数据（教育、证书）会自动隐藏，不会出现空白面板。
- **「问问 hanpeng」AI 助手** —— OpenRouter 流式输出；Cloudflare Turnstile（服务端验证）+ Worker 原生 Rate Limiting Binding + 可选 Upstash 全局限流；对外只发送公开个人站资料。
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
| 聊天 | OpenRouter（OpenAI 兼容流式）经 Workers 兼容的 Node.js route handler |
| 限流 | Cloudflare Worker Rate Limit Binding（5 次/分钟/IP/PoP）+ 可选 Upstash Redis（10 次/5 分钟/IP，全球） |
| 检索 | 公开聊天禁用私人文档 RAG，以防泄露 |
| 统计 | Cloudflare Web Analytics + 自建 `/api/event` |
| 部署 | Cloudflare Workers（`@opennextjs/cloudflare` + wrangler） |

> 为什么直接用 OpenRouter 的 fetch 而不是 Vercel AI SDK：路由里自己用 `ReadableStream` 拆 SSE，依赖面最小，也避免了 `ai` 与 provider 之间的版本耦合。行为一致：逐字流式、只依据 `profile.json`、限流、密钥只在服务端。

## V1.3.1：公开 AI 聊天安全启用指南

> **首次部署请先读 [`docs/CLOUDFLARE_SECURE_CHAT_V1.3.1.md`](docs/CLOUDFLARE_SECURE_CHAT_V1.3.1.md)**，其中包含 Turnstile、Worker Secrets、原生限流、GitHub 变量、WAF、费用限额的逐项配置步骤。
>
> 本版本 `chatbot.enabled=true`：公开页面会显示聊天入口。**未配置 Worker Secret/Turnstile 时，发消息被安全禁用或返回 503，绝不产生模型调用费用。**
>
> 模型 Key 与 Turnstile Secret 只能留在 Cloudflare Workers Secrets 中；浏览器只拥有 Turnstile 的公开 Site Key。公开 AI 不再读取任何私人 Upstash Vector 文档。

## 本地开发

```bash
git clone https://github.com/hanpenggit/hanpeng-site.git
cd hanpeng-site
npm ci
cp .env.example .env.local
npm run dev
```

聊天需要设置环境变量；不配置也不会影响个人网站的其他页面。

| 变量 | 作用与存放位置 |
| --- | --- |
| `OPENROUTER_API_KEY` | **Cloudflare Worker Secret**，服务端独用 |
| `TURNSTILE_SECRET_KEY` | **Cloudflare Worker Secret**，服务端验证单次 token |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | **GitHub Actions Variable**（公开，可进浏览器构建） |
| `OPENROUTER_MODEL` | 公开模型 slug，默认 `openai/gpt-4.1-mini` |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | 可选 Worker Secrets，跨 Cloudflare 节点的全球严格限流 |
| `NEXT_PUBLIC_SITE_URL` | 建议设置为 `https://my.hanpeng.xyz` |

```bash
npm run check:content
npm run test:security
npm run typecheck
npm run lint
npm run build:cf
npm run preview:cf
# 验证通过后
npm run deploy:cf
```

`npm run dev` 不处于 Cloudflare Workers 环境，缺少原生限流绑定，因此要本地真模型对话请设置额外的 Upstash Redis。生产推荐在 Cloudflare Worker 预览或正式域名测试。Cloudflare 原生 `CHAT_RATE_LIMIT` 是 **5/分钟/IP/PoP** 的近似限制，不是额度控制；模型账号必须设置支出上限。

## Cloudflare 部署

`wrangler.jsonc` 保留 OpenNext + Workers，并已声明 `CHAT_RATE_LIMIT` 绑定。`main` push 自动执行 `.github/workflows/deploy.yml`：内容检查、安全测试、TypeScript、Lint、OpenNext 构建后用 Wrangler 部署。GitHub Actions 需要 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` 两个 Secret，及 **`NEXT_PUBLIC_TURNSTILE_SITE_KEY`** 公共构建变量。**不要把大模型 API Key 放到 GitHub、wrangler.jsonc 或 NEXT_PUBLIC 环境变量**。

完整的 Cloudflare 控制台路径见专门的 [上线手册](docs/CLOUDFLARE_SECURE_CHAT_V1.3.1.md)。

## 改内容

只改 **`content/profile.json`**：身份、经历、教育、项目、技能、专长、证书、头部指标、机器人文案、埋点事件清单都在里面，`lib/types.ts` 是其类型镜像。

几个容易踩的点：

- `meta.siteUrl` 是**本站在 Cloudflare 上的地址**（canonical / sitemap / OG / JSON-LD 都用它），和 `identity.links.website`（族记产品站）是两回事。
- `identity.links.resume` 指向 `/resume.pdf`。换成你手做的简历就直接覆盖 `public/resume.pdf`；想保持同步就跑 `npm run resume`。
- `education` / `certifications` 为空时对应区块会自动隐藏，填上就自动出现。
- 聊天机器人开关：`chatbot.enabled`。

## 部署（Cloudflare Workers）

不需要 ECS/VPS。GitHub 自动部署（或 `npm run build:cf && npm run deploy:cf`）保留 OpenNext Workers 架构。
**唯一需要额外操作的是：在 Cloudflare Turnstile 创建 Widget、把服务端 Secret 设置到 Worker、把公开 Site Key 设置到 GitHub Actions 的构建变量。** 具体图文式操作清单见 [安全聊天上线手册](docs/CLOUDFLARE_SECURE_CHAT_V1.3.1.md)。

## 安全

见 [Cloudflare 安全对话上线手册](docs/CLOUDFLARE_SECURE_CHAT_V1.3.1.md)。

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
