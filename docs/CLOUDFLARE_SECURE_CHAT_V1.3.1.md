# V1.3.1 | Cloudflare Workers 安全 AI 对话上线手册

适用工程：Next.js 16 + OpenNext + Cloudflare Workers，生产域名默认 **`https://my.hanpeng.xyz`**，Worker 名称 `hanpeng-site`。**无需 ECS、VPS 或自建数据库。**

## 0. 先明确安全边界

访问者的浏览器只能访问 `/api/chat`，看不见 `OPENROUTER_API_KEY` 或 `TURNSTILE_SECRET_KEY`；这两个值只存在 Cloudflare **Worker Secret** 中。Turnstile 的 **Site Key 是公开值**，需要在前端脚本里出现，公开没有风险。

用户提问会被转发给 OpenRouter 及其选择的大模型提供方，因此**不要让用户通过本功能提交密码、证件、商业机密、私人文档**。本版已**切断私人 Upstash Vector RAG**：即使已有 `UPSTASH_VECTOR_*` 密钥，公开聊天也不会检索私人文件。模型的 system prompt 只引用网站的公开资料；system prompt 本身不应视为机密。

Cloudflare Workers 的速率限制为**单节点（PoP）近似限流**，并不是严格全局消费预算。出于防刷/控费，Turnstile + Worker Rate Limit + 模型服务商的 API Key 支出上限缺一不可。可选 Upstash Redis 追加**跨地区统一**的 10 次/5分钟/IP 限流。

## 1. 创建独立的 OpenRouter API Key（最重要的资金保险）

1. 打开 <https://openrouter.ai/settings/keys>。
2. **单独新建一个 Key**，例如 `hanpeng-public-site`，不要共用你本人的开发/生产 API Key。
3. 对这个新 Key 设置一个你能接受的**额度上限**，建议初期 **$2–$5 / 月** 或先用较低的非循环总额度观察。OpenRouter 支持单 Key credit limit 和不同周期的 reset；设置以你能接受的支出为准。
4. 如果当前存量 Key 曾经出现在 GitHub、浏览器代码、截图或前端 Network 中，**立即撤销旧 Key，创建新 Key**，不要仅删文件后继续使用旧 Key。
5. **不要**把 Key 复制到 GitHub Actions Variables、`NEXT_PUBLIC_*`、`wrangler.jsonc`、`content/profile.json`、聊天记录或网站源码中。

## 2. 在 Cloudflare Turnstile 创建站点

1. 登录 <https://dash.cloudflare.com/> → 左侧 **Turnstile** → **Add widget**。
2. Widget name：`hanpeng-portfolio-chat`；Hostname：**`my.hanpeng.xyz`**（按真实生产域名修改，只允许你拥有的域名）。推荐 Managed 模式。
3. 保存后得到两个值：
   - **Site Key**：公开，仅用于浏览器显示验证码，放到 GitHub Actions **Repository Variable** `NEXT_PUBLIC_TURNSTILE_SITE_KEY`。
   - **Secret Key**：私密，只放 Cloudflare Worker 的 **Secret** `TURNSTILE_SECRET_KEY`。
4. 本版前端首次打开聊天窗才加载官方 Turnstile JS。每次请求必须带上**单次验证码 token**；后端调用官方 Siteverify，并逐一校验 `success`、`hostname` 与 `action=portfolio_chat`。Token 最多 5 分钟有效，不能重复使用。

特别提醒：不需要把 Turnstile Secret 提供给 GitHub Actions 的构建步骤，也不需要放到前端 `.env` 中。**GitHub 的 Public Site Key 只在构建时内联**，所以仅在 Cloudflare 面板配置公开变量、却不设置 GitHub Actions Variable，会导致页面提示“尚未配置安全验证”。

## 3. Cloudflare Worker 保存真正的 Secret

在 Cloudflare 控制台：**Workers & Pages → `hanpeng-site` → Settings → Variables and Secrets → Add**：

