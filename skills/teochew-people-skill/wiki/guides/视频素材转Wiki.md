---
id: guide-video-to-wiki
title: "视频素材转 Wiki"
aliases: ["视频入库", "video ingest", "timecoded evidence", "视频转知识"]
page_type: topic
category: guides
evidence_state: synthesis
summary: "把公开视频拆成发布者、权利、时间码、说话者、画面观察和可复核 claim，再进入 raw、topic 与脚本。"
source_ids: ["xinhua-letter-to-grandma-video-2026", "ncac-film-copyright-warning-letter-to-grandma-2026", "gd-dfz-teochew-language-2020", "gd-archives-qiaopi-story"]
related: ["wiki/guides/短视频口播与分镜.md", "wiki/guides/场景细节索引.md", "wiki/guides/事实与来源口径.md", "wiki/guides/审校清单.md", "wiki/current-events/给阿嬷的情书-2026.md"]
claim_roles: ["visual_detail", "sound_detail", "action_sequence", "object_detail", "lived_experience"]
production_facets: ["writing", "editing", "video", "audio", "education", "exhibition", "social"]
freshness: enduring
reviewed: "2026-08-15"
---

# 视频素材转 Wiki

## 一句话定义

视频入库不是保存视频或整份逐字稿，而是把原发布者、URL、日期、媒体权利、时长、必要时间码、说话者、字幕、旁白和画面观察拆开，形成可复核 raw，再由多个来源支持稳定 topic。

## 已确认事实

- 媒体 raw 使用受控字段：`media_type`、`rights_status`、`media_duration`、`transcript_status`、`timecode_scope`；完整字段见 [wiki-schema.md](../../wiki-schema.md)。
- 新华社《给阿嬷的情书》导演专访为 `00:09:49`，本库只人工核验 `00:03:55–00:09:45` 内的必要片段，权利状态是 `link_only`。（`xinhua-letter-to-grandma-video-2026`）
- 国家版权预警页面明确影片未经许可不得网络提供或上传；“公开可看”不是复制进仓库的许可。（`ncac-film-copyright-warning-letter-to-grandma-2026`）

## 地方、家庭和年代差异

视频里的口音、称谓、家庭动作和器物只属于该说话者、场景与时间。潮语存在地域差别（`gd-dfz-teochew-language-2020`）；一段电影、活动或采访不能被外推为全潮汕统一实践。用户家庭视频默认进入 local overlay，未经授权不进入公共 raw。

## 与相近概念区别

发布者负责页面发布，拍摄者负责影像采集，说话者负责具体陈述，字幕／旁白可能由编辑团队制作；四者不能自动视为同一人。`speaker_claim` 是有归属说法，`frame_observation` 只是画面在时间码中呈现了什么，`editorial_structure` 则是本项目的剪辑或图解安排。

## 历史与当代变化

视频平台、版权状态、可回放地区和页面 URL 会变化。来源删除或受限后，raw 保留最后核验日与状态，相关 claim 降级为不可实时复核；历史结论仍需档案、名录或研究独立支持。侨批馆藏页能支持档案对象与递送网络，电影画面不能替代它。（`gd-archives-qiaopi-story`）

## 适合如何表达

使用以下串行链路：

```text
候选视频
  → 原发布者、URL、日期和权利登记
  → 浏览器读取时长与可回放状态
  → 只转录任务所需范围并人工回听
  → 分开 speaker / narration / subtitle / frame observation
  → claim + timecode + confidence + limitation
  → raw 来源卡
  → 与独立来源交叉后更新 topic
  → 派生文章、口播与分镜
```

每条 claim 至少记录：`timecode`、`responsible_party`、`claim_type`、准确转述、可支持范围、不可支持范围、人工核验者与日期。

## 不应如何概括

不默认下载权利不明视频，不把完整自动转录保存到公共仓库，不用无时间码画面支撑历史结论，不因人物出现在画面里就推断姓名、身份或地域，不把字幕当说话者原话，不以片方自述证明影片历史真实。

## 尚不清楚／实时核验

自动转录无法可靠判断的潮语、人名、地名、机构和专有词保持 `unknown`；发布者没有说明的拍摄日期、地点、人物和镜头来源不猜。需要当前状态时重新打开页面、读取时长并检查权利说明。

## 写作视频场景细节

**来源内细节**：新华社示例中，`00:06:40–00:08:05` 可记录导演对剧本翻译和发音标记的自述；它只支持该片跨语言表演准备的一种方法。（`xinhua-letter-to-grandma-video-2026`）

**创意结构／重现建议**：用“视频页面—时间码—说话者—claim—raw—topic”原创流程图展示方法；不嵌入原视频截图。派生镜头若没有来源事实，只标 `editorial_structure`，不配历史断言。

## 生产使用边界

`official_or_licensed` 必须有明确可随仓库分发的授权；`link_only` 只保存 URL、必要摘要和证据定位；`editorial_original` 必须标非历史照片／非现场。完整转录只有许可明确允许时才保存；新闻、电影和表演音轨不因公开播放而可自由提取。

## 相关页面与来源

- 方法：[短视频口播与分镜](./短视频口播与分镜.md)、[场景细节索引](./场景细节索引.md)、[事实与来源口径](./事实与来源口径.md)、[审校清单](./审校清单.md)。
- 案例：[《给阿嬷的情书》2026传播节点](../current-events/给阿嬷的情书-2026.md)。
- 核心 raw：`xinhua-letter-to-grandma-video-2026`、`ncac-film-copyright-warning-letter-to-grandma-2026`、`gd-dfz-teochew-language-2020`、`gd-archives-qiaopi-story`。
