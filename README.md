<p align="center">
  <img src="assets/social-preview.png" alt="TEOCHEW PEOPLE：潮汕文化 LLM Wiki" width="100%">
</p>

<h1 align="center">TEOCHEW PEOPLE</h1>

<p align="center">
  <strong>自进化、个性化的潮汕文化 Skill 与 LLM Wiki</strong><br>
  精挑细选来源，建设可追溯主题，为文章、口播和视频生产准备真正可用的文化细节。
</p>

<p align="center">
  <a href="https://github.com/oOtiti/teochew-people-skill/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/oOtiti/teochew-people-skill/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/teochew-people-skill"><img alt="npm" src="https://img.shields.io/npm/v/teochew-people-skill?logo=npm&label=npm"></a>
  <img alt="Node.js >=18" src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=nodedotjs&logoColor=white">
  <a href="LICENSE"><img alt="License MIT" src="https://img.shields.io/badge/License-MIT-f0a000.svg"></a>
  <img alt="Wiki 55 sources" src="https://img.shields.io/badge/Wiki-55_sources-136f63">
  <img alt="Topics 50" src="https://img.shields.io/badge/Topics-50-8f2d1e">
  <img alt="Categories 9" src="https://img.shields.io/badge/Categories-9-c79434">
  <img alt="Languages 4" src="https://img.shields.io/badge/Languages-4-3949ab">
</p>

<p align="center">
  <strong>简体中文</strong> · <a href="README.zh-Hant.md">繁體中文</a> · <a href="README.en.md">English</a> · <a href="README.ja.md">日本語</a>
</p>

<p align="center">
  <a href="skills/teochew-people-skill/wiki/index.md"><strong>进入公共 WIKI</strong></a> ·
  <a href="examples/letter-to-grandma-feature.md">阅读图文专题</a> ·
  <a href="examples/letter-to-grandma-video-scripts.md">查看视频脚本</a> ·
  <a href="#快速安装">快速安装</a>
</p>

## 这是一套什么样的 WIKI

TEOCHEW PEOPLE 用 55 条可追溯 raw 来源、50 张主题页和 9 个分类索引构成公共知识底座。经审核的新资料让 Wiki 持续演进；经你明确同意的受众、家庭讲法和表达偏好让输出越来越贴合。它会越用越好用，但不会把一次回答或私人经验自动写成公共真理。

| 组成 | 它解决什么 | 如何越用越好用 |
| --- | --- | --- |
| **公共 Wiki** | 55 条 raw 来源与 50 张 topic 把事实、地点、年代、差异和未知组织成可检索知识 | 新来源先审身份与直接性，再进入 raw 和 topic；错误有日志、有版本、可回退 |
| **自进化** | `research → ingest → evolve → lint` 把热点核验、来源准入和结构检查连成维护链 | 只沉淀经确认、可长期复用的变化；不是从每次对话自动学习，更不是自动掌握真相 |
| **个性化** | 项目和用户 local vault 保存受众、选例、家庭讲法与表达偏好 | 只有明确同意才写入；本地层可以调整表达，但不能静默覆盖公共事实 |
| **内容生产** | topic 同时准备文字、画面、声音、动作、器物、空间和时间码 | 一套证据链派生文章、口播、分镜和审校，输入越精细，输出越可拍、可改、可追溯 |

查询从 [`wiki/index.md`](skills/teochew-people-skill/wiki/index.md) 开始；需要核对时沿 `source_ids` 回到 [`raw/index.md`](skills/teochew-people-skill/raw/index.md)。这是一套会成长的知识工作流，而不是把所有文件一次塞给模型。

![潮汕人风采：原创英歌舞史诗视觉，长袖彩衣的领舞者与队列在晨光古镇街巷中击打双短槌](assets/yingge-epic.png)

<p align="center"><sub>潮汕人风采｜原创编辑视觉，非具体演出现场；服饰、脸谱与动作不对应单一队伍或固定仪式。</sub></p>

