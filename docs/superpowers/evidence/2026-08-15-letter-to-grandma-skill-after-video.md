# Fresh Skill pressure test — video ingest
这条新华社视频可以进入 Wiki，但应作为“带时间码的主创自述证据”，不能作为影片历史真实性、既成海外发行或普遍潮汕经验的证明。本次只读处理，没有修改仓库。

## 可入库来源卡

```yaml
id: xinhua-letter-to-grandma-video-2026
page_type: source
source_tier: B
publisher: "新华社音视频部"
published: "2026-05-16"
accessed: "2026-08-15"
media_type: video
rights_status: link_only
media_duration: "00:09:49"
transcript_status: verified_excerpt
timecode_scope: "00:03:55-00:09:45"
```

来源页：[新华社《独家专访导演〈给阿嬷的情书〉是怎样创作出来的？》](https://www.news.cn/politics/20260516/b9e1d180b13f4fb1baddd16e4a286fd3/c.html)

## 时间码证据

| 时间码 | 责任与类型 | 准确转述 | 可以支持 | 不能支持 |
| --- | --- | --- | --- | --- |
| `00:03:55–00:04:45` | 蓝鸿春；`speaker_claim` | 导演说明侨批在剧作结构中的安排。 | 主创如何解释影片的结构设计。 | 侨批历史本身、影片内容的历史真实性。 |
| `00:05:35–00:06:15` | 蓝鸿春；`speaker_claim` | 导演称部分故事关系是在拍摄过程中继续形成的。 | 该片创作过程的一项主创自述。 | 相关故事来自真实人物或可核历史事件。 |
| `00:05:35–00:06:15` | 新华社音视频部；`frame_observation` | 采访中间插了影片画面。 | 视频采用采访与影片片段交叉的编辑结构。 | 画面中未被页面说明的人物、地点、年代与事件。 |
| `00:06:40–00:08:05` | 蓝鸿春；`speaker_claim` | 导演谈到把剧本译成泰文，并用发音标记协助演员学习台词和处理语言细节。 | 该片跨语言表演准备的一种方法。 | 演员母语身份、翻译准确率或全潮汕统一发音。 |
| `00:09:05–00:09:45` | 蓝鸿春；`speaker_claim` | 导演表达希望作品被多个海外地区观众看到。 | 受访时的传播愿望。 | 已经完成海外发行或获得当地观众共同认可。 |

`00:04:45–00:05:35`、`00:06:15–00:06:40`、`00:08:05–00:09:05` 不应因为位于总核验范围内就被当作已转录证据。

可进入 topic 的受限综合表述是：

> 新华社访谈中，导演蓝鸿春把侨批结构、拍摄中继续形成的故事关系、泰文翻译与发音标记，以及海外传播愿望，解释为影片创作和传播设想的一部分；这些均属于主创自述。

## 派生口播

> 这段九分四十九秒的新华社专访，能进入 Wiki 的不是整段视频，而是四组带时间码的主创自述。三分五十五秒起，导演谈侨批怎样进入剧作结构；五分三十五秒起，他说部分故事关系在拍摄中继续形成；六分四十秒起，他讲到泰文翻译和发音标记；九分零五秒起，他表达让影片被更多海外观众看到的愿望。注意，这些内容说明的是导演怎样讲述创作过程，不能替代侨批档案，也不能把愿望写成已经发行。

## 一个可制作镜头

- `shot`：单镜到底的原创证据时间轴
- `duration`：约 38 秒
- `location`：原创二维信息图空间，非新华社页面截图
- `people`：不出现演员或影片人物
- `action`：镜头沿 `09:49` 时间轴横移，依次点亮四段证据；到 `05:35–06:15` 时，将“导演陈述”和“间插影片画面”拆成上下两层；结尾出现“主创自述 ≠ 历史证据／发行事实”
- `object`：原创信封线稿、场记板、语言版本卡和海外方向箭头；均作为编辑结构，不冒充电影道具或史料
- `sound`：使用上述原创口播、自制轻微翻页声和时间码提示音；不使用新华社原音、电影音乐或台词
- `source_id`：`xinhua-letter-to-grandma-video-2026`
- `rights`：视频为 `link_only`；画面全部 `editorial_original`
- `responsible_party`：四张陈述卡标“蓝鸿春（受访者）”；画面观察卡标“新华社音视频部（编辑呈现）”
- `claim_type`：每张卡分别标 `speaker_claim` 或 `frame_observation`，不混写
- `transcript_status`：`verified_excerpt`
- `safety`：注明“原创图解，非电影剧照、非历史照片、非具体现场”

## 是否应处理原视频

截至 `2026-08-15`，新华社正文页可访问；媒体端点对只读 `HEAD` 检查返回 `200 OK` 和 `Content-Type: video/mp4`，可视为当前仍有公开回放入口，但不保证所有地区或浏览器长期可播。

当前权利状态仍是 `link_only`，所以：

- 不应下载 MP4。
- 不应截帧或保存封面。
- 不应抽取、复用原音轨。
- 不应制作或保存完整逐字稿。
- 可以在线核验任务所需片段，保存来源 URL、时长、必要时间码和人工复核后的短转述。
- 若以后获得明确覆盖下载、转录、截帧和再发布的许可，再逐项调整权利状态；不能用“公开可播”代替授权。

## 实际读取的仓库文件

- [SKILL.md](D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill/SKILL.md)
- [wiki/index.md](D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill/wiki/index.md)
- [operations/media-ingest.md](D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill/operations/media-ingest.md)
- [raw/index.md](D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill/raw/index.md)
- [raw/2026-08-15/xinhua-letter-to-grandma-video-2026.md](D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill/raw/2026-08-15/xinhua-letter-to-grandma-video-2026.md)
- [wiki/current-events/给阿嬷的情书-2026.md](D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill/wiki/current-events/给阿嬷的情书-2026.md)
- [wiki-schema.md](D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill/wiki-schema.md)
- [operations/research.md](D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill/operations/research.md)
- [operations/query.md](D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill/operations/query.md)
- [wiki/guides/视频素材转Wiki.md](D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill/wiki/guides/视频素材转Wiki.md)
- [wiki/guides/短视频口播与分镜.md](D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill/wiki/guides/短视频口播与分镜.md)
