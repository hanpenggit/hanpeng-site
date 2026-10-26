# V1.3.1 本地安全优化与验证记录

**状态：静态预检与独立安全测试通过，完整生产构建/Cloudflare 端到端验收未完成。**

## 本次功能修改

- `chatbot.enabled=true`；前端右下角可见聊天，Turnstile Site Key 没有在**构建时**配置则发送禁用。
- 每次聊天必须使用新 Turnstile token；Worker 用私密 Secret 调用 Siteverify 校验成功状态、真实 hostname 与 `portfolio_chat` 动作；失败绝不调用模型。
- Cloudflare Workers 原生 Rate Limit Binding：约 5次/分钟/IP/PoP，绑定名 `CHAT_RATE_LIMIT`；可选 Upstash Redis 做额外的全球统一限流。完全缺少任何有效限流配置则拒绝模型调用。
- OpenRouter Token 从 Cloudflare Secret 动态读取（仅服务端），没有 Secret 时返回 503。
- Origin 严格检查，输入包 12KB、最多 10 轮消息、每条最多 700 字符、合计最多 3000 字符、模型输出最多 400 tokens / 6000 字符，超时 25s。
- 公开聊天禁用私人文档 RAG；上游仅收到已发布在网站源码中的个人资料、用户消息及模型先前回复。
- 添加 CI 依赖无关的本地安全回归测试，更新 Secret/Turnstile/WAF/预算控制手册。

## 实际执行结果

| 检查 | 状态 | 说明 |
| --- | --- | --- |
| `npm run check:content` | PASS | profile、Workers 配置、私有 API 不泄露到变量区、聊天路径静态约束 |
| `npm run test:security` | PASS | 消息校验、Origin、Turnstile token、fail-closed / action / hostname / 上游故障（mock，无网络） |
| TypeScript AST 语法分析 | PASS | 58 个 `.ts` / `.tsx` 文件，解析错误 0（不等于类型检查） |
| 可疑明文 Key 模式检查 | PASS | 0 命中；无法替代供应商密钥轮换和 CI 秘密扫描 |
| package.json 与 package-lock.json 版本 | PASS | 1.3.1 / 1.3.1 |
| `npm ci --offline` | BLOCKED | 运行环境 npm 缓存缺少 `youch-core-0.3.3.tgz`，报 `ENOTCACHED` |
| `npm run typecheck`、`npm run lint`、`npm run build:cf` | 未执行 | 未能安装 npm 依赖，不能宣称这些检查已通过 |
| Turnstile 真实 token / OpenRouter 实时通信 | 未执行 | 本环境没有用户 Cloudflare Secret 与上游账号 |
| Cloudflare 生产部署、浏览器端到端测试 | 未执行 | 需用户或 GitHub CI 部署并在真实域名验收 |

## 合入门槛

```bash
npm ci
npm run check:content
npm run test:security
npm run typecheck
npm run lint
npm run build:cf
npm run preview:cf
```

运行 Cloudflare Workers 实机验收清单见 `docs/CLOUDFLARE_SECURE_CHAT_V1.3.1.md`。严禁把上游 API Key / Turnstile Secret 上传到仓库或聊天中。
