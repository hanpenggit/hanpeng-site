# hanpeng-site V1.3.2 · 内容与可信度审查

日期：2026-10-26。基于用户上一版 V1.3.1 完整工程修改；未修改 Cloudflare Secret、Turnstile、Workers 限流或聊天服务端业务逻辑。

## 为什么改

此前站点设计和技术栈已比较完整，但作品集只列出了「族记」、泛化的 AI Lab 和基础设施，未让访客看见近期有代表性的 AI Workflow OS 研发。项目大多是技术名词和能力描述，缺少清楚的「问题 → 方案 → 目前进度」。第三个指标显示 `AI 0 Builder`，可能造成歧义；AI 助手自称“AI 形态 / 分身”，也容易令访客误以为其具有本人身份和权威。

## 已完成

1. 新增 **AI Workflow OS** 独立项目，表述为 **研发中**。基于可公开的研发方向介绍 Mission / Task DAG、执行器适配、Dify / Python、状态与失败恢复、事件与结果追溯；不公开内部地址、凭证、客户项目数据或不适合公开的工作流内容。
2. 将每个项目统一增加 `stage`、`caseStudy.challenge`、`caseStudy.approach`、`caseStudy.progress`。组件通过相同公开 JSON 数据源显示「要解决的问题 / 设计与取舍 / 进展与边界」，不依赖 CMS/数据库/额外服务器。
3. 首页只精选「族记、AI Workflow OS、AI Engineering Lab」，其他项目保留于 `/projects`，使“查看全部”入口有意义。
4. 重新组织首页定位、AI Lab 描述与近况，明确实验、开发与持续运营的区别。清除“AI 0 Builder”误导性数字，改为 3 条工程主线。
5. 修改 AI 助手欢迎词、身份描述与引导问题，明确“基于公开资料，不是本人”；联系区域移除无依据的“一天内回复”承诺。
6. `scripts/check-site.mjs` 增加项目状态和案例结构验证。版本升级为 V1.3.2，部署框架不变。

## 不做的事（防止把宣传写成虚构）

- 不写客户名称、营收、日活、并发吞吐、延迟降低百分比、测试通过数或生产 SLA——这些没有可公开且已核实的依据。
- 不把“本地验证完成”写成“已稳定上线生产”；AI Workflow OS 明确保留研发阶段说明。
- 不把私有知识库、系统提示词、日志原文或配置凭证公开在 `profile.json`；**公开 profile 内容会作为 AI 助手提示词送到第三方模型**。
- 没有使用截图或真实线上演示，因为当前材料未提供可核实的项目配图，不制造假的 UI 或成果图。

## 上线前仍需要作者核对的事实

- `profile.json` 的个人履历、地点、`10+` 年经验与族记功能介绍是否仍真实。
- AI Workflow OS 的项目名称和可公开范围（已仅使用高层架构信息）。
- `meta.siteUrl` 是否为实际正式域名（V1.3.1 为 `https://my.hanpeng.xyz`；部分公开 README 历史信息曾使用其他子域名）。
- 未来若公开真实项目截图、架构图、开源地址或可复现测评，应在获得实际材料后再增加，不要用占位图和编造数据。

## Cloudflare 自动部署

保留 `wrangler.jsonc`、`open-next.config.ts`、`package.json` 的原有部署命令和所有聊天安全文件。无需 `.github` 工作流。将本次变更提交到 Cloudflare 连接的 GitHub 仓库后自动部署；之前尚未设置的 Turnstile Build Variable 和 Worker Secrets 仍需按 V1.3.1 指南配置。内容更新不会让 AI Key 暴露到浏览器。

## 验证

```bash
npm run check:content
npm run test:security
npm ci
npm run typecheck
npm run lint
npm run build:cf
```

前两项不依赖 node_modules；后面的构建命令需要先安装项目依赖。真实 Workers Builds 与对话收费链路请在 Cloudflare 环境验收。
