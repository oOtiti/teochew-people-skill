# Evolve：持久更新

## 触发条件

当 research 或用户明确确认产生可长期复用、证据充分且超出一次性回答的知识变化时使用。

## 输入

已验证的来源与论断、目标层级、变更理由、影响页面、用户对私人资料持久化的明确同意。

## 有序步骤

1. 先分类：公开可核对事实进入 bundled public wiki；用户家庭、偏好与私有语境进入用户 local vault；仅当前项目适用的规则进入 project overlay。
2. 检查本地层不会静默改写公共事实；冲突须保留两种陈述和出处。
3. 公共更新先 ingest 来源，再更新 topic；只保存完成任务所需的最少私人信息。
4. 由单一写入者串行生成 raw／wiki 索引、运行 lint，再追加 wiki-log。
5. 检查相关页面、reviewed 日期和 freshness 状态。

## 写入边界

三层严格分离。未经用户同意不得创建或写入 local vault；项目层不得写回用户层；私人覆盖不得进入公共包。公共编译、索引和日志更新必须串行。

## 层级解析与安装

读取顺序固定为 `<project>/.teochew-people` → `~/.teochew-people` → bundled public wiki。项目层和用户层可补充写作偏好、家庭讲法与授权的本地材料，但不能将其伪装成公共事实，也不能静默覆盖已有来源的结论。

- 默认安装只替换公共 skill，不会创建 vault：`node scripts/install-skill.mjs --dest <skills-dir>`。
- 用户明确同意后，使用 `--init-vault` 初始化 `~/.teochew-people`；使用 `--vault <dir>` 可选择其他绝对或相对目录。
- 用户明确同意后，使用 `--init-project <project-dir>` 初始化项目内的 `.teochew-people`。其内 `.gitignore` 默认忽略全部个性化内容；如要纳入版本控制，先审查私密性，再改成明确 allow 规则或对选定文件使用 `git add -f`。
- 已完成 skill-only 安装时，可再次使用相同 `--dest` 搭配上述初始化参数；无需 `--force`，安装器会保留现有公共 skill，只初始化选定层。
- `--force` 只重装公共 skill。安装器初始化 vault 时始终保留已修改的 `profile.md`、本地 raw 与本地 wiki；它不会把私有目录删除后重建。
- 自动化或发布环境可显式使用 `--no-vault`，保证仅处理公共 skill。

所有目标在写入前必须解析为明确路径。如果目标与公共 skill 重叠，或者任一已存在的路径组件是 symbolic link、junction 或 reparse point，停止写入并报错。

## 失败处理

无法判断归属层时不写入并请求确认。证据未达门槛时回到 research。并发候选更新发生冲突时停止公共写入，由单一写入者合并。

## 完成检查

更新具有耐久价值、层级正确、来源可追溯、私人信息最小化、索引稳定、lint 通过、日志已追加。
