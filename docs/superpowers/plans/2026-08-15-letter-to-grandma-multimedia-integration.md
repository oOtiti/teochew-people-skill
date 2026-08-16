# 《给阿嬷的情书》多媒体 Wiki 最终整合计划

> **执行方式：** 按任务顺序实施；公共 raw、topic 和生成索引串行写入。功能性契约先 RED 再 GREEN，Skill 完成后用新代理重跑压力场景。

**目标：** 将已审查的电影、侨批、潮语、海外传播和英歌来源物化为公共 raw/topic，完成一篇图文专题、两套短视频脚本、一条视频转 Wiki 演示、七个原创视觉和首页展示，并让 Skill、索引、打包与验证全部可达。

**输入：**

- `docs/superpowers/research/2026-08-15-letter-to-grandma-source-dossier.md`
- `docs/superpowers/research/2026-08-15-letter-to-grandma-review-draft.md`
- `docs/superpowers/specs/2026-08-15-letter-to-grandma-multimedia-wiki-design.md`

## Task 1：用 TDD 建立原创媒体素材清单契约

### Files

- Create: `tests/media-assets.test.mjs`
- Create: `scripts/validate-media-manifest.mjs`
- Modify: `package.json`
- Create later: `assets/media-manifest.json`

### RED

1. 新增测试，导入尚不存在的 `validateMediaManifest`。
2. 测试覆盖：合法清单、重复 ID／路径、非 `editorial_original` 权利、远程或越界路径、文件不存在、source ID 不存在、alt 或免责声明为空。
3. 运行 `node --test tests/media-assets.test.mjs`，确认以模块不存在失败。

### GREEN

1. 实现零依赖校验器；路径解析后必须留在仓库 `assets/`，SVG 不得含远程 `<image href>`。
2. CLI 默认校验 `assets/media-manifest.json`；导出函数供测试使用。
3. 在 `package.json` 增加 `media:check`，并让 `npm test` 包含它。
4. 运行目标测试和全部 unit 测试。

## Task 2：物化九条精选 raw 来源

### Files

- Create: `skills/teochew-people-skill/raw/2026-08-15/national-film-filing-letter-to-grandma-2023.md`
- Create: `skills/teochew-people-skill/raw/2026-08-15/ncac-film-copyright-warning-letter-to-grandma-2026.md`
- Create: `skills/teochew-people-skill/raw/2026-08-15/xinhua-letter-to-grandma-video-2026.md`
- Create: `skills/teochew-people-skill/raw/2026-08-15/peoples-daily-lan-hongchun-essay-2026.md`
- Create: `skills/teochew-people-skill/raw/2026-08-15/thepaper-lan-hongchun-interview-2026.md`
- Create: `skills/teochew-people-skill/raw/2026-08-15/gsc-dear-you-malaysia-2026.md`
- Create: `skills/teochew-people-skill/raw/2026-08-15/zaobao-dear-you-dialect-discussion-2026.md`
- Create: `skills/teochew-people-skill/raw/2026-08-15/zaobao-dear-you-singapore-update-2026.md`
- Create: `skills/teochew-people-skill/raw/2026-08-15/ihchina-chaoyang-yingge-2006.md`
- Modify: `skills/teochew-people-skill/raw/source-review.md`
- Generate: `skills/teochew-people-skill/raw/index.md`

### Steps

1. 按 dossier 精确创建来源卡；普通网页不虚构媒体字段。
2. Xinhua 视频使用 `media_type: video`、`rights_status: link_only`、`media_duration: 00:09:49`、`transcript_status: verified_excerpt`、`timecode_scope: 00:03:55-00:09:45`。
3. 每卡明确“可直接支持”“制作可用细节”“限制与偏差”；电影历史、导演自述、媒体画面和版权边界不可互换。
4. 向追加式 `source-review.md` 增加本轮 Admit／Reject／defer 与新统计，不改写旧记录。
5. 运行 `npm run wiki:index`、`npm run wiki:lint`、`npm run wiki:index:check`。

## Task 3：补充电影、英歌和视频生产主题

### Files

