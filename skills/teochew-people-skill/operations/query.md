# Query：回答、写作与制作

## 触发条件

当用户提出潮汕文化解释、写作、改写、审校、选题或视频／音频制作请求时使用。

## 输入

用户问题、目标受众、地域与年代范围、交付形式，以及可选的项目或用户 local vault。

## 有序步骤

1. 从 `wiki/index.md` 开始定位分类与主题，首轮最多读取 3 个 topic 页面。
2. 检查页面的证据状态、地域限定、新鲜度与 production facets。
3. 需要确认论断时沿 `source_ids` 读取 `raw/index.md` 和相应来源记录，不整库加载。
4. 输入含媒体时读取 `rights_status`、必要时间码与责任主体；把 `speaker_claim`、`narration`、`subtitle`、`frame_observation` 分开，不把能公开播放理解为允许复制。
5. 解析 `<project>/.teochew-people`、`~/.teochew-people` 与 bundled public wiki；本地层只补充语境，不覆盖公共事实。用户背景、家庭照片或录音默认停留在 local overlay。
6. 用户用“以后”“之后”等说法提出持久偏好时，先确认偏好只影响本地语境和表达，不改变公共事实；这类说法本身不等于持久化授权。明确说明尚未保存，并询问用户是否同意写入 local vault；只有得到明确同意才转入 evolve。
7. 页面陈旧、含糊、冲突，或涉及当前状态、日程、热点与在任人物时转入 research。
8. 输出时区分 verified、attributed statement、frame observation、synthesis、varies、unknown，并给出来源、时间码、权利状态与核验日期。图文／音视频方案为每项素材列 `media_type`、`rights_status`、来源／资产 ID、图注或免责声明。

## 写入边界

Query 默认只读。回答、草稿和一次性工作材料不写入公共 wiki，也不自动写入 local vault。

## 失败处理

找不到足够证据时缩小论断、说明未知并提出核验问题；不得以旧知识填补当前事实。私人层与公共层冲突时并列说明来源层级。

## 完成检查

范围明确、首轮不超过 3 页、关键事实可追溯、地方差异保留、当前信息已实时核验、生产细节没有编造；媒体输出还必须逐项声明媒体类型与权利状态，能回到原页面与时间码，并且不复制 `link_only` 内容。
