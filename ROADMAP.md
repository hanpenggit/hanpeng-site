# Roadmap — 上线与后续优化

**站点：** hanpeng个人站（`hanpeng-site`，Cloudflare Workers）
**Last updated:** 2026-10-01

这是一份「已经建好之后」的清单：先把线上链路收口，再按优先级补内容。

---

## Phase 0 — 收口线上链路（待办，按这个顺序）

1. **确认正式域名**：现在 `meta.siteUrl` 是占位值 `https://me.hanpeng.xyz`。域名定下来后改 `content/profile.json → meta.siteUrl`（一处生效：canonical / sitemap / OG / JSON-LD）。注意不要把族记产品站的 `hanpeng.xyz` 填到这里。
2. **配 Cloudflare 密钥**（不会进仓库）：
   ```bash
   npx wrangler secret put OPENROUTER_API_KEY
   npx wrangler secret put UPSTASH_REDIS_REST_URL
   npx wrangler secret put UPSTASH_REDIS_REST_TOKEN
   ```
3. **域名绑定**：Workers → `hanpeng-site` → Settings → Domains & Routes → 添加域名。
4. **开 Cloudflare Web Analytics**：面板 → Analytics & Logs → Web Analytics → Add a site，把 token 配到 `NEXT_PUBLIC_CF_BEACON_TOKEN`（CI 变量或 `wrangler.jsonc → vars`）。
5. **CI 自动部署**：仓库 Settings 加 `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` 两个 secret，`deploy.yml` 就能在 push main 时自动上线。
6. **简历**：把正式版简历放到 `public/resume.pdf`（或改完 profile.json 跑 `npm run resume` 重新生成）。

---

## Phase 1 — 内容补全（ROI 最高）

- [ ] **教育背景**：`education` 现在是空数组，填进去后「工作 / 教育背景」切换器会自动出现。
- [ ] **证书资质**：`certifications` 为空时显示「暂无」，有证书就填。
- [ ] **项目**：现在只有族记一个。再加 2–3 个（如 convert_mysql_dump.py、照片同步/备份系统），每项都带 `metric` 结果指标；超过 6 个后首页会自动出现「查看全部」入口。
- [ ] **社交链接**：`identity.links` 里的 linkedin / github / youtube 现在是空的，填了才会显示对应图标按钮。
- [ ] **预约链接**：`links.scheduleCall` 空着，可填日历预约页。
- [ ] **开启聊天机器人**：`chatbot.enabled` 置为 `true`（先把 OpenRouter 密钥和消费上限配好）。

---

## Phase 2 — 体验与质量

- [ ] Lighthouse（移动端）：Perf ≥ 90 / A11y ≥ 95 / Best Practices ≥ 95 / SEO ≥ 95。
- [ ] 真机验收：iOS Safari + Android Chrome，320px 窄屏不横向滚动。
- [ ] `prefers-reduced-motion` 下动画跳过、内容完整。
- [ ] OG 图分享到微信/LinkedIn 检查中文是否正常（已加载 Noto Sans SC 兜底）。
- [ ] `sitemap.xml` / `robots.txt` 可访问，`/api/` 已被 robots 屏蔽。
- [ ] 聊天：正确回答、拒绝跑题、限流生效、流式输出正常。

---

## Phase 3 — 可选增强

- **事件看板**：`/api/event` 目前只写 Worker 日志。想要图表就挂一个 Analytics Engine 绑定，或在 Cloudflare 里启用 Zaraz（`lib/analytics.ts` 已优先走 `zaraz.track`）。
- **RAG**：把私有文章放进 `sources/`，跑 `node scripts/ingest.mjs` 入库 Upstash Vector，机器人回答会更贴近本人语气。
- **CSP**：现在没上（beacon 是外链脚本，需要放行 `static.cloudflareinsights.com` / `cloudflareinsights.com`），要加就一起加 `upgrade-insecure-requests`、`frame-ancestors`。
- **i18n**：内容全是中文，若要英文版可在 `profile.json` 里按字段加 `en` 变体。

---

## 成本

- 域名：约 ¥70–100/年。
- Cloudflare Workers 免费额度 + Web Analytics：$0。
- Upstash 免费额度：$0。
- OpenRouter：按 token 计费，便宜模型一次对话几分钱，且被限流 + 消费上限双重兜住；无人访问时 $0。

---

## 文件速查

| 文件 | 作用 |
|---|---|
| `content/profile.json` | 唯一内容数据源（含 `meta.siteUrl`、机器人开关） |
| `README.md` | 本地开发 / 部署 / 环境变量 |
| `.github/workflows/ci.yml` | typecheck + lint + build |
| `.github/workflows/deploy.yml` | push main → 部署到 Cloudflare |
| `wrangler.jsonc` | Worker 名、兼容性标志、构建期变量 |
| `scripts/gen-resume.py` | 由 profile.json 生成 `public/resume.pdf` |
| `docs/` | PRD / 设计说明 / 技术规格 |