- Modify: `skills/teochew-people-skill/wiki/current-events/给阿嬷的情书-2026.md`
- Modify: `skills/teochew-people-skill/wiki/arts-language/英歌.md`
- Modify: `skills/teochew-people-skill/wiki/arts-language/潮汕话.md`
- Modify: `skills/teochew-people-skill/wiki/society-diaspora/侨批.md`
- Modify: `skills/teochew-people-skill/wiki/society-diaspora/侨乡.md`
- Modify: `skills/teochew-people-skill/wiki/places/海外潮人社群.md`
- Create: `skills/teochew-people-skill/wiki/guides/视频素材转Wiki.md`
- Modify: `skills/teochew-people-skill/wiki/guides/场景细节索引.md`
- Modify: `skills/teochew-people-skill/wiki/guides/短视频口播与分镜.md`
- Generate: all Wiki indexes

### Steps

1. 将电影页从 4—5 月 closed 事件扩展为 4—7 月 closed 传播时间线；`last_checked` 保留 2026-08-15，后续状态保持 unknown。
2. 增加备案、版权预警、创作过程、马来西亚放映、新加坡原音／配音讨论和截至 7 月 3 日的加场快照。
3. 为侨批、潮语、侨乡和海外社群增加窄桥接，不以电影改写稳定定义。
4. 为英歌增加中国非遗网正式项目来源，明确潮阳、潮南、普宁等项目不能互换；原创图只使用跨来源共有的木槌、群体队形、锣鼓与力量感。
5. 新指南完整描述“登记—权利—必要转录—说话者／画面观察—claim—raw—topic—派生内容”，含 Xinhua 实例。
6. 更新索引后跑 lint/status，要求 0 stale、0 orphan。

## Task 4：生成并审计七个原创视觉

### Files

- Create: `assets/letter-to-grandma-hero.png`
- Create: `assets/yingge-epic.png`
- Create: `assets/letter-to-grandma-timeline.svg`
- Create: `assets/letter-to-grandma-map.svg`
- Create: `assets/qiaopi-object-flow.svg`
- Create: `assets/evidence-layers.svg`
- Create: `assets/video-to-wiki-flow.svg`
- Create: `assets/media-manifest.json`

### Steps

1. 使用图像生成工具创作专题头图：夜海、两岸灯火、无可读文字的信纸和家庭记忆意象；无演员肖像、无电影海报构图。
2. 使用图像生成工具创作英歌史诗横图：一至三名主体突出，后方队列和山海／街巷纵深，木槌、脸谱、锣鼓气势；不含文字、队标、真实人物或具体活动身份；深海青、矿物朱红、灯火金、盐白；16:9 且中心安全裁切。
3. 用 SVG 创建时间线、地图、侨批对象流、证据分层和视频入库流程；不使用外部字体或远程图像。
4. `media-manifest.json` 为七项记录创建者、方法、来源 IDs、尺寸、alt、免责声明、权利和用途。
5. 运行 `npm run media:check`；使用本地图片查看与实际 README 渲染检查主体、裁切和文字可读性。

## Task 5：完成公开专题、视频脚本和入库演示

### Files

- Create: `examples/letter-to-grandma-feature.md`
- Create: `examples/letter-to-grandma-video-scripts.md`
- Create: `examples/video-to-wiki-demo.md`

### Steps

1. 专题采用六个既定 H2，正文约 3000—5000 字；嵌入七个视觉单元中的六项，英歌图作为首页效果展示并在文末指向相关主题。
2. 每一稳定事实就近标 source ID；文末列 source 表、rights 表与 unknown 清单。
3. 60 秒脚本使用六段固定时间，3 分钟脚本使用九段；逐镜列 narration、shot、sound、source_id、evidence、rights、safety／local_check。
4. 视频转 Wiki 演示完整展示 Xinhua URL、09:49、四段时间码、speaker／frame observation、claim 限制、raw 字段和派生镜头。
5. 不复制影片台词、镜头、海报、音乐或完整转录；所有电影素材保持链接状态。

## Task 6：升级 Skill 和操作路由，并重跑压力测试

### Files

