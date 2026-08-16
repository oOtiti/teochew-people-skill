# 演示：把一条新华社视频转为可生产的 Wiki 证据

本演示完整走一遍“公开视频 → 权利与时长 → 必要时间码 → 责任主体 → claim → raw → topic → 文章／分镜”。它使用新华社 2026 年 5 月 16 日发布的《给阿嬷的情书》导演专访，不下载或提交原视频，也不保存完整逐字稿。

![公开视频从页面登记、时间码与责任主体拆分到raw、topic和内容输出的证据流程](../assets/video-to-wiki-flow.svg)

> **原创流程图。** 原视频、封面、电影片段与音轨均为 `link_only`；图中时间码是人工核验范围，不是版权许可。

## 1. 先登记，不先下载

| Field | Value | Why it matters |
| --- | --- | --- |
| `source_id` | `xinhua-letter-to-grandma-video-2026` | 稳定、唯一、ASCII kebab-case |
| `publisher` | 新华社音视频部 | 发布者与受访者分开 |
| `source_url` | `https://www.news.cn/politics/20260516/b9e1d180b13f4fb1baddd16e4a286fd3/c.html` | 保存 canonical 页面，不把搜索摘要当来源 |
| `published` | `2026-05-16` | 视频发布日，不当拍摄日或电影上映日 |
| `media_type` | `video` | 启用媒体字段校验 |
| `rights_status` | `link_only` | 可查看，不代表可复制／裁切／再发布 |
| `media_duration` | `00:09:49` | 浏览器读取 589.354667 秒后按秒记录 |
| `transcript_status` | `verified_excerpt` | 只核验任务所需片段，没有完整转录 |
| `timecode_scope` | `00:03:55-00:09:45` | 本轮人工抽查覆盖范围 |
| `accessed` | `2026-08-15` | 可回放状态会变化 |

直接 MP4 只记录在 raw 正文，供核验播放器使用：

```text
https://vodpub6.v.news.cn/yqfbzx-original/20260516/20260516b9e1d180b13f4fb1baddd16e4a286fd3_XxjfceC000067_20260516_CBVFN0A001.mp4
```

仓库中没有对应 `.mp4` 文件。公开视频的“可访问”属性只回答能否复核，不能回答能否重新分发。

## 2. 把四种责任分开

同一条新闻视频可能同时包含：

- `publisher/editor`：新华社音视频部及页面列出的制作团队；负责发布和编辑组合。
- `speaker_claim`：蓝鸿春在采访画面里的陈述；只能归于受访者。
- `narration/subtitle`：新闻旁白和字幕；不自动等于受访者原话。
- `frame_observation`：视频插入了某段电影画面；只能说明“这个视频此时展示了作品片段”。

看到人物或物件，不能在发布者没有说明时猜姓名、地点、年代、身份、起源或普遍性。字幕中的潮语、人名、地名与专有词，未经人工回听保持 `unknown`。

## 3. 建立必要时间码，而不是完整转录

| Timecode | Responsible party | Verified paraphrase / observation | Claim type | Can support | Cannot support | Confidence |
| --- | --- | --- | --- | --- | --- | --- |
| `00:03:55–00:04:45` | 蓝鸿春 | 谈侨批在剧作结构中的安排 | `speaker_claim` | 该片主创如何解释自己的写作选择 | 片中侨批文字是历史原件；当年侨批都如此写 | high for attributed statement |
| `00:05:35–00:06:15` | 蓝鸿春；间插电影画面 | 谈部分故事关系在拍摄过程中继续形成；画面属于作品片段 | `speaker_claim` + `frame_observation` | 该片的具体创作过程；视频确有作品插入画面 | 所有电影都这样创作；插入画面是历史现场 | high / medium |
| `00:06:40–00:08:05` | 蓝鸿春；间插电影画面 | 谈剧本泰文翻译、发音标记和演员语言准备 | `speaker_claim` | 该片跨语言表演准备的一种方法 | 演员母语身份；发音是全潮汕标准 | high for attributed statement |
| `00:09:05–00:09:45` | 蓝鸿春 | 谈希望多个海外地区观众看到作品 | `speaker_claim` | 2026-05-16 时主创的传播愿望 | 当时已经完成这些地区发行 | high for attributed statement |

这里没有保存电影对白，也没有逐字复制长段采访。公开 Wiki 只需要足以复核 claim 的准确转述；完整转录可能同样受版权保护。

