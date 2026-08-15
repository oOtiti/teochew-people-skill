# Media Ingest：把视频、音频与图片转为可追踪证据

## 触发条件

当输入包含视频、音频、图片、直播回放、采访片段、字幕或用户家庭素材，并准备把其中必要信息用于 raw、topic、文章或分镜时使用。普通网页仍走 [ingest.md](./ingest.md)。

## 核心边界

公开可访问不等于可再利用、可复制或可下载。先确定权利，再决定处理方式：`official_or_licensed` 只用于权利明确且许可覆盖当前用途的媒体；`link_only` 只保存来源页、媒体 URL、必要元数据与准确转述；`editorial_original` 只用于项目自己制作且在 `assets/media-manifest.json` 登记的视觉。没有明确许可时按 `link_only` 处理。

不得下载、截帧、抽取音轨或再发布 `link_only` 媒体；不得制作无授权的完整逐字稿或完整转录。任务只需要一个片段时，只核验该片段。新闻页面、公开视频和社交平台可播放状态都不自动授予再分发许可。

用户背景、家庭材料与当地人提供的照片、录音、视频默认进入 local overlay（本地覆盖层），并逐项记录公开、匿名、内部校对或不留存的授权选择；没有明确发布授权，不进入公共 raw 或公共资产目录。

## 输入

- 原始页面 URL、原发布者、发布日、访问日和媒体类型；
- 媒体总时长或图片尺寸，以及任务真正需要核验的范围；
- 候选论断、说话者身份、字幕或旁白责任方；
- 权利声明、许可范围、是否允许下载／截帧／转录／再发布；
- 地域、年代、语言、场景与是否为用户私有材料。

## 串行步骤

1. **登记来源。** 先记录 canonical 页面、发布主体、媒体地址、日期和访问方式，不先下载。
2. **判定权利。** 选择 `official_or_licensed`、`link_only` 或 `editorial_original`；权限未知时收缩为 `link_only`。
3. **限定范围。** 记录 `media_duration` 和必要的 `timecode_scope`。图片只登记 `media_type: image`，不伪造时长字段。
4. **拆分责任。** 把 `speaker_claim`（说话者陈述）、`narration`（旁白）、`subtitle`（字幕）与 `frame_observation`（画面观察）分开；发布者、拍摄者、说话者和字幕编辑不能默认是同一人。
5. **建立时间码。** 每条必要 claim 记录 `HH:MM:SS-HH:MM:SS`、责任主体、准确转述、能支持什么、不能支持什么、核验日期与置信边界。自动转录中的潮语、人名、地名未人工回听时保持 `unknown`。
6. **交叉核验。** 作品片段只证明作品如何表达；主创自述只证明主创如何说明创作；历史、语言、地域和普遍性判断必须回到独立来源。
7. **写入 raw。** 使用 `wiki-schema.md` 的媒体字段，把 `transcript_status` 标成 `verified_excerpt`、`partial` 或 `unavailable`；正文只保存必要的短转述，不保存整段字幕。
8. **进入 topic。** 只迁移已限定的事实、说话者陈述和生产细节；保留 `source_ids`、时间码、权利状态、`varies` 与 `unknown`。
9. **派生内容。** 文章和脚本使用“事实／归因／画面观察／编辑综合”不同语气；镜头优先使用已登记的原创视觉、获许可素材或明确的重现方案。
10. **验证。** 串行运行索引、wiki lint 与媒体清单校验；公共更新追加 `wiki-log.md`。

## 最小 claim 记录

```yaml
timecode: "00:06:40-00:08:05"
responsible_party: "蓝鸿春（视频中的受访者）"
claim_type: speaker_claim
paraphrase: "主创谈到泰文翻译、发音标记与语言细节准备。"
supports: "该片跨语言表演准备的一种方法"
does_not_support: "演员母语身份或全潮汕统一发音"
verified_at: 2026-08-15
```

这个示例只转述 [`xinhua-letter-to-grandma-video-2026`](../raw/2026-08-15/xinhua-letter-to-grandma-video-2026.md) 的必要范围。原视频保持 `link_only`，仓库不保存 MP4、音轨、截图或完整逐字稿。

## 失败处理

- 权利、发布者或媒体原址不清：不下载，登记候选线索并等待核验。
- 时间码无法复核：把 `transcript_status` 设为 `unavailable`，不生成具体引语。
- 自动转录听不清：保留原语言和 `unknown`，不按上下文猜人名、地名或方言字。
- 画面与说法冲突：分别保留 `speaker_claim` 与 `frame_observation`，不替来源消解冲突。
- 用户素材授权含糊：只在 local overlay 中使用，公开输出改用原创示意或文字描述。

## 完成检查

来源可回放、时间码不越界、责任主体分开、权利类别明确、无无授权媒体副本或完整转录、关键论断写明支持与不支持范围、用户素材没有越过本地边界、派生内容可沿 `source_ids` 返回 raw。
