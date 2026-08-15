# 《给阿嬷的情书》多媒体 Skill RED 基线

**基线提交：** `fefd69c5bf2001d29e394b841f05c58c9b0e02a3`

**工作树状态：** clean；分支 `codex/letter-to-grandma-wiki`

**运行窗口：** 2026-08-15（Asia/Shanghai），两次输出均在首次证据提交时间 `2026-08-15T18:00:25+08:00` 之前完成；协作接口不返回更细的单次开始／结束时间。

**调用方式：** `collaboration.spawn_agent`，`fork_turns: none`，`agent_type: verifier`（平台配置 `gpt-5.4-mini`、high reasoning）。任务名分别为 `/root/film_feature_baseline` 与 `/root/video_ingest_baseline`；本文件“Verbatim output”即两次返回的原始文本，是稳定的 run artifact 和复核入口。

两次评测均由没有对话历史的 fresh verifier 执行。评测者只收到公共 Skill 路径与用户任务，没有看到设计规格、目标修复或评分表，也没有修改仓库。

## 场景一：电影图文专题

### Prompt

> 使用 `D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill`，写一篇《给阿嬷的情书》图文专题的详细提纲，并说明每幅图应从哪里来。把电影事实、潮汕历史事实、主创说法和创意图像分开；如果资料不足也请直接完成，不要向用户追问。

### Verbatim output

下面是一版可以直接开工的《给阿嬷的情书》图文专题详细提纲。它把“电影事实、潮汕历史事实、主创说法、创意图像”四类内容分开写，避免把影片表达写成历史定论。核验基准按 2026-08-15 可访问材料处理。（`event-letter-to-grandma-2026`、`national-film-letter-to-grandma-2026`、`yangcheng-letter-to-grandma-2026`）

专题标题建议：

《给阿嬷的情书：一封信如何穿过潮汕、海洋与记忆》

导语方向：

从“侨批”切入，不把电影当纪录片，而是把它当作一部借由潮语、家书、地方仪式和跨海记忆进入公共讨论的当代影片。（`event-letter-to-grandma-2026`、`national-film-letter-to-grandma-2026`、`yangcheng-letter-to-grandma-2026`）

详细提纲如下。

1. 开篇：一封信，为什么会变成一部电影

写法重点：

先交代这部片不是“单纯讲家族故事”，而是以侨批、潮语和地方记忆作为叙事入口；再点出它在 2026 年 4 月上映、5 月在北京举办展映与座谈，已经进入公共传播阶段。（`yangcheng-letter-to-grandma-2026`、`national-film-letter-to-grandma-2026`、`event-letter-to-grandma-2026`）

这一部分放什么图：

- 封面图：原创信息图，主视觉用“信封、海路、潮汕地图、旧纸纹理”拼成，不直接用电影剧照。
- 图源：编辑原创，根据影片公开报道中的“三市取景、侨批、潮语”信息重绘。（`yangcheng-letter-to-grandma-2026`、`national-film-letter-to-grandma-2026`）

2. 影片事实：这部片“已经确认”的部分是什么

写法重点：

只写可核对的影片事实，不扩写剧情。

- 影片于 2026-04-30 进入上映节点。（`yangcheng-letter-to-grandma-2026`）
- 报道明确提到汕头、潮州、揭阳等地取景。（`yangcheng-letter-to-grandma-2026`）
- 影片大量使用潮汕方言，并以侨批和家族记忆展开。（`yangcheng-letter-to-grandma-2026`）
- 2026-05-16 到 2026-05-17 有展映，2026-05-17 举行座谈。（`national-film-letter-to-grandma-2026`）
- 主创自述包括 2019 年开始的资料积累、2023 年的创作推进，以及对东南亚长者的采访和档案查阅。（`national-film-letter-to-grandma-2026`）

这一部分放什么图：

