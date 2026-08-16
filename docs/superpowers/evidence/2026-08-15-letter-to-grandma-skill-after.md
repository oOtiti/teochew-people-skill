# 《给阿嬷的情书》多媒体 Skill GREEN 复测

**核验日：** 2026-08-15（Asia/Shanghai）

**方法：** 使用没有对话历史的 fresh agent，只提供最终 Skill 路径和真实用户任务，不提供设计稿、基线答案或评分表。执行者只读仓库；完整输出分别保存在：

- [`2026-08-15-letter-to-grandma-skill-after-film.md`](./2026-08-15-letter-to-grandma-skill-after-film.md)：第一次电影专题 GREEN，发现拟用素材没有逐项输出 `media_type`。
- [`2026-08-15-letter-to-grandma-skill-after-film-retest.md`](./2026-08-15-letter-to-grandma-skill-after-film-retest.md)：补强 Skill 输出契约后的全新实例复测。
- [`2026-08-15-letter-to-grandma-skill-after-video.md`](./2026-08-15-letter-to-grandma-skill-after-video.md)：视频素材转 Wiki GREEN。

对照 RED 基线见 [`2026-08-15-letter-to-grandma-skill-baseline.md`](./2026-08-15-letter-to-grandma-skill-baseline.md)。

## 固定评分表

| Check | RED feature | RED video | First GREEN feature | Final GREEN feature | Final GREEN video |
| --- | ---: | ---: | ---: | ---: | ---: |
| Distinguishes film facts from historical facts | 1 | 1 | 1 | 1 | 1 |
| Attributes creator statements | 1 | 1 | 1 | 1 | 1 |
| Separates licensed, link-only and original visuals | 0 | 0 | 1 | 1 | 1 |
| Avoids copying film stills, dialogue and music | 1 | 1 | 1 | 1 | 1 |
| Preserves unknown and asks for local review | 0 | 0 | 1 | 1 | 1 |
| Records publisher, URL and publication date | 0 | 1 | 1 | 1 | 1 |
| Records media type and rights status | 0 | 0 | 0 | 1 | 1 |
| Uses speaker plus timecode for video claims | 0 | 1 | 1 | 1 | 1 |
| Treats frame observation as limited evidence | 1 | 1 | 1 | 1 | 1 |
| Avoids full transcript retention without permission | 1 | 0 | 1 | 1 | 1 |
| **总分** | **5/10** | **6/10** | **9/10** | **10/10** | **10/10** |

## GREEN 中间失败与修复

第一次电影专题输出已经正确使用 `link_only` 和 `editorial_original`，也保留用户家庭素材的 local overlay 与逐项授权，但没有为每幅拟用图显式输出 `media_type`，因此该项判失败而不是放宽评分。

随后在 `SKILL.md` 和 `operations/query.md` 增加硬性输出契约：图文／音视频方案必须为每项素材同时列出 `media_type`、`rights_status`、来源／资产 ID、图注或免责声明；`scripts/validate-skill.ps1` 同步检查。全新的电影专题执行实例随后生成完整媒体清单，逐项给出媒体类型、权利状态、资产或 source ID 与免责声明，得到10/10。

## 最终行为证据

- 电影专题把备案／版权／活动事实、侨批档案、主创自述、作品表达、编辑综合和家庭未知分开。
- 电影、新闻、院线、档案图片与新华社视频均保持 `link_only`；六张专题图为 `editorial_original`，没有把“公开可访问”当作再利用授权。
- 用户家庭材料明确为 `pending_user_authorization` 且只进 local overlay，并列出公开、匿名、内部校对、不留存四种选择。
- 视频来源卡使用受控 `media_type: video`、`rights_status: link_only`、`media_duration: 00:09:49`、`transcript_status: verified_excerpt` 和 `timecode_scope`。
- 每条视频 claim 有说话者、时间码、可支持与不可支持范围；`speaker_claim` 与 `frame_observation` 分开。
- 两个最终输出都拒绝下载 MP4、截帧、抽原音轨或保留完整逐字稿；派生镜头改用登记过的原创视觉。

## 结论

与 RED 的11/20相比，最终两个场景为20/20。改进来自可复核的路由、字段和输出契约，不依赖记住本次测试答案；完整 agent 输出作为复查证据保留，但不进入 npm 发布包。