## 4. 写成受控 raw

最终 raw 位于 [`xinhua-letter-to-grandma-video-2026.md`](../skills/teochew-people-skill/raw/2026-08-15/xinhua-letter-to-grandma-video-2026.md)，核心 frontmatter 如下：

```yaml
---
id: xinhua-letter-to-grandma-video-2026
page_type: source
source_tier: B
source_url: "https://www.news.cn/politics/20260516/b9e1d180b13f4fb1baddd16e4a286fd3/c.html"
publisher: "新华社音视频部"
published: "2026-05-16"
accessed: "2026-08-15"
media_type: video
rights_status: link_only
media_duration: "00:09:49"
transcript_status: verified_excerpt
timecode_scope: "00:03:55-00:09:45"
---
```

校验器会拒绝：未知媒体类型、错误权利值、非法时分秒、倒置时间范围、结束时间超过时长，以及只有其他媒体字段却缺 `media_type` 的来源页。

## 5. 进入 topic 前做独立交叉

视频能支持导演对创作过程的陈述，却不能单独支持侨批定义或潮语分布。因此 topic 使用独立来源分工：

| Topic claim | Primary evidence | Video role |
| --- | --- | --- |
| 影片备案、上映与权利 | `national-film-filing-letter-to-grandma-2023`、`ncac-film-copyright-warning-letter-to-grandma-2026` | 不承担 |
| 侨批兼有通信与汇款属性 | `unesco-qiaopi-2013`、`gd-archives-qiaopi-story` | 只说明主创如何使用侨批 |
| 潮语名称、范围和地方差异 | `gd-dfz-teochew-language-2020` | 只说明该片的一种跨语言准备 |
| 实际马新放映 | `gsc-dear-you-malaysia-2026`、联合早报两条 raw | 09:05 后的愿望只能作早期主创陈述 |

这样，删除视频或改变其可回放状态，不会让长期侨批与语言定义随之失去依据。

## 6. 派生为写作句子

不合格：

> 电影里的侨批都来自真实历史，演员也用最标准的潮汕话还原了当年生活。

问题：把主创自述变成历史认证，把跨语言准备变成口音标准，还使用了“都”。

合格：

> 蓝鸿春在新华社访谈中谈到侨批写作和跨语言表演准备；这些片段说明该片的创作选择。侨批的档案属性与潮语的地域差异，仍分别回到 UNESCO、档案馆和地方志来源。

这里同时保留 `attributed_statement` 和独立证据路径。

## 7. 派生为短视频镜头

```yaml
shot: V08
duration: 00:18
visual: 原创“页面—时间码—speaker—claim—raw—topic”流程图
action: 依次点亮 03:55、06:40 和 RAW / TOPIC 节点
sound: 自录旁白与原创时间码点击音
source_id: xinhua-letter-to-grandma-video-2026
evidence: method + attributed_statement
rights: editorial_original; source video link_only
safety: 不显示视频截图，不提取原音，不读电影对白
local_check: 潮语、人名与地名若新增必须人工回听
```

这条镜头使用的是证据结构，不是新闻视频的视觉替身。观众如需复核，沿 raw 的页面 URL 和时间码到原发布者查看。

## 8. 不进入仓库的内容

- 原视频二进制、缓存片段、截图、封面和音轨。
- 完整自动转录或大量逐字文本。
- 未解释来源的电影台词、音乐、海报和剧照。
- 从画面猜测的人物姓名、地点、年代或身份。
- 未经授权的用户家庭视频、私信、照片和录音。

## 9. 验证链

```powershell
npm run wiki:lint
npm run media:check
npm test
npm run pack:check
```

预期结果：视频 raw 的媒体字段通过；topic 能追到 admitted raw；本地视觉都在 manifest；npm 包中没有 MP4、完整转录或研究截图。

## 继续阅读

- [视频素材转 Wiki 指南](../skills/teochew-people-skill/wiki/guides/视频素材转Wiki.md)
- [《给阿嬷的情书》专题文章](./letter-to-grandma-feature.md)
- [60 秒与约 3 分钟脚本](./letter-to-grandma-video-scripts.md)
- [《给阿嬷的情书》事件 topic](../skills/teochew-people-skill/wiki/current-events/给阿嬷的情书-2026.md)