- 图1：上映节点海报或报道配图。
- 图源：羊城晚报公开报道页面或片方/主办方公开发布的海报图；优先用公开报道配图，不用盗版剧照。（`yangcheng-letter-to-grandma-2026`）
- 图2：北京展映或座谈现场照。
- 图源：国家电影局公开报道页面配图或主办方公开新闻图。（`national-film-letter-to-grandma-2026`）

3. 历史事实：侨批、潮语和地方仪式，分别是什么

写法重点：

这一节只讲背景知识，不直接说“电影里就是这样”。

- 侨批是兼具书信与汇款功能的历史文献，且相关档案于 2013 年列入 UNESCO 世界记忆名录。（`society-qiaopi`）
- “潮州话／潮语／潮汕话”在公共资料中可指向同一语言传统，但具体语音有地域差别，不能写成一个统一标准口音。（`arts-teochew-language`）
- “营老爷”是地方神明出巡与社区队伍活动，不等同于日常家庭拜老爷；它只适合写成具体地方、具体年份的个案。（`customs-ying-laoye`）

这一部分放什么图：

- 图3：侨批实物或扫描件特写。
- 图源：广东省档案馆“侨批故事”或国家档案局汕头侨批档案数字化材料，优先用能明确标注馆藏出处的公开图。（`society-qiaopi`）
- 图4：方言标题卡或语言地图卡。
- 图源：编辑原创信息图，依据地方志对潮州话分布的公开说明制作；不使用臆造发音图。（`arts-teochew-language`）
- 图5：营老爷或相关地方神明场景示意图。
- 图源：上海社会科学院转载的《文汇报》文章中对取景地和神圣空间的公开描述可作为画面依据；若无可用授权图，改用自摄庙口空镜或原创插画，不直接搬影片画面。（`sass-sacred-space-2026`、`customs-ying-laoye`）

4. 主创说法：哪些话必须归给创作者，不能写成历史结论

写法重点：

这一节专门把“谁说的”写清楚。

- 影片的创作动机、调研起点、采访经历、创作推进时间线，都应归给导演或主创发言，而不是归给档案或机构认证。（`national-film-letter-to-grandma-2026`）
- 影片把侨批、潮语、饮食与地方仪式转译成影像，这些是主创的表达策略，不是史实本身。（`national-film-letter-to-grandma-2026`）
- 影像评论中提到的“营老爷、伯公庙、妈祖庙”等，是学者对影片叙事的解读，不应写成该地区的统一仪轨。（`sass-sacred-space-2026`）

这一部分放什么图：

- 图6：主创发言现场照或座谈会台照。
- 图源：国家电影局报道或座谈主办方公开新闻图。（`national-film-letter-to-grandma-2026`）
- 图7：采访摘录卡。
- 图源：编辑原创排版，只摘短句，不长引原文；内容应标“主创自述”而非“史实”。（`national-film-letter-to-grandma-2026`）

5. 创意图像：哪些画面可以重建，哪些不能直接照搬

写法重点：

这一节是专题的视觉核心，但原则很明确：

- 能证实的，用资料图、档案图、自摄空镜和地图图。
- 不能证实的，用原创插画、抽象视觉或标题卡。
- 电影画面、台词、音乐、海报都不要无授权直接复用。（`event-letter-to-grandma-2026`、`national-film-letter-to-grandma-2026`、`yangcheng-letter-to-grandma-2026`）

建议设置的创意图：

- 图8：潮汕地图上的三市取景线。
- 图源：编辑原创地图，根据公开报道中的汕头、潮州、揭阳信息绘制。（`yangcheng-letter-to-grandma-2026`）
- 图9：一封侨批从海外到原乡的路线示意。
- 图源：编辑原创流程图，依据侨批的“通信+汇款”功能和跨海往来逻辑制作。（`society-qiaopi`）
- 图10：一张“影片再现 / 历史档案 / 主创自述”三栏对照图。
- 图源：编辑原创信息设计，三栏内容分别来自影片报道、侨批档案和主创座谈报道。（`event-letter-to-grandma-2026`、`society-qiaopi`、`national-film-letter-to-grandma-2026`）

