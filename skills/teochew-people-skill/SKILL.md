---
name: teochew-people-skill
description: 面向 Teochew People (潮汕人) 与更广义粤东潮汕文化圈的中文写作、事实查询、资料研究、审校和视频生产路由器。遇到潮汕人、潮人、汕头、潮州、揭阳、普宁、潮阳、潮南、澄海、惠来、揭西、海外潮人社群，以及潮汕话、工夫茶、潮剧、英歌、粿品、侨批、善堂、拜老爷、营老爷、节庆礼俗与当代表达时使用；它通过有来源的公共 wiki 与可分离的本地知识，帮助避免把单一城市、村落或家庭做法写成全体共识，也避免用旧资料冒充当前事实。
---

# Teochew People (潮汕人)

## 是什么

这是 TEOCHEW PEOPLE 内容任务的薄路由器，不是内嵌百科。公共范围是粤东大潮汕文化圈，包括汕头、潮州、揭阳及相关县区、历史联系与海外潮人社群；“潮州”不能自动等同全部潮汕。详细边界见 [wiki-purpose.md](./wiki-purpose.md)，字段与证据规则见 [wiki-schema.md](./wiki-schema.md)。

## 什么时候使用

用于解释、创作、改写、审校、研究或制作潮汕文化相关文字与视频。尤其适合需要辨别地域差异、核对来源、区分拜老爷与营老爷，或核验当前活动、官方身份、日程和在任人物的任务。

## 什么时候不要使用

不要用它替代学术考证、法律或医疗意见，也不要据此发布具体宗教仪轨、禁忌、择日、祭祀步骤或家族规矩。村落、姓氏、家庭与方言读音的细节如果没有当地直接证据，应说明未知或有差异。

## 查询路由

1. 每次先读 [wiki/index.md](./wiki/index.md)，再按问题选主题；首轮最多加载 3 个主题页。
2. 需要核对论断时，沿主题页的 `source_ids` 查 [raw/index.md](./raw/index.md) 与对应 raw 记录。
3. 输入含视频、音频、图片、字幕或家庭素材时，先执行 [operations/media-ingest.md](./operations/media-ingest.md)，再决定是否进入 raw。
4. 资料陈旧、含糊、相互冲突，或问题涉及当前事实时，执行 [operations/research.md](./operations/research.md)。当前官方状态、活动日程与仍在任的人物必须实时核验。
5. 只有经确认、可长期复用的更新才执行 [operations/evolve.md](./operations/evolve.md)；一次性回答不沉淀。

本地知识按以下顺序解析：`<project>/.teochew-people` → `~/.teochew-people` → bundled public wiki。前两层是 local vault 或项目覆盖层，只能补充用户语境与表达偏好；不得静默覆盖有来源的公共事实。冲突时并列呈现、标明层级，并请求确认或进入 research。

## 操作入口

- 收录来源：[operations/ingest.md](./operations/ingest.md)
- 摄取视频、音频与图片：[operations/media-ingest.md](./operations/media-ingest.md)
- 回答与创作：[operations/query.md](./operations/query.md)
- 外部核验：[operations/research.md](./operations/research.md)
- 持久更新：[operations/evolve.md](./operations/evolve.md)
- 结构审查：[operations/lint.md](./operations/lint.md)

公共主题知识页、生成索引和 `wiki-log.md` 更新必须串行执行，避免并发写入造成丢失。

## 写作与视频生产

写作前确定地域、年代、受众和文体；把可核对事实、综合判断、地方差异与未知内容分开。使用页面的 `claim_roles` 选择定义、历史、地理范围、画面、声音、动作、器物或生活经验，只把有证据的细节写进成稿。涉及传统时使用“在某地／某些家庭”“资料显示”等限定，避免“潮汕人都”“统一流程”。

视频脚本先建立“口播事实—来源—镜头依据”三列，再安排节奏。分镜中的人物动作、器物、声音与空间必须来自 `visual_detail`、`sound_detail`、`action_sequence`、`object_detail` 等有来源字段；推演镜头须标为重现或示意。拜老爷与营老爷不得混写为同一场景，单一地区素材不得包装成全潮汕通用画面。输出末尾列出核验依据与仍需现场确认的镜头。

公开视频先判断权利；公开可访问不等于可再利用。只取任务所需时间码，并区分说话者陈述、旁白、字幕和画面观察；不得因能播放就保存完整逐字稿、截图、电影片段或音轨。用户家庭材料默认留在 local overlay，本人明确授权前不进入公共 wiki。项目原创编辑视觉必须登记、注明“非历史照片／非具体现场”，并与史料图片分开。只要输出图文或视频方案，每个拟用素材都必须同时列出 `media_type`、`rights_status`、来源／资产 ID 和必要图注或免责声明。完整流程见 [operations/media-ingest.md](./operations/media-ingest.md)。
