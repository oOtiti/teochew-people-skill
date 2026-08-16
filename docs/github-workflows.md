# GitHub Workflows

本仓库用 GitHub Actions 做跨版本基础检查和 npm 发布。工作流是自动化底线，不替代 `0.2.0` 的完整 release gate；维护者仍需在发布前完成 wiki 索引、lint、测试和 tarball 审计。

## CI

文件：`.github/workflows/ci.yml`

触发：

- 推送到 `main`；
- 打开或更新 Pull Request；
- 手动运行。

CI 在 Node.js 22 与 24 上执行：

```bash
npm ci
npm test
npm run readme:render:check
npm run pack:check
```

`npm test` 覆盖行为场景、安装器单测、wiki index check、wiki lint 和结构校验；`readme:render:check` 使用 GitHub Markdown API 验证四语言仓库首屏的实际 GFM 结构与入口顺序；`pack:check` 展示 npm dry-run tarball。CI 通过内置 `GITHUB_TOKEN` 调用 API，避免匿名速率限制。Pull Request 仍应在本地或独立验证任务中审阅完整命令输出与 tarball 清单：

```bash
npm run wiki:index:check
npm run wiki:lint
npm test
npm run readme:render:check
npm run pack:check
```

其中前两条是为了在需要时把索引或证据错误单独暴露到日志里；CI 本身以 `npm test` 为总门槛。

## Publish npm package

文件：`.github/workflows/publish-npm.yml`

触发：

- 发布 GitHub Release；
- 维护者手动运行。

工作流使用 Node.js 24，校验 Release tag 与 `package.json` 版本一致，运行结构校验与打包预检查，再通过 npm Trusted Publishing／OIDC 发布到 npmjs.com。若该版本已经存在，则跳过重复发布。仓库不保存长期 npm token。

自动发布开始前，Release 审核人必须确认完整 `0.2.0` release gate 已通过：

1. `npm run wiki:index:check`
2. `npm run wiki:lint`
3. `npm test`
4. `npm run readme:render:check`
5. `npm run pack:check`
6. 审阅 `npm pack --dry-run --json` 的精确文件清单

## Tarball 边界

公开包应包含：

- `skills/teochew-people-skill/` 下的 `SKILL.md`、raw、wiki、operations、维护脚本、vault templates 与 UI 元数据；
- 根目录安装／GitHub README 渲染检查脚本、`docs/` 中的公开工作流与发布说明、`examples/` 中的 before/after 和多媒体 showcase；
- `assets/hero-background.png`、`assets/hero.svg`、`assets/social-preview.png`、`assets/case-demo.svg`；
- README、CONTRIBUTING、LICENSE 与包元数据。

公开包绝不能包含：

- 用户 `~/.teochew-people`；
- 项目 `.teochew-people` overlay；
- 家庭资料、授权原件、私有 raw 或 profile；
- 工作区 `.worktrees`、缓存、日志、临时文件与打包产物。

`package.json#files` 是允许清单，发布前仍要人工检查 dry-run 输出。视觉资产存在于仓库不等于一定入包；四个文件必须逐一出现在 tarball 清单中。

## 为什么发布到 npmjs.com

公开入口是 [`teochew-people-skill`](https://www.npmjs.com/package/teochew-people-skill)，支持直接运行 `npx teochew-people-skill --codex --no-vault`。GitHub Packages 通常要求 scoped 包名和额外 registry 配置，不是当前公开分发路径。

维护者操作见 [publishing.md](./publishing.md)。
