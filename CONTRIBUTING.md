# 贡献指南

TEOCHEW PEOPLE 采用 source-first：先决定一条来源是否可以进入证据链，再保存 raw 来源卡，最后建设或修订主题页。不要先写一个看似完整的文化结论，再回头寻找能配上的链接。

## 一条贡献如何进入知识库

1. **提出候选。** 明确 URL／出版信息、发布者、访问日期、地域与年代、拟支持的论断、与现有来源的独立性，以及版权限制。
2. **先做准入或拒绝。** 在 `skills/teochew-people-skill/raw/source-review.md` 追加决定。准入来源评 A／B／C；不合格或暂时无法核对的来源记 `Reject`／`defer`，保留理由但不创建 raw 页。
3. **录用后才建 raw。** 在日期目录下建立 `page_type: source` 来源卡，只摘要直接支持的事实、制作可用细节与不能证明的事项。
4. **再更新 topic。** 在 `wiki/` 相应分类建设主题页；用 `source_ids` 指向 raw，用 `related` 连接已存在页面，显式标记 evidence state、地方差异、新鲜度和 production facets。
5. **串行生成与验证。** raw、topic、索引和日志的公共写入由单一写入者完成，避免并发覆盖。

`raw/source-review.md` 是追加式审查账本。新的判断可以用 `supersedes` 说明旧判断为何失效，但不要删除或静默改写历史决定。

## 来源层级与独立性

- **A**：法规、政府或机构一手记录、原始档案、正式名录、同行评审研究等。它仍然只证明直接覆盖的对象。
- **B**：具名作者或有编辑责任的直接报道、可靠机构说明、可追溯访谈等。转载同一篇稿件不算第二个独立来源。
- **C**：可信度有限的二手整理或明确限定的经验，只能作为线索与生活语境。
- **Reject**：不能进入 raw 索引，也不能被 topic 的 `source_ids` 引用。

稳定定义、历史和地理范围至少需要一个直接 A，或两个独立且直接的 B。Wikipedia、百度百科、搜索摘要、评论区与无出处民俗帖只用于提取检索词和追原始来源，不自动获得 A／B 身份。官方域名承载转载内容也不会自动升级来源层级。

制作细节丰富只能在事实可信度相当的候选来源之间帮助择优；人物、动作、器物、声音或空间再生动，也不能补偿弱证据。

## 主题页必须保留的判断

主题页的 `evidence_state` 只使用：

- `verified`：列明来源直接支持页面表述。
- `synthesis`：跨来源综合已经明示，不冒充原文结论。
- `varies`：地方、家庭、群体或年代之间存在差异。
- `unknown`：现有证据不足，保留空白并说明下一步如何核验。

不要把潮州市等同全部潮汕，不要把一座庙、一个村、一次活动或一户家庭写成全域事实。每个关键句尽量写明“地方＋时间＋来源类型＋事实＋不可外推边界”。家庭口述只写“本家做法”；未经明确同意，不进入用户 vault，更不能进入公共 wiki。

## 热点与日期

当前事件要分别记录事件日、报道日、原文日期和核验日，不能互换。`current` 页面每 180 天复核；开放的 `event` 页面每 30 天复核。无论页面是否过期，以下事项在回答或发布当日都要重新打开官方来源：

- 官方状态、名录与申报节点；
- 活动日程、路线、开放安排；
- 仍在任且可能变动的人物。

申请不等于入选，规划不等于完成；世界遗产、世界记忆和非遗代表作不能混称。旧报道只能证明当时状态。

## 写作、视频、版权与隐私

- 每个来源内细节标为 `source_detail`；地图、标题卡、转场和中性示意标为 `editorial_structure`。不要把创意剪辑写成历史或仪式顺序。
- 不过量复制文章、论文、电影、唱词、图片、档案文字、音频或既有视频。记录必要事实与短小描述，并保留原权利信息。
- 家庭、未成年人、长者、宗教参与者、家族档案与私人空间先取得明确授权；公共包不接收私人资料。
- 拍摄庙宇、神像、表演队伍和活动现场时，分别核对管理规定、肖像、录音、音乐、路线与安全。
- 本项目可以解释拜老爷、营老爷等文化语境，但不贡献统一神明表、供品表、咒语、禁忌、方位、择日或可执行仪轨，也不要求信众重演宗教动作。

## Issue #1：从内容需求到来源链

GitHub Issue [#1](https://github.com/oOtiti/teochew-people-skill/issues/1) 提出补充“拜老爷”相关 references。正确处理不是把 Issue 当作民俗证据：

1. 在 `source-review.md` 把 Issue 记录为产品需求，并以 `Reject` 说明它不能证明文化事实。
2. 分别寻找日常敬神、社区巡行、地方神明和地方差异的直接来源。
3. 准入期刊、正式名录与具名研究，Reject 无作者转载、无法复核页面和重复材料。
4. 建立 raw 来源卡，再建设[拜老爷](skills/teochew-people-skill/wiki/customs/拜老爷.md)、[营老爷](skills/teochew-people-skill/wiki/customs/营老爷.md)与[地方神明](skills/teochew-people-skill/wiki/customs/地方神明.md)页面。
5. 明确“拜”与“营”的区别、地方／家庭差异、未知事项，以及写作视频中的来源内细节与现场边界。

这个例子展示了完整顺序：需求不是证据，资料先被挑选，topic 才能据此生长。

## 文件位置

- 候选、准入、Reject／defer：`skills/teochew-people-skill/raw/source-review.md`
- 已准入来源卡：`skills/teochew-people-skill/raw/YYYY-MM-DD/<source-id>.md`
- 主题与分类索引：`skills/teochew-people-skill/wiki/`
- 查询、研究与维护规则：`skills/teochew-people-skill/operations/`
- 产品使用示例：`examples/`
- skill 触发与路由：`skills/teochew-people-skill/SKILL.md`（保持轻量，领域细节进入 raw／wiki）

字段与证据门槛见 `skills/teochew-people-skill/wiki-schema.md`，公共范围见 `skills/teochew-people-skill/wiki-purpose.md`。

## 索引、lint 与测试

新增 raw 或 topic 后先生成索引：

```bash
npm run wiki:index
```

提交前运行完整检查：

```bash
npm run wiki:index:check
npm run wiki:lint
npm test
npm run pack:check
```

`wiki:index:check` 应证明索引与当前语料一致；`wiki:lint` 检查 frontmatter、唯一 ID、证据链、related 路径与新鲜度；`npm test` 还覆盖行为场景、工具和结构验证。`npm run pack:check` 必须确认公开包不含 `.teochew-people`、家庭材料、项目 overlay、缓存或临时文件。

## PR 说明模板

```text
内容需求或问题：
候选来源与准入／Reject 决定：
新增 raw IDs：
影响 topic：
地域、家庭与年代边界：
当前信息的核验日期：
版权、隐私与现场限制：
运行的验证命令与结果：
```