### 为什么它不是普通资料合集

普通资料夹解决“文件放在哪里”，却很少回答“这句话能写多远”。本项目把知识分成互相可追踪的两层：

- `raw/` 保存来源身份、A／B／C 层级、适用地域、可支持论断、制作细节与限制；未准入来源留在追加式 `source-review.md` 的 Reject／defer 记录中，不进入证据链。
- `wiki/` 用主题页和分类索引组织定义、已确认事实、地方差异、相近概念、当代变化、未知边界与生产细节。topic 的 `source_ids` 可以反向定位 raw，而不是只给一个模糊“参考资料”列表。

因此，[拜老爷](skills/teochew-people-skill/wiki/customs/拜老爷.md)与[营老爷](skills/teochew-people-skill/wiki/customs/营老爷.md)会分成两个主题；[潮州古城申遗状态](skills/teochew-people-skill/wiki/current-events/潮州古城申遗边界-2026.md)会保留核验日，不把“推进申报”写成“已经入选”。

## 它如何持续成长

六个操作入口构成一条可重复审计的维护链：

| 操作 | 什么时候使用 | 产出或边界 |
| --- | --- | --- |
| [ingest](skills/teochew-people-skill/operations/ingest.md) | 找到候选资料时 | 先判来源与独立性；录用才建 raw，拒绝也留理由 |
| [media ingest](skills/teochew-people-skill/operations/media-ingest.md) | 输入视频、音频、图片或家庭素材时 | 先判权利，再取必要时间码；分开说话者、旁白、字幕与画面观察 |
| [query](skills/teochew-people-skill/operations/query.md) | 回答、写作、审校或制作时 | 从索引开始，首轮最多读 3 个 topic，再沿 source IDs 核对 |
| [research](skills/teochew-people-skill/operations/research.md) | 资料陈旧、冲突、空缺或涉及当前状态时 | 先选来源再成文；当前事实实时核验 |
| [evolve](skills/teochew-people-skill/operations/evolve.md) | 发现可长期复用且证据充分的变化时 | 公共事实、本地知识与项目覆盖分层写入；一次性回答不沉淀 |
| [lint](skills/teochew-people-skill/operations/lint.md) | 公共语料变化或发布前 | 检查字段、证据门槛、断链、新鲜度和确定性索引 |

这些动作不会宣称系统“自动掌握真相”。来源分级、文化论断、地方边界和冲突处理仍需可复查的人类判断；索引生成和结构检查才交给确定性工具。

## 为写作和视频生产准备的知识

主题页不仅保存“是什么”，也用 `claim_roles` 标记定义、历史、地理范围、画面、声音、动作顺序、器物与生活经验。内容制作者可以从[场景细节索引](skills/teochew-people-skill/wiki/guides/场景细节索引.md)选材，再按[写作生产](skills/teochew-people-skill/wiki/guides/写作生产.md)和[短视频口播与分镜](skills/teochew-people-skill/wiki/guides/短视频口播与分镜.md)把“口播事实—来源—镜头依据”对齐。

### 效果展示：《给阿嬷的情书》

![原创编辑插画：两代人的手围着空白信纸，窗外夜海连接潮汕屋脊与东南亚岸灯](assets/letter-to-grandma-hero.png)

<p align="center"><sub>原创编辑插画｜非历史照片、非电影剧照、非真实侨批复制件。</sub></p>

这套演示不复制电影剧照、片段、台词或音乐，而是把电影备案与传播、主创自述、侨批档案、潮语地方差异和马新放映节点拆成可追踪证据，再用原创视觉完成文章与短视频表达。它展示了这个项目最重要的利益：精挑细选输入，让一篇长文、两种时长脚本和后续审校共享同一条证据链。