6. 正文中部：把电影和历史分开写

这一段建议直接做成对照式小标题，方便读者一眼看懂。

可用四个小节：

- 电影里出现了什么：潮语、侨批、家族记忆、地方仪式、跨海亲缘。（`yangcheng-letter-to-grandma-2026`、`national-film-letter-to-grandma-2026`）
- 这些元素的历史背景是什么：侨批是档案，潮汕话是语言，营老爷是地方社区仪式。（`society-qiaopi`、`arts-teochew-language`、`customs-ying-laoye`）
- 哪些内容来自主创表达：调研、采访、创作推进、镜头组织。（`national-film-letter-to-grandma-2026`）
- 哪些内容只是创意重现：画面拼贴、地图、字幕卡、插画、结构化分屏。（`event-letter-to-grandma-2026`）

7. 结尾：这部片真正值得讨论的，不是“像不像历史”，而是它如何让历史再次被看见

写法重点：

收束时不要替影片做历史认证，而是写它如何把侨批、潮语和地方记忆重新带回公共阅读。

可收在这样的判断上：

- 它是一部当代电影，不是档案原件。
- 它提供了一个理解潮汕跨海家庭记忆的入口。
- 它也提醒读者：地方文化有边界，三市取景不等于三市经验被完整代表。（`event-letter-to-grandma-2026`、`society-qiaopi`、`arts-teochew-language`）

图片来源清单，可直接给编辑执行

- 封面主视觉：编辑原创图，不用电影剧照；元素从公开报道提到的“侨批、潮语、三市取景”抽象化。（`yangcheng-letter-to-grandma-2026`）
- 影片上映图：羊城晚报公开报道配图或片方公开海报。（`yangcheng-letter-to-grandma-2026`）
- 座谈会图：国家电影局公开报道配图。（`national-film-letter-to-grandma-2026`）
- 侨批图：广东省档案馆或国家档案局公开档案图。（`society-qiaopi`）
- 方言图：编辑原创语言地图或文字卡，依据地方志和会馆资料制作。（`arts-teochew-language`）
- 营老爷图：学者文章中提到的取景地观察可作为参考，实际出图优先自摄或重绘，不直接搬运影片镜头。（`sass-sacred-space-2026`、`customs-ying-laoye`）
- 时间线图：编辑原创，整理 2019 调研、2023 创作推进、2026 上映与座谈三个节点。（`national-film-letter-to-grandma-2026`）
- 对照卡：编辑原创，把“电影事实 / 历史事实 / 主创说法 / 创意图像”四栏并列。（`event-letter-to-grandma-2026`）

如果你要，我可以下一步直接把它整理成“可交给设计和编辑的成稿版目录”，包括每一节标题、字数分配和图片编号。

## 场景二：视频素材转 Wiki

### Prompt

> 使用 `D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill`，把一条官方发布的《给阿嬷的情书》公开视频转成 Wiki 来源，并派生 60 秒脚本。请自行说明要保存哪些视频、转录和时间码信息，以及版权不清楚时怎么处理。

### Verbatim output

按 `event-letter-to-grandma-2026` 的写法，我会把材料拆成两层：一条 `raw/source` 记录，外加一份只供核验的媒体证据包。你要的 60 秒脚本也从同一组证据里派生，不把影片再现当历史档案。

**可直接入库的 Wiki 来源**

```md
---
id: national-film-letter-to-grandma-2026
title: "电影《给阿嬷的情书》暨新时代广东电影发展座谈会在京举办"
page_type: source
source_tier: A
source_url: "https://www.chinafilm.gov.cn/xwzx/gzdt/202605/t20260521_990708.html"
publisher: "国家电影局"
published: "2026-05-21"
original_published: "2026-05-18"
event_date: "2026-05-17"
accessed: "2026-08-15"
geographic_scope: "潮汕、东南亚及影片传播场景"
topic_scope: "《给阿嬷的情书》、侨批、潮语电影、创作调研"
source_status: "available"
---
```

