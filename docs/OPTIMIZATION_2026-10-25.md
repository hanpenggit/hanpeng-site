> **历史资料（V1.3.0）**：当前 V1.3.1 已启用安全聊天，配置与验收请以 `CLOUDFLARE_SECURE_CHAT_V1.3.1.md` 和 `VALIDATION_V1.3.1.md` 为准。

# hanpeng-site V1.3.0 · Cloudflare Workers 无服务器优化交付

更新日期：2026-10-25。基于用户上传的源码包修改，不包含线上的 Workers 设置，也未部署到生产环境。

## 目标与约束

- 保留 Next.js 16、React 19、`@opennextjs/cloudflare`、`wrangler.jsonc` 和 GitHub Actions，无需 ECS、Docker 服务端、持久运行的 Linux 主机。
- 保留 `content/profile.json` 单一事实来源、三个已有项目、个人经历、深浅主题及 AI Lab 等全部现有内容；不虚构用户数据。
- 先完善 UX、SEO、安全与交付，不在同一版本叠加 vinext 迁移风险。

## V1.3.0 修改清单

1. **视觉**：优化暗/亮色对比、卡片圆角与层次、Hero 排版、头像图像尺寸与精度、移动端间距；首页指标改为服务端静态渲染，去除不必要的客户端计数动画；动画遵守 reduced-motion，保持 CSS 原生实现。
2. **可访问性**：新增键盘跳转到主要内容；补充导航 aria-label、项目展开 `aria-controls`、隐藏详情内容的 aria 状态；移动端导航改在 960px 折叠，缓解窄屏拥挤。
3. **内容**：统一项目列表页的中文说明，删除与 `profile.json` 不符合的分析/区块链/QA 等英文描述；修正 README 在线链接与 canonical 域名不一致（当前以 `my.hanpeng.xyz` 为准，**发布前请确认实际域名**）。
4. **SEO**：保留 sitemap、robots、Person JSON-LD，补充 OG 与 Twitter 的图片引用；更新时间元数据。
5. **聊天安全**：AI 助手关闭时接口 404；无密钥或无 Redis 限流时不能触发收费调用；Redis 出错后 fail-closed；使用 Cloudflare IP 而非可伪造的转发链；严格校验消息数组及请求长度；ASCII OpenRouter 头；流式响应只关闭一次，错误日志避免上游原始响应体。
6. **日志隐私**：自建事件接口仅记录事件白名单、有限字段与页面路径；剔除来源国家和任意属性，避免记录用户输入。
7. **Cloudflare**：将 API Route runtime 设为 OpenNext 支持的 `nodejs`；补充 `public/_headers` 中 immutable 资源缓存规则，避免依赖 Next 响应层设置静态资源头；保留 `nodejs_compat`。
8. **CI 与预检**：新增 `npm run check:content`（无第三方依赖），校验 JSON 内容、链接、域名、事件白名单以及 Workers 配置；GitHub 部署工作流在上传前执行内容、TypeScript 与 ESLint 检查。

## 本机验收命令

```bash
npm ci
npm run check:content
npm run typecheck
npm run lint
npm run build
npm run build:cf
npm run preview:cf
# 打开 localhost 并检查桌面端、手机端、深浅主题、项目展开以及 /sitemap.xml
```

### 付费 AI 聊天防护验收（先测试再开启）

1. 当前 `chatbot.enabled=false`：POST `/api/chat` 应返回 HTTP 404；网页不展示按钮。
2. 改成 `true` 但没有 `OPENROUTER_API_KEY`：返回 HTTP 503，不调用 OpenRouter。
3. 只有 API Key、缺 Redis：返回 HTTP 503，不调用 OpenRouter。
4. 同时配置 API Key 与 Redis：单 IP 5 分钟窗口最多 10 次，之后 HTTP 429。
5. 请求中含非法角色、非字符串内容或超过 1000 字符：HTTP 400，不调用模型；过大的请求 HTTP 413。
6. Redis 断连：HTTP 429，禁止直接绕过限流。跨机房生产应以 Cloudflare Worker 实际 IP 头完成验收。
7. 模型 SSE `[DONE]` 正常结束，不应有重复关闭的 `Invalid state` 错误。

## 部署步骤

1. 确认 DNS 域名，`content/profile.json > meta.siteUrl` / GitHub Actions 的 `NEXT_PUBLIC_SITE_URL` / Cloudflare Worker 自定义域一致。
2. 安装 Node 22；运行前述六个检查/构建命令。
3. 首次部署需 `npx wrangler login` 或使用 GitHub 仓库的 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` 两个 Secrets。
4. **保持聊天关闭**时不需要 OpenRouter / Upstash 密钥。确实要启用，再先用 `npx wrangler secret put OPENROUTER_API_KEY`、`UPSTASH_REDIS_REST_URL`、`UPSTASH_REDIS_REST_TOKEN` 注入，不放入 Git。
5. `npm run deploy:cf`（本机）或合并主分支（GitHub Actions）；确认自定义域映射不变。
6. 检查：首页、`/projects`、`/sitemap.xml`、`/robots.txt`、`/opengraph-image`、`/_next/static/*` 缓存、404，以及 `/api/chat` 禁用策略。

## 注意、边界与回滚

- 上传源码分析未包含 Cloudflare 控制台当前 Worker 和环境变量配置；这次**不会代替用户上线**。
- 如果真实域名是 `me.hanpeng.xyz` 而非 JSON 中的 `my.hanpeng.xyz`，部署前应统一为真实域名。
- Cloudflare 官方已经建议新项目优先选择 vinext；此仓库使用 OpenNext，后续单独做兼容性评估再决定迁移。
- 若线上启用聊天，请注意模型付费与 Upstash 消耗；关闭开关优先阻断成本。
- 回滚方式：在 Git 对本版本创建 tag 后发布；有问题时从上一个 tag 重新执行 `npm run build:cf && npm run deploy:cf`，或在 GitHub 中重新部署上一成功提交。