- Modify: `skills/teochew-people-skill/SKILL.md`
- Modify: `skills/teochew-people-skill/operations/ingest.md`
- Modify: `skills/teochew-people-skill/operations/query.md`
- Create: `skills/teochew-people-skill/operations/media-ingest.md`
- Modify: `skills/teochew-people-skill/wiki-schema.md` only if final examples reveal a missing documented field
- Modify: `scripts/validate-skill.ps1`
- Create: `docs/superpowers/evidence/2026-08-15-letter-to-grandma-skill-after.md`

### RED / GREEN

1. 先修改 validator，要求 `media-ingest.md`、三份新 examples、manifest 和两个主视觉；运行 `npm run validate` 取得 RED。
2. 增加 Skill 的图文专题与视频入口：媒体来源先登记权利；只保留必要时间码转述；用户背景默认 local overlay；生成图须标原创编辑视觉。
3. `media-ingest.md` 给出字段、步骤、禁止项和 Xinhua 最小范例；ingest/query 只做路由，不复制整份说明。
4. 运行 `npm run validate` 取得 GREEN。
5. 用两个全新代理分别执行电影专题与视频入库场景；要求其不知道 baseline 答案，只使用最终 Skill。将完整输出、十项评分和与 baseline 的差异保存到 after evidence。
6. 若仍出现“公开即可复用”“完整逐字转录”“视频本体内部副本”“未归因画面外推”等行为，先修 Skill 再重测。

## Task 7：首页与发布包集成

### Files

- Modify: `README.md`
- Modify: `package.json`
- Modify: `scripts/validate-skill.ps1`

### Steps

1. 保留顶部 `assets/social-preview.png` 和唯一品牌大字 `TEOCHEW PEOPLE`。
2. 在既有十个 H2 内增加电影专题卡：原创预览图、文章、两套脚本和视频入库演示链接。
3. 增加完整宽度英歌史诗图与图注“原创编辑视觉／非具体演出现场”，作为项目效果展示；说明它体现的是一种英歌表演表达，不代表全部潮汕人或单一队伍。
4. 在产品价值说明中清楚表达：高质量输入通过来源审查、时间码和权利状态，帮助写作与视频生产得到更细、可审校的输出。
5. 将七个资产和 manifest 列入 npm `files`；examples 已由目录打包。
6. Validator 固定首页新入口、图片、alt、examples 和操作文档，但不改变既有十个 H2 契约。

## Task 8：视觉、链接、证据和发布验证

### Commands

```powershell
npm run wiki:index
npm run wiki:index:check
npm run wiki:lint
npm run media:check
npm test
npm run pack:check
git diff --check
```

### 审计

1. Wiki status 必须 54 sources、50 pages、9 categories、0 stale、0 orphan（新增 9 raw、1 guide；若实际索引计算不同，以“基线 +9/+1”解释并查明）。
2. 检查所有 topic `source_ids` 存在；专题事实至少能回到一个 raw；新 raw 全部在 source-review 有决定。
3. `npm pack --dry-run` 必须含 7 个本地视觉、manifest、3 份 examples、media operation 和新 guide；不得含研究临时帧、MP4、完整转录或 `docs/superpowers/`。
4. 用 Playwright 在 README 本地渲染页检查桌面 1440×900、移动 390×844：英雄图不变、第二图主体完整、专题图片不溢出、链接可点击。
5. 查看专题头图和英歌图原图；检查英歌中心 4:5／1:1 安全区、无可识别商标／真实队伍／文本伪影。
6. 运行 Markdown 链接检查；外部 `link_only` 只作为普通链接，不作为远程图片。
7. 请求一次最终代码／内容 review，修复重要问题后重新跑整套验证。

## 完成标准

- 9 条新 raw、1 个视频入库 guide 和所有桥接 topic 已生成索引且无孤儿。
- 3000—5000 字专题、60 秒／3 分钟脚本和 Xinhua 视频转 Wiki 演示均进入公开 examples。
- 首页保留原英雄图，并新增电影专题入口与史诗英歌展示图。
- 7 项本地视觉全部 `editorial_original` 且有 manifest、alt、免责声明和 source IDs。
- Skill 新压力测试明显修复 baseline 的权利、时间码、用户背景和媒体字段缺口。
- 完整验证与 pack 审计通过，仓库不包含未经许可的电影或新闻媒体副本。
