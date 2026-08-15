# Wiki schema 与证据规则

## 受控 frontmatter 子集

每个语料页使用由 `---` 包围的平面键值表。键必须是 ASCII 字母开头的字母、数字、下划线或连字符；每行一个键。值只允许：未加引号字符串、JSON 双引号字符串、单引号字符串、`true`／`false`、十进制数字，以及只含标量的 JSON 风格数组（例如 `["source-a", "source-b"]`）。空值解析为空字符串。对象、缩进映射、块数组、多行标量、锚点、标签和其他嵌套 YAML 均不支持，解析器会明确失败。

日期统一写为 `YYYY-MM-DD` 字符串。路径使用相对 skill 根目录、以 `/` 分隔的 Markdown 路径。ID 使用稳定、全库唯一的 ASCII kebab-case 字符串。

## 页面类型与必填字段

`page_type: source` 用于 `raw/` 中的来源记录，必填：

- `id`, `title`, `page_type`, `source_tier`, `source_url`, `publisher`, `accessed`

`page_type: topic` 用于 `wiki/` 中的公共主题页，必填：

- `id`, `title`, `page_type`, `category`, `evidence_state`
- `source_ids`, `related`, `claim_roles`, `production_facets`
- `freshness`, `reviewed`

`source_ids` 是 raw 来源 ID 数组；`related` 是相对 skill 根目录的 Markdown 路径数组。事件页另用 `event_status`，值为 `open`、`closed` 或 `superseded`。

`page_type: category-index` 仅用于分类导航页，必填 `id`, `title`, `page_type`, `category`。分类页不承载文化论断，也不要求来源字段。

来源页可选用 `source_status: unavailable` 标明 canonical 已无法回放。这不改变来源发布时的层级，但该页只能作带日期的历史快照或检索线索；raw 索引必须显式显示此状态。未设置 `source_status` 不等于承诺链接永久可用，当前事实仍须按新鲜度规则复核。

## 受控值

证据状态 `evidence_state`：

- `verified`：页面表述可由列明来源直接支持。
- `synthesis`：清楚标注的跨来源综合，不冒充原始来源结论。
- `varies`：资料显示存在地域、群体、年代或家庭差异。
- `unknown`：现有证据不足，保留空白边界。

来源层级 `source_tier`：

- `A`：法规、政府或机构官方记录、原始档案、正式名录、同行评审研究等高权威来源。
- `B`：具名作者或编辑责任的直接报道、博物馆／文化机构说明、可靠专著或可追溯访谈。
- `C`：可信度有限的二手整理、未充分标注来源的媒体内容或单一经验叙述，只能提供线索与生活语境。
- `Reject`：不准入语料的来源标记，只能写入 `raw/source-review.md`，绝不能出现在 raw 索引或来源页。

论断角色 `claim_roles` 只允许：`definition`, `history`, `geographic_scope`, `visual_detail`, `sound_detail`, `action_sequence`, `object_detail`, `lived_experience`。

生产面向 `production_facets` 用于检索与成稿选择，只允许：`writing`, `editing`, `video`, `audio`, `education`, `exhibition`, `social`。

新鲜度 `freshness` 只允许：`enduring`, `current`, `event`。

## 来源准入与论断强度

稳定核心事实（定义、起源／历史、地理范围）至少需要一个 A 级来源，或两个相互独立且直接支持该事实的 B 级来源。C 级来源不能证明起源、普遍性、官方状态或稳定核心事实；它可以补充明确限定的生活经验。不同转载不能算独立来源。

Wikipedia（维基百科）和 Baidu Baike（百度百科）只可用于背景理解、提取检索关键词和发现原始来源的候选线索。不能仅凭百科条目内容将其准入为支撑稳定核心事实的证据，也不能自动成为 A/B 核心证据；必须追溯并审查条目引用的原始或权威来源，再按本 schema 独立评定层级与适用论断。

生产细节价值只可在事实可信度相当的候选来源中用于择优。更丰富的画面、声音、动作、器物或生活经验描述，不能补偿事实证据不足，也不能降低核心事实的来源门槛。

research 必须先选择来源并记录取舍，再写 raw 或 topic 内容。原文与摘要需避免超量引用；图片、音频和视频只记录链接、权属与必要描述。

## 复核规则

- `enduring`：受到可信挑战或所依赖来源发生变化时复核。
- `current`：每 180 天复核。
- `event`：在 `open` 状态下每 30 天复核，直至标为 `closed` 或 `superseded`。

无论页面日期是否在期限内，当前官方状态、活动日程、在世且可能变动的任职人物都必须实时核验，并在回答中标明核验日期。