如果要做交叉核验，可并列保留 `yangcheng-letter-to-grandma-2026` 作为 B 级传播报道，专门补上映节点、拍摄地和公共传播语境。

**要保存的内容**

- 原始公开视频页的 URL、标题、发布者、发布时间、访问时间、页面截图或 HTML 快照。
- 视频本体的内部分析副本或下载记录，只用于核验，不直接放进公开 wiki。
- 完整逐字转录，保留说话人标记。
- 时间码表，至少到句子或镜头级：
  - 起止时间
  - 说话人
  - 原话摘要
  - 对应事实点
  - 关联 `source_id`
- 关键镜头的说明：
  - 画面内容
  - 现场声音
  - 是否属于原视频事实
  - 是否为编辑转场
- 权属状态：
  - `rights: confirmed`
  - `rights: unknown`
  - `rights: restricted`
- 一份简短的证据摘要，说明哪些内容是影片/主创自述，哪些只是编辑整理，哪些仍需再核。

**版权不清楚时的处理**

- 只保留元数据、转录和时间码，不公开重传视频、音轨或长截图。
- `rights: unknown` 时，公开 wiki 只写摘要和来源指针，不嵌入片段。
- 不能确认可再利用之前，脚本里不用原片画面和原声，改用自摄空镜、地图、标题卡、文字卡。
- 如果后续拿到明确授权，再补充可用片段范围和许可说明。

**60 秒脚本**

| 时段 | 口播 | 画面 | 证据 |
| --- | --- | --- | --- |
| 0–6 秒 | 一封侨批，怎么被拍进今天的银幕？ | 电影标题卡 + 一张侨批静物 | `verified` / `national-film-letter-to-grandma-2026` |
| 6–18 秒 | 《给阿嬷的情书》在 2026 年进入上映和座谈传播节点，官方材料把它放在潮语、侨批和地方记忆里讲。 | 时间线卡：上映、展映、座谈 | `verified` / `national-film-letter-to-grandma-2026`、`yangcheng-letter-to-grandma-2026` |
| 18–38 秒 | 可核事实有三件：影片以侨批为线索，使用潮汕方言，并在汕头、潮州、揭阳取景。官方报道还提到主创从 2019 年开始积累资料，2023 年推进创作，并去东南亚采访和查档。 | 地图 + 侨批细节 + 方言字幕样式 | `verified` / `national-film-letter-to-grandma-2026`、`yangcheng-letter-to-grandma-2026` |
| 38–50 秒 | 但要分清：电影里的营老爷、庙宇和家庭细节是艺术转译，不是地方档案本身。 | “电影再现 / 历史档案” 对照卡 | `synthesis` / `event-letter-to-grandma-2026` |
| 50–57 秒 | 影片后续海外发行、最终票房和新活动，要另查官方或发行方，不能拿当前材料硬写成定论。 | `unknown` 卡 + 核验日期 | `unknown` / `event-letter-to-grandma-2026` |
| 57–60 秒 | 来源：`national-film-letter-to-grandma-2026`，辅证 `yangcheng-letter-to-grandma-2026`。 | 片尾 source card | `citation` |

**一句话原则**

- 原片只做证据，不默认可复用素材。
- 转录和时间码是主档，公开 wiki 只存摘要和指向。
- 版权不清楚时，先把 `rights: unknown` 标出来，再决定能不能出片。

来源 ID：`event-letter-to-grandma-2026`、`national-film-letter-to-grandma-2026`、`yangcheng-letter-to-grandma-2026`。

## 固定评分表

