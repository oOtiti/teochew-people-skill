# TEOCHEW PEOPLE 多语言项目首页设计

## 目标

让访客在首屏快速理解：TEOCHEW PEOPLE 是一个来源可追踪、会持续演进、可在明确授权下个性化的潮汕文化 Skill 与 LLM Wiki，主要服务文章、口播和视频生产；同时提供简体中文、繁体中文、英语和日语四个可互相切换的完整入口。

## 信息层级

1. 保留现有 TEOCHEW PEOPLE hero。
2. 用一句产品定义说明 Wiki、Skill、自进化与个性化。
3. 紧接真实徽章与四语言切换，不展示仓库未使用的技术栈。
4. 第一节用“公共 Wiki／自进化／个性化／生产输出”四项一览解释主要内容，再展示来源校正后的英歌视觉。
5. 保留《给阿嬷的情书》图文和视频演示、安装、知识结构、贡献与验证内容。

## 自进化和个性化的准确边界

“越用越好用”指两条受控路径：经审核的公共来源、修正和 topic 更新进入公共 Wiki；经用户明确同意的家庭讲法、项目受众和表达偏好进入 local vault。一次性回答、未经授权的家庭素材和冲突信息不会自动写成公共事实。

## 徽章

- GitHub Actions `ci.yml`：真实 CI 状态。
- npm version：已发布版本，以 registry 为准。
- Node `>=18`：来自 `package.json`。
- MIT：来自许可证。
- Wiki `55 sources / 50 topics / 9 categories`：当前确定性索引统计。
- Languages `4`：四个 README 入口。

## 多语言文件

- `README.md`：简体中文主入口。
- `README.zh-Hant.md`：繁体中文。
- `README.en.md`：英语。
- `README.ja.md`：日语。

四页共用图片、链接、安装命令、权利边界和统计；翻译以自然表达为主，不改变产品承诺。四页均进入 npm 包。

## 验证

`scripts/validate-skill.ps1` 检查四个文件、语言互链、核心产品语义、真实徽章、重要展示链接和 package files；另外运行本地 Markdown 链接检查、`npm test` 与 `npm pack --dry-run`。