| 成品 | 你会看到什么 |
| --- | --- |
| [图文专题《一封信，穿过海》](examples/letter-to-grandma-feature.md) | 约 4,100 个汉字、6 个视觉单元；区分影片表达、历史档案、主创归因、编辑综合与未知 |
| [60 秒与约 3 分钟视频脚本](examples/letter-to-grandma-video-scripts.md) | 完整口播、时间码、镜头、声音、来源、权利状态和当地核验项 |
| [新华社视频转 Wiki 演示](examples/video-to-wiki-demo.md) | 从来源登记到必要时间码、raw、topic、文章句子和镜头的完整链路；不保存 MP4 或完整逐字稿 |

本地 7 个视觉资产都在 [`assets/media-manifest.json`](assets/media-manifest.json) 登记为 `editorial_original`；外部电影、新闻、档案图片与公开视频保持 `link_only`。处理自己的家庭照片、旧信或录音时，默认只进入本地覆盖层，逐项得到发布授权后才公开。

示范文章从一张供桌写到一条街巷，但同时守住地方边界：

> 学者陈平原在 2025 年对潮州青龙庙会的一次观察中，记录队伍穿街约四小时，锣鼓与人声交叠，参与者喊出“兴啊”。这些动作和声音很具体，但它们只属于这次具名观察。

阅读全文与证据表：[《从一张供桌到一条街巷》](examples/showcase-article.md)。

同一证据链还派生出可拍的 60 秒脚本：

> 00:37–00:50：具体到神明称谓，也不能见名就下结论。2024 年走访的潮州、汕头 17 处伯公场所里，同一称谓可有不同辨识，也有标识不明。

分镜同时标出 `source_detail`、创意转场、人物／庙宇授权和现场确认项。查看完整口播与时间码：[《60 秒视频：一张供桌，不等于一支巡行队伍》](examples/showcase-video.md)。

## 知识如何保持全面和客观

- 范围以汕头、潮州、揭阳为核心，继续下钻县区、村社、家庭、年代与海外潮人社群；不把潮州市等同全部潮汕。
- 稳定核心事实至少由一个直接 A 来源，或两个独立且直接的 B 来源支持。百科与搜索摘要只用于找线索，不自动成为核心证据。
- `verified`、`synthesis`、`varies`、`unknown` 分开表达。来源越具体，论断范围也越具体；制作细节丰富不能补偿弱证据。
- 当前官方状态、日程与在任人物实时核验；开放事件页按新鲜度复查。申请不等于入选，规划不等于完成。
- 只摘要必要事实，不复制长篇文章、图片、电影、唱词或音频。家庭、未成年人、宗教参与者、庙宇与现场素材先处理版权、隐私、肖像和安全。
- 可以解释信俗及其社会文化语境，但不输出统一神明表、供品表、咒语、禁忌、择日或可执行仪轨。

完整规则见[公共 wiki 的目的与边界](skills/teochew-people-skill/wiki-purpose.md)、[Wiki schema 与证据规则](skills/teochew-people-skill/wiki-schema.md)和[事实与来源口径](skills/teochew-people-skill/wiki/guides/事实与来源口径.md)。

## 个性化如何工作

知识按 `<project>/.teochew-people` → `~/.teochew-people` → bundled public wiki 的顺序解析：

- 项目层保存当前项目的受众、选例与表达约束。
- 用户层保存经明确同意的写作偏好、家庭讲法与授权本地材料。
- 公共层提供可发布、可追溯的共同事实底座。

本地层可以要求“优先揭阳案例”或“采用本家称谓”，但不能静默覆盖公共事实。发生冲突时并列来源、标明层级并请求确认。安装默认只部署公共 skill；只有用户明确同意后才初始化 vault。私有 vault、项目 overlay 与临时材料永不进入 npm 包。

## 快速安装

发布状态以 `npm view teochew-people-skill version` 为准；当 registry 返回 `0.2.0` 时，下列 npm 命令才对应本页介绍的 LLM Wiki 版本。如 registry 仍是旧版，请先使用本节末尾的 GitHub 源安装命令。

Codex：

```bash
npx teochew-people-skill --codex --no-vault
```

Claude Code：

```bash
npx teochew-people-skill --claude --no-vault
```

