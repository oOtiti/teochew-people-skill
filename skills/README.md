# TEOCHEW PEOPLE

`teochew-people-skill` 是一个 source-grounded、可持续演进的潮汕文化 LLM Wiki。它为 AI agent 提供按需读取的公共知识、写作与视频生产指南，以及与公共事实分离的本地个性化层。

## 入口与分层

- `SKILL.md`：薄路由器，只说明触发条件、范围边界和查询路径。
- `raw/`：已准入来源卡、来源索引与追加式 source review；Reject／defer 只留审查理由，不进入证据链。
- `wiki/`：已经建设好的主题页、分类索引、当前事件页与内容制作指南。
- `operations/`：`ingest`、`query`、`research`、`evolve`、`lint` 的可审计工作流。
- `scripts/`：确定性索引、结构 lint、状态检查与 vault 初始化工具。
- `agents/openai.yaml`：面向 UI 的名称、简介和默认提示词。

公共查询从 `wiki/index.md` 开始，首轮按需选择少量 topic；需要核对论断时沿 `source_ids` 到 `raw/index.md` 和来源卡。新事实必须先经过来源准入，再更新 topic。

## 本地个性化

解析顺序是 `<project>/.teochew-people` → `~/.teochew-people` → bundled public wiki。项目层和用户层可补充受众、选例、语气、本家称谓与授权材料，但不能静默覆盖公共事实。私有 vault、项目 overlay 与用户资料不属于公开 skill，也不得进入 npm 包。

## 内容边界

- `Teochew` 在这里连接更广的潮汕文化世界，不等同于今天的潮州市。
- 主题页保留城市、县区、村社、家庭、年代和海外社群差异。
- 人物、动作、器物、声音、空间与顺序只有在来源支持时才进入写作或分镜。
- 当前状态、活动日程与在任人物需要实时核验。
- 不生成统一神明、供品、路线、咒语、禁忌、择日或可执行宗教仪轨。
