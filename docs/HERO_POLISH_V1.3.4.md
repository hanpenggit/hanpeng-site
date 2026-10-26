# V1.3.4 — 首页 Hero 视觉微调（基于 V1.3.3）

## 本轮范围

- Hero 区域：桌面顶部留白从 70px → 52px；手机顶部留白调整至 36px。
- 排版：桌面采用比例受控的双栏，头像垂直居中，780px 及以下切换单栏；手机端允许身份标签自然换行。
- 排版字号：姓名和标语分别使用适度缩小的 `clamp()`，降低中等宽度屏幕的拥挤感。
- 交互入口：主按钮、GitHub 与邮箱链接统一为 48px 高度、10px 间距；保留原链接、事件名和邮件复制逻辑。
- 头像：卡片桌面宽度 228px、手机 212px，外层辅助框线收紧；减少宽大边框造成的空旷感。
- 衔接：头像下方的指标卡间距改由 `.hero-metrics` 统一控制；考虑到装饰文字向下溢出，窄屏预留 40px，避免遮挡。
- 下一个「我在构建什么」区块顶部留白 56px → 46px，视觉衔接更紧凑。
- 工程元数据版本号：`package.json` 与 `package-lock.json` 同步为 `1.3.4`。

## 本轮未修改

- `content/profile.json`、作品与经历内容
- Cloudflare Workers、Wrangler、OpenNext 配置
- AI 聊天、Turnstile、模型密钥读取、限流、安全检查
- 所有聊天 API、行为埋点事件的名称

## 验证建议

在 GitHub 仓库根目录应用补丁后执行：

```bash
npm ci
npm run check:content
npm run test:security
npm run typecheck
npm run lint
npm run build:cf
```

还需要在本地浏览器 DevTools 检查以下屏宽：320 / 390 / 768 / 824 / 1024 / 1440 px。
重点检查：320px 横向溢出、780px 的单/双栏切换、824px 头像是否紧贴右栏、头像与指标卡是否遮挡、按钮键盘焦点。

> 工程已执行内容预检、安全回归、TSX 与 CSS 语法解析。当前执行环境中的 Chromium
> 无法完成截图渲染，因此不将浏览器视觉验证列为通过；完整构建也需要在实际安装依赖后检查。