自定义 skills 父目录：

```bash
npx teochew-people-skill --dest /path/to/skills --no-vault
```

明确同意建立个性化层后，再单独使用：

```bash
npx teochew-people-skill --codex --init-vault
npx teochew-people-skill --codex --init-project /path/to/project
```

已存在的 public skill 不会被静默覆盖；确认重装时加 `--force`。安装器保留已经修改的 vault 文件，不会把私有目录删除后重建。GitHub 源也可直接安装：`npx github:oOtiti/teochew-people-skill --codex --no-vault`。

## 使用示例

概念辨析与内容生产：

```text
使用 $teochew-people-skill，解释拜老爷和营老爷的区别，并写成 60 秒口播。每个事实给 topic/raw ID，地方个案不要外推，镜头标 source_detail 或 editorial_structure。
```

当前事实核验：

```text
使用 $teochew-people-skill，核验“潮州古城申遗成功了吗”。先读事件页，再实时打开地方、国家与 UNESCO 官方页面；输出核验日、能证明与不能证明的内容。
```

本地个性化：

```text
使用 $teochew-people-skill，为揭阳家庭受众写一篇工夫茶文章。公共事实沿 topic/raw 核对；按我的本地 vault 调整选例和语气，但本家做法单独标注，不写回公共 wiki。
```

更多修订示例见 [Before / After](examples/before-after.md)。

## 知识结构

```text
skills/teochew-people-skill/
├── SKILL.md                 # 薄路由器：触发、边界与按需读取
├── agents/openai.yaml       # UI 元数据
├── raw/
│   ├── 2026-08-15/         # 已准入来源卡
│   ├── index.md            # 确定性生成的来源索引
│   └── source-review.md    # Admit、Reject、defer 追加式账本
├── wiki/
│   ├── index.md            # 公共主题总索引
│   ├── concepts/ customs/ food/ arts-language/
│   ├── places/ society-diaspora/ people-organizations/
│   ├── current-events/     # 带日期和状态的事件页
│   └── guides/             # 写作、分镜、事实与审校指南
├── operations/             # ingest/media-ingest/query/research/evolve/lint
├── scripts/                # 索引、lint、状态与 vault 工具
├── assets/vault-template/  # 私有层模板，不含用户数据
├── wiki-purpose.md
├── wiki-schema.md
└── wiki-log.md
```

从[公共 wiki 索引](skills/teochew-people-skill/wiki/index.md)开始查询；需要审查证据时再进入[原始资料索引](skills/teochew-people-skill/raw/index.md)。

## 贡献资料与主题页

贡献采用 source-first 顺序：先把候选来源及录用／拒绝理由追加到 `raw/source-review.md`，录用后建立 raw 来源卡，最后才更新 topic。Issue [#1](https://github.com/oOtiti/teochew-people-skill/issues/1) 是完整范例：Issue 本身只证明内容需求，因此作为文化事实来源被 Reject；后续用期刊、国家非遗、具名报道与地方研究建立证据链，再补齐拜老爷、营老爷与地方神明主题页。

请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。新增或改写内容要保留 evidence state、地方／家庭／年代差异、热点日期、版权与隐私边界；完成后重建索引并运行 lint 与测试。

## 验证、版本与许可证

当前特性版本为 `0.2.0`。本地发布门槛：

```bash
npm run wiki:index:check
npm run wiki:lint
npm run media:check
npm test
npm run readme:render:check
npm run pack:check
```

`npm run pack:check` 应包含 `package.json` 明确声明的 public skill、raw、wiki、operations、维护脚本、docs、examples 与公开预览素材；不得包含用户 `~/.teochew-people`、项目 `.teochew-people`、私有资料或临时文件。工作流见 [GitHub Workflows](docs/github-workflows.md)，维护者发布步骤见 [npm 发布指南](docs/publishing.md)。

代码与内容按 [MIT License](LICENSE) 发布；外部来源、图片、影片、音乐及现场素材仍各自受原权利与许可约束。