| Name | Type | Value |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | **Secret** | 上一步新建的 OpenRouter API Key |
| `TURNSTILE_SECRET_KEY` | **Secret** | Turnstile Secret Key |
| `UPSTASH_REDIS_REST_URL` | Secret，可选 | Upstash REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Secret，可选 | Upstash REST token |

点击 **Deploy** 生效。保存后 Secret 不会在 Cloudflare Dashboard/Wrangler 中被反向读出。

或者，在项目目录运行（确保 `wrangler.jsonc` 中 `name=hanpeng-site`，已登录相同 Cloudflare 账号）：

```bash
npx wrangler login
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
# 下两项完全可选。如果填写，请两项都配置：
npx wrangler secret put UPSTASH_REDIS_REST_URL
npx wrangler secret put UPSTASH_REDIS_REST_TOKEN
```

> `wrangler secret put` 会部署一次新的 Worker 版本。如果正在准备首次上线，可以先部署新版无密钥代码、再添加 Secrets；缺少 Secrets 时 `/api/chat` **返回 503，不调用上游**。

## 4. Cloudflare 原生限流：无需单独创建 Redis

`wrangler.jsonc` 已配置 **Workers Rate Limiting API Binding**：

```json
"ratelimits": [
  { "name": "CHAT_RATE_LIMIT", "namespace_id": "1001", "simple": { "limit": 5, "period": 60 } }
]
```

Wrangler 部署时自动绑定 `CHAT_RATE_LIMIT`，对每个 IP 在每个 Cloudflare 节点约 5 次/分钟（短时间内可能超量，属于平台设计）。如需修改限额，编辑此配置后重部署；`namespace_id` 为本账号内可自行定义的正整数标识，与其他绑定避免冲突。**不是严格的跨全球配额。**

如果已有 Upstash，可以同时添加上面的两项 Redis Secret，使 Redis 作为第二层**全球一致**的滑动窗口限流。没有 Upstash，Cloudflare 原生绑定就足以作为低流量个人站的初步防护，但务必保留模型 Key 额度上限。

## 5. GitHub 自动部署配置

在 GitHub 仓库 **Settings → Secrets and variables → Actions**：

**Secrets**（部署权限，绝非模型密钥）：

- `CLOUDFLARE_API_TOKEN`：允许对当前 Worker 执行部署的 Cloudflare API Token（最小权限）。
- `CLOUDFLARE_ACCOUNT_ID`：Cloudflare Account ID。

**Variables**（这些不是秘密，会进入前端构建/公开配置）：

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`：第 2 步的 Site Key（**必须**）。
- `NEXT_PUBLIC_SITE_URL`：`https://my.hanpeng.xyz`（请与访问域名一致）。
- `OPENROUTER_MODEL`：要切换生产模型，请修改并提交 **`wrangler.jsonc` 中 `vars.OPENROUTER_MODEL`**（默认 `openai/gpt-4.1-mini`）；GitHub 的构建变量本身不会改变 Worker 运行时模型。
- `NEXT_PUBLIC_CF_BEACON_TOKEN`：可选的 Cloudflare Web Analytics 公共 Token。

注意：真正的 `OPENROUTER_API_KEY` 和 `TURNSTILE_SECRET_KEY` **不要放 GitHub 的 Variables 或构建步骤**；在 Worker Dashboard 中保存即可。每次 `main` 分支 push 会执行内容检查、chat 安全测试、TypeScript、ESLint 和 OpenNext 构建，然后部署。

## 6. 域名 / WAF（建议）

确保 `my.hanpeng.xyz` 指向这个 Worker，而不是错误地暴露另一台服务。`content/profile.json` 中 `meta.siteUrl`、GitHub 变量 `NEXT_PUBLIC_SITE_URL`、Turnstile widget hostname 都应一致。

如果站点域名在 Cloudflare 对应 zone 中可使用 WAF：

1. Cloudflare → 选中站点域名 → **Security → Security rules**。
2. **Create rule → Rate limiting rules**，建立仅匹配：
   ```text
   (http.request.uri.path eq "/api/chat" and http.request.method eq "POST")
   ```
