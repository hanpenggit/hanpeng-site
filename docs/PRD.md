# PRD — hanpeng 个人网站 V2

**Owner:** hanpeng
**Status:** Shipped (v2.0.0)
**Last updated:** 2026-10-02
**Companion docs:** `DESIGN_BRIEF.md`（视觉）、`TECHNICAL_SPEC.md`（架构）、`content/profile.json`（唯一数据源）

---

## 1. 定位

**hanpeng — Personal AI Workspace**

不是一份线上简历，而是一个持续构建产品的工程师的个人空间：

> Software Engineer · AI Builder · Independent Developer
> 写好代码，做有生命力的产品。

**目标读者：** 招聘方、外包客户、技术同行。
**页面要完成的事：** 让访客在两分钟内相信——这个人能独立从想法做到上线，能把 AI 落进真实产品，也能把控底层基础设施——然后直接和他的 AI 分身对话验证。

## 2. 核心叙事链

```
他是谁 → 他正在做什么 → 他真的有产品 → 他还在研究 AI
       → 他懂基础设施 → 可以直接问他的 AI → 看得到工程原则
```

## 3. 信息架构（首页自上而下）

| 顺序 | 区块 | 数据源 | 作用 |
|---|---|---|---|
| 01 | Hero | identity | 定位 + 状态徽章 + 双 CTA |
| 02 | What I Build | build | 三条主线：Products / AI Systems / Infrastructure |
| 03 | Selected Projects | projects | 产品 / AI 实验 / 基础设施三个维度的作品 |
| 04 | AI Lab | aiLab | Local LLM / Knowledge / Vision / Agents 实验卡 |
| 05 | Experience | experience | 工作经历时间线（默认展示主线） |
| 06 | Engineering Philosophy | philosophy | 四条工程信念 |
| 07 | Now | now | BUILDING / EXPLORING / RUNNING + 更新时间 |
| 08 | 技术栈 | skills + skillNotes | 标签 + 实战注脚，作为"证据"而非主角 |
| 09 | 联系方式 | identity + chatbot | 双 CTA + AI 分身提示 |

**原则：** 区块顺序固定；`profile.json` 中缺数据的区块自动隐藏（教育/证书/AI Lab/Now 均如此），因此改内容永远不需要动组件。

## 4. AI 分身（核心差异化）

- 开关：`chatbot.enabled`（缺省视为开启，与 ChatProvider 语义一致）。
- 后端：Edge route → OpenRouter 流式输出；Upstash Redis 按 IP 限流；可选 Upstash Vector RAG。
- 数据边界：system prompt 只注入 `profile.json` 事实 + 可选私有文档检索；跑题引导至邮件。
- 产品角色：它不是彩蛋，而是"这个网站本身就是一个 AI 应用"的证明。

## 5. 非目标（刻意不做）

- 大量动画、粒子背景、3D、玻璃拟态——克制的排版就是设计本身。
- GitHub contribution graph 等纯视觉数据墙。
- 首页塞十几个项目——三个维度各一个代表作品足够。

## 6. 成功标准

- 移动端（320px 起）无横向滚动，Lighthouse 移动端 ≥90。
- 访客能说出"他在做族记、他在研究 AI、他懂基础设施"三句话。
- AI 分身能准确回答项目/架构/AI 问题，跑题时礼貌引导邮件。
- 改内容只动 `profile.json`。