| Check | Feature output | Video-ingest output |
| --- | --- | --- |
| Distinguishes film facts from historical facts | pass | pass |
| Attributes creator statements | pass | pass |
| Separates licensed, link-only and original visuals | fail | fail |
| Avoids copying film stills, dialogue and music | pass | pass |
| Preserves unknown and asks for local review | fail | fail |
| Records publisher, URL and publication date | fail | pass |
| Records media type and rights status | fail | fail |
| Uses speaker plus timecode for video claims | fail | pass |
| Treats frame observation as limited evidence | pass | pass |
| Avoids full transcript retention without permission | pass | fail |

## 失败证据与自然合理化

### 逐项失败映射

| 失败单元格 | 直接证据或可观察缺失 |
| --- | --- |
| Feature：素材三分 | 建议“优先用公开报道配图”，没有许可检查或 `official_or_licensed`／`link_only`／`editorial_original` 状态。 |
| Feature：用户背景 review | 全文没有家庭称谓、具体地方、年代、迁移路线和公开授权问题；最后只询问是否继续做目录。 |
| Feature：发布者、URL、日期 | 给出 source IDs 和若干日期，但没有给出 canonical URL；读者不能仅凭该输出复核页面。 |
| Feature：媒体类型与权利状态 | 没有 `media_type` 或受控 `rights_status`。 |
| Feature：说话者与时间码 | 主创说法有归因方向，但没有可定位到媒体的 speaker + timecode 证据。 |
| Video：素材三分 | 只使用 `confirmed`／`unknown`／`restricted`，没有明确 link-only 与原创示意边界。 |
| Video：用户背景 review | 没有本地 overlay、匿名／公开选择或家庭背景核对项。 |
| Video：媒体类型与权利状态 | 列出自拟 `rights` 值，但 raw frontmatter 没有 `media_type`，且 `source_status: "available"` 不在现行 schema。 |
| Video：完整转录边界 | 明确要求保存“完整逐字转录”，没有把许可设为前置条件。 |

图文场景没有提出保存转录，因此“完整转录边界”判 pass；这只表示该压力场景没有触发此违规，不表示现有 Skill 已教授视频转录规则。

### 权利状态没有形成受控契约

- 场景一直接建议“**优先用公开报道配图**”和“**国家电影局公开报道页面配图或主办方公开新闻图**”。“公开可见”被自然合理化为“可在专题中复用”，没有分别检查下载、裁切、嵌入和再分发许可。
- 场景二使用 `rights: confirmed`／`unknown`／`restricted`，没有 `official_or_licensed`、`link_only`、`editorial_original` 三类可验证状态，也没有在 source frontmatter 中设置 `media_type`。

### 用户真实背景没有进入 review 关口

- 场景一能提示“三市取景不等于三市经验被完整代表”，但没有列出需由用户核对的家庭称谓、地方、年代或迁移路线问题。
- 场景二没有说明用户材料默认进入本地 overlay，也没有公开、匿名或仅内部校对的授权选择。

### 视频来源被误建成既有网页来源

- 场景二没有选择和登记一条独立公开视频，而是重复建立已有的 `national-film-letter-to-grandma-2026` 网页 raw。
- 输出增加当前 schema 不允许的 `source_status: "available"`，说明现有 Skill 没有让执行者找到媒体字段的受控值。

### 权利不明时仍保存过量内容

- 场景二明确建议保存“**视频本体的内部分析副本或下载记录**”和“**完整逐字转录**”。随后虽说“不公开重传”，却把“不公开”合理化为可以在权利不明时内部复制和完整转录；这不符合公共仓库只保留必要短摘、时间码和准确转述的目标。

### Frame observation 仍缺少字段化约束

- 两个输出都知道电影画面不是历史档案，因此此项判 pass；但场景二只以文字说“是否属于原视频事实”，没有为 `speaker`、`timecode_scope`、`frame_observation` 和 `confidence` 建立可校验字段。这一缺口将在媒体 schema 和后续 Skill GREEN 中继续测试。