3. 建议按 IP 统计，初始可用如 **20 次/分钟/IP → Block**（可用的时间窗、条件取决于套餐）。
4. 保存 Deploy。WAF 在 Worker 前过滤明显异常流量；Worker Binding 继续限制有效请求。

WAF 是额外一层，不是替代 Turnstile 或 Worker 的限流；使用 `*.workers.dev` 时不能假定你在自定义域名 zone 下配置的 WAF 规则会作用于它。

## 7. 本地开发 / 预览

从 `.env.example` 复制为 `.env.local` 用于 `npm run dev`。如果你想在**本地直接调用真实模型**，`next dev` 没有 Worker 原生限流绑定，必须同时配置 Upstash Redis URL + token，否则 `/api/chat` 503（安全失败）。

要测试 Cloudflare 原生限流绑定，推荐用 **OpenNext 预览**，在 `.dev.vars` 中保存本地 Secret（请务必 gitignore）。 `.dev.vars` 只供预览，别把它提交或上传。

```bash
npm ci
npm run check:content
npm run test:security
npm run typecheck
npm run lint
npm run build:cf
npm run preview:cf
```

本地的 Turnstile 校验要求 challenge hostname 与 `NEXT_PUBLIC_SITE_URL` 一致。推荐首先在真实域名上做端到端验收；如需完全本地端到端验证，使用 **独立的测试 Turnstile widget** 和本地 URL 设置，不要直接把生产 Secret 复制到测试环境。

## 8. 上线后 8 项验收

- [ ] 右下角聊天入口可见，Turnstile 验证成功后才可以发送。
- [ ] 页面 `/api/chat` Network Request 请求体仅含消息和一次性 `turnstileToken`；**没有** OpenRouter Key。
- [ ] 浏览器 Sources / JavaScript bundle 不包含 OpenRouter API Key。
- [ ] 完成验证发送一条“你好”，得到增量流式回复，再发送第二条会重新生成 token。
- [ ] 不带 token 调用接口返回 400；伪造 token 返回 403；从其他站点 Origin 请求返回 403。
- [ ] 单 Cloudflare 节点同 IP 多次请求被限流（429）；全局预算以 OpenRouter API Key 支出上限为准。
- [ ] 暂时移除 `TURNSTILE_SECRET_KEY` 时接口返回 503，且 OpenRouter 调用次数不增长。
- [ ] Cloudflare Logs、GitHub Actions Logs 不包含 Key、User Prompt 或 Token 原文。

> 强调：浏览器开发者工具可以看见自己的消息、Turnstile token 和助手生成的回复，这是功能必要的数据；密钥不会进入浏览器。Cloudflare 账号/部署 Token 泄露、恶意依赖、上游提供方的数据处理策略不在单一代理接口的绝对保护范围内。必要时启用 Cloudflare 账号 MFA、最小权限 API Token，检查上游数据保留政策。

## 9. 应急停止

- 最快：在 OpenRouter 控制台**禁用**此网站专属 API Key 或把支出上限降到 0；这样立即禁止新的付费调用。
- Cloudflare → Worker → Settings → Variables and Secrets，删除 `OPENROUTER_API_KEY` 或 `TURNSTILE_SECRET_KEY`，部署后聊天 API 503。
- 再部署代码将 `content/profile.json` 中 `chatbot.enabled` 设为 `false`，聊天按钮消失，API 404。
- 查看 Cloudflare Turnstile Analytics / WAF 事件 / Workers 日志，只排查状态码与拒绝次数；不要记录原始对话/Secret。

## 10. 参考官方文档

- Worker Secrets: <https://developers.cloudflare.com/workers/configuration/secrets/>
- Worker Rate Limiting Binding: <https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/>
- Turnstile 前端: <https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/>
- Turnstile 服务端: <https://developers.cloudflare.com/turnstile/get-started/server-side-validation/>
- OpenNext env-vars: <https://opennext.js.org/cloudflare/howtos/env-vars>
- OpenRouter API Key 限额: <https://openrouter.ai/docs/api_reference/authentication>
