# npm 发布与更新指南

本文件供维护者使用。`0.2.0` 是这次 LLM Wiki 结构升级的 release target；版本号写进仓库不代表已经发布，必须先完成证据、结构、行为与 tarball 四类检查。

## 发布目标

- Package：[`teochew-people-skill`](https://www.npmjs.com/package/teochew-people-skill)
- Repository：[`oOtiti/teochew-people-skill`](https://github.com/oOtiti/teochew-people-skill)
- Target version：`0.2.0`
- 实际公开版本：以 `npm view teochew-people-skill version` 为准

## 0.2.0 release gate

在准备 tag 或 GitHub Release 前，从干净 checkout 运行：

```bash
npm ci
npm run wiki:index:check
npm run wiki:lint
npm test
npm run readme:render:check
npm run pack:check
```

全部命令必须返回 `0`。另外检查 `git diff --check`，确认没有空白错误；若 raw 或 topic 在验证中发生变化，重新生成索引后从头执行。

这些门槛分别证明：

- `wiki:index:check`：raw／wiki 索引与当前语料一致，没有手改生成文件。
- `wiki:lint`：frontmatter、唯一 ID、source IDs、related 路径、证据门槛与 freshness 合法。
- `npm test`：行为场景、安装器、wiki 工具、索引、lint 与结构验证通过。
- `readme:render:check`：GitHub Markdown API 能把四语言 README 渲染成包含 hero、品牌、徽章、语言和 WIKI／专题／脚本入口的仓库首屏。
- `pack:check`：npm dry-run 能列出将要公开的文件。

## 审计 tarball

用机器可读输出复核精确清单：

```bash
npm pack --dry-run --json
```

必须看到：

- public `skills/teochew-people-skill/`，包括 raw、wiki、operations、维护脚本、vault templates 和 `agents/openai.yaml`；
- 根目录安装脚本、公开 docs 与 examples；
- `assets/hero-background.png`、`assets/hero.svg`、`assets/social-preview.png`、`assets/case-demo.svg`；
- README、CONTRIBUTING、LICENSE、package metadata。

必须确认不存在：

- `~/.teochew-people` 或任何复制进工作区的用户 vault；
- 任意项目 `.teochew-people` overlay；
- 私有家庭资料、profile、授权原件、私有 raw；
- `.worktrees`、`node_modules`、缓存、日志、临时文件、`.env`、token 或 OTP；
- 上一次 `npm pack` 产生的 `.tgz`。

`vault-templates/` 是无用户数据的公开模板，可以发布；实际 vault 永不发布。发现私有路径后先停止发布并修正允许清单，不要依赖发布后删除。

## 首次发布与 Trusted Publishing

若包还未建立，维护者可在本机完成首次发布：

```bash
npm login
npm whoami
npm publish --access public
```

OTP 来自 npm 账号配置的验证方式，不是 GitHub 验证码。不要把 token、恢复码、OTP 或 `.env` 写进仓库。

首次发布后，在 npm 包设置中配置 Trusted Publisher：

- Organization or user：`oOtiti`
- Repository：`teochew-people-skill`
- Workflow filename：`publish-npm.yml`
- Environment name：留空
- Allowed actions：勾选 `npm publish`

GitHub Actions 由 OIDC 临时证明发布来源，不需要长期 npm token。工作流的实际行为见 [github-workflows.md](./github-workflows.md)。

## 创建 0.2.0 Release

1. 确认 `package.json` 与 `package-lock.json` 都是 `0.2.0`。
2. 确认完整 release gate 与 tarball 人工审计通过。
3. 推送已经审查的默认分支。
4. 创建 tag `v0.2.0`（工作流也接受无 `v` 的 `0.2.0`，但项目统一优先使用 `v0.2.0`）。
5. 发布 GitHub Release，观察 `Publish npm package` workflow。

Release tag 与 `package.json` 不一致时工作流会停止。npm 的同一版本只能发布一次；若 `0.2.0` 已存在，自动流程会跳过重复 publish。

## 发布后验证

```bash
npm view teochew-people-skill@0.2.0 version
npm view teochew-people-skill@0.2.0 dist.tarball
npm pack teochew-people-skill@0.2.0 --dry-run --json
```

确认 registry 返回 `0.2.0`，tarball URL 可访问，公开包仍包含 raw／wiki／operations／scripts／docs／examples／四项视觉资产，且没有任何私有 vault 或项目 overlay。然后用临时目录做一次真实安装验证：

```bash
npx teochew-people-skill@0.2.0 --dest /path/to/temporary-skills --no-vault
```

确认安装目标只有 public skill，没有创建 `~/.teochew-people`。

## 后续版本

- 只修文字或小范围资料错误：patch。
- 增加兼容的新主题、工作流或能力：minor。
- 引入不兼容的 schema、命令或安装行为：major。

不要覆盖已经发布的版本。发现问题时修复、重新跑完整 release gate，并发布新的版本号。
