# 潮汕人 Skill

`chaoshan-ren` 是一个面向中文写作与审校的 Codex skill，用于围绕粤东潮汕文化圈整理和表达潮汕风俗、礼仪、节庆、饮食、语言、戏曲、英歌、侨乡记忆和公共文化说明。

这里的“潮汕”按更宽的粤东大潮汕文化圈理解，重点覆盖汕头、潮州、揭阳及海内外潮人社群。潮州是重要组成部分，但不是全部潮汕。

## 这个仓库是什么

这个仓库参考公开 skill 仓库的组织方式：根目录负责展示和验证，`skills/` 目录放可安装 skill，每个 skill 自己包含 `SKILL.md`、展示信息和按需读取的参考资料。

## 目录结构

```text
.
├── README.md
├── skills/
│   ├── README.md
│   └── chaoshan-ren/
│       ├── SKILL.md
│       ├── agents/
│       │   └── openai.yaml
│       └── references/
│           ├── 00-使用索引.md
│           ├── 01-范围与称谓.md
│           ├── 02-风俗礼仪.md
│           ├── 03-节庆岁时.md
│           ├── 04-饮食与工夫茶.md
│           ├── 05-语言戏曲英歌工艺.md
│           ├── 06-侨乡与社会组织.md
│           ├── 07-写作模板与审校清单.md
│           ├── 08-常用词库.md
│           ├── 09-任务示例.md
│           └── 90-资料来源.md
├── scripts/
│   └── validate-skill.ps1
└── .githooks/
    └── pre-commit
```

## Skill 内容

- `skills/chaoshan-ren/SKILL.md`：入口文件，只放触发说明、使用边界、流程和资料导航。
- `references/00-使用索引.md`：告诉 Codex 不同任务应该读哪些资料。
- `references/01-06`：按主题拆分的潮汕文化资料，避免一次加载太多内容。
- `references/07-写作模板与审校清单.md`：文案模板、脚本骨架、审校清单和避坑改写。
- `references/08-常用词库.md`：常用文化词、地名、食物、礼俗、表演和慎用表达。
- `references/09-任务示例.md`：不同用户请求的处理方式和输出形态。
- `references/90-资料来源.md`：资料来源、外部链接和参考过的 skill 仓库。

## 本地验证

克隆后启用仓库内 hook：

```powershell
git config core.hooksPath .githooks
```

手动运行验证：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/validate-skill.ps1
```

提交时 `.githooks/pre-commit` 会自动运行同一个验证脚本。

## 参考的公开 skill 仓库

- [Anthropic Skills](https://github.com/anthropics/skills)：参考其 skill 自包含和 supporting files 按需加载的组织方式。
- [Claude Code Skills 文档](https://docs.claude.com/en/docs/claude-code/skills)：参考其对 `SKILL.md`、metadata 和附加资源的说明。
- [mattpocock/skills](https://github.com/mattpocock/skills)：参考其公开 skill 仓库的 README 展示方式。
- [secondsky/claude-skills](https://github.com/secondsky/claude-skills)：参考其 `skills/` 目录、脚本和验证说明的组织方式。

## 发布说明

仓库可以作为公开 GitHub 项目发布。当前还没有选择开源许可证；如果希望别人明确知道能否复用、修改或分发，请在发布前补充 `LICENSE`。
