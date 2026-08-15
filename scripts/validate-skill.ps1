$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$skillDir = Join-Path $root "skills/teochew-people-skill"
$skillFile = Join-Path $skillDir "SKILL.md"
$agentFile = Join-Path $skillDir "agents/openai.yaml"
$packageFile = Join-Path $root "package.json"
$installScript = Join-Path $root "scripts/install-skill.mjs"
$readmeFile = Join-Path $root "README.md"
$readmeTraditionalFile = Join-Path $root "README.zh-Hant.md"
$readmeEnglishFile = Join-Path $root "README.en.md"
$readmeJapaneseFile = Join-Path $root "README.ja.md"
$licenseFile = Join-Path $root "LICENSE"
$contributingFile = Join-Path $root "CONTRIBUTING.md"
$exampleFile = Join-Path $root "examples/before-after.md"
$showcaseArticleFile = Join-Path $root "examples/showcase-article.md"
$showcaseVideoFile = Join-Path $root "examples/showcase-video.md"
$letterFeatureFile = Join-Path $root "examples/letter-to-grandma-feature.md"
$letterVideoFile = Join-Path $root "examples/letter-to-grandma-video-scripts.md"
$videoWikiDemoFile = Join-Path $root "examples/video-to-wiki-demo.md"
$heroBackgroundFile = Join-Path $root "assets/hero-background.png"
$heroFile = Join-Path $root "assets/hero.svg"
$socialPreviewFile = Join-Path $root "assets/social-preview.png"
$caseDemoFile = Join-Path $root "assets/case-demo.svg"
$letterHeroFile = Join-Path $root "assets/letter-to-grandma-hero.png"
$yinggeEpicFile = Join-Path $root "assets/yingge-epic.png"
$mediaManifestFile = Join-Path $root "assets/media-manifest.json"
$requiredSkillFiles = @(
    "wiki-purpose.md",
    "wiki-schema.md",
    "wiki-log.md",
    "agents/openai.yaml",
    "operations/ingest.md",
    "operations/media-ingest.md",
    "operations/query.md",
    "operations/research.md",
    "operations/evolve.md",
    "operations/lint.md",
    "raw/index.md",
    "raw/source-review.md",
    "wiki/index.md",
    "scripts/wiki-lib.mjs",
    "scripts/build-index.mjs",
    "scripts/lint-wiki.mjs",
    "scripts/wiki-status.mjs",
    "scripts/init-vault.mjs",
    "assets/vault-template/profile.md",
    "assets/vault-template/wiki/index.md",
    "assets/vault-template/raw/index.md"
)
$requiredWikiCategories = @(
    "concepts",
    "places",
    "customs",
    "food",
    "arts-language",
    "society-diaspora",
    "people-organizations",
    "current-events",
    "guides"
)

function Fail($message) {
    Write-Error $message
    exit 1
}

if (-not (Test-Path -LiteralPath $skillFile)) {
    Fail "缺少 skills/teochew-people-skill/SKILL.md"
}

$skill = Get-Content -LiteralPath $skillFile -Raw
if ($skill -notmatch '(?s)^---\s*\r?\nname:\s*teochew-people-skill\s*\r?\ndescription:\s*(.+?)\r?\n---') {
    Fail "SKILL.md 必须包含 name: teochew-people-skill 和 description"
}

$description = $Matches[1].Trim()
if ($description.Length -lt 120) {
    Fail "SKILL.md 的 description 太短，触发信息不足"
}

if ($skill -match '\[TODO|TODO:|Replace with|Structuring This Skill') {
    Fail "SKILL.md 仍包含模板 TODO 文本"
}

foreach ($term in @("Teochew People", "潮汕人", "是什么", "什么时候使用", "什么时候不要使用", "粤东", "汕头", "揭阳", "潮州")) {
    if ($skill -notmatch [regex]::Escape($term)) {
        Fail "SKILL.md 应包含 '$term'"
    }
}

foreach ($file in $requiredSkillFiles) {
    $path = Join-Path $skillDir $file
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        Fail "缺少必要文件: skills/teochew-people-skill/$file"
    }
}

foreach ($category in $requiredWikiCategories) {
    $categoryDir = Join-Path $skillDir "wiki/$category"
    $markdown = @(Get-ChildItem -LiteralPath $categoryDir -Filter "*.md" -File -Recurse -ErrorAction SilentlyContinue)
    if ($markdown.Count -eq 0) {
        Fail "wiki 分类 '$category' 至少需要一个 Markdown 文件"
    }
}

foreach ($path in @(
    $packageFile,
    $installScript,
    $readmeFile,
    $readmeTraditionalFile,
    $readmeEnglishFile,
    $readmeJapaneseFile,
    $licenseFile,
    $contributingFile,
    $exampleFile,
    $showcaseArticleFile,
    $showcaseVideoFile,
    $letterFeatureFile,
    $letterVideoFile,
    $videoWikiDemoFile,
    $heroBackgroundFile,
    $heroFile,
    $socialPreviewFile,
    $caseDemoFile,
    $letterHeroFile,
    $yinggeEpicFile,
    $mediaManifestFile
)) {
    if (-not (Test-Path -LiteralPath $path)) {
        Fail "缺少公开发布文件: $($path.Substring($root.Length + 1))"
    }
}

$agent = Get-Content -LiteralPath $agentFile -Raw
if ($agent -notmatch '\$teochew-people-skill') {
    Fail "agents/openai.yaml 的 default_prompt 必须包含 `$teochew-people-skill"
}

$bundledText = Get-ChildItem -LiteralPath $skillDir -File -Recurse |
    Where-Object { $_.Extension -in @(".md", ".yaml", ".yml", ".mjs") } |
    ForEach-Object { Get-Content -LiteralPath $_.FullName -Raw } |
    Join-String -Separator "`n"

foreach ($term in @("raw", "wiki", "research", "evolve", "local vault", "拜老爷", "营老爷", "TEOCHEW PEOPLE", "ingest", "query", "lint")) {
    if ($bundledText -notmatch [regex]::Escape($term)) {
        Fail "技能内容应包含 '$term'"
    }
}

$mediaIngestContract = @(
    @{ Label = "公开可访问不等于可再利用"; Pattern = '公开可访问.{0,20}不等于.{0,20}(可再利用|可复制|可下载)' },
    @{ Label = "时间码"; Pattern = '(timecode|时间码)' },
    @{ Label = "说话者与画面观察分离"; Pattern = '(speaker_claim|说话者).{0,100}(frame_observation|画面观察)' },
    @{ Label = "禁止无授权完整转录"; Pattern = '(不得|禁止|不能).{0,80}(完整逐字稿|完整转录|全文转录)' },
    @{ Label = "用户背景默认本地覆盖"; Pattern = '(用户背景|用户素材|家庭材料).{0,100}(local overlay|本地覆盖层)' },
    @{ Label = "派生素材逐项声明媒体类型与权利"; Pattern = '(每个拟用素材|每项素材).{0,100}media_type.{0,100}rights_status' }
)

foreach ($requirement in $mediaIngestContract) {
    if ($bundledText -notmatch $requirement.Pattern) {
        Fail "技能内容缺少媒体摄取规则: $($requirement.Label)"
    }
}

$sourceAdmissionContract = @(
    @{ Label = "Wikipedia/维基百科"; Pattern = '(?i)(Wikipedia|维基百科)' },
    @{ Label = "Baidu/百度百科"; Pattern = '(?i)(Baidu|百度百科)' },
    @{ Label = "候选/线索"; Pattern = '(?i)(候选|线索|candidate|research\s+lead|search\s+lead)' },
    @{ Label = "不得自动作为核心证据"; Pattern = '(?is)(不得|不能|不可|cannot|must\s+not).{0,80}(自动|automatically).{0,80}(核心证据|core\s+evidence|A\s*[/／]\s*B)' }
)

foreach ($requirement in $sourceAdmissionContract) {
    if ($bundledText -notmatch $requirement.Pattern) {
        Fail "技能内容缺少来源准入规则: $($requirement.Label)"
    }
}

if ($bundledText -match '\[TODO|TODO:') {
    Fail "技能内容仍包含 TODO 文本"
}

$package = Get-Content -LiteralPath $packageFile -Raw | ConvertFrom-Json
if ($package.name -ne "teochew-people-skill") {
    Fail "package.json 的 name 应为 teochew-people-skill"
}

if ($package.version -ne "0.2.0") {
    Fail "package.json 的 version 应为 0.2.0"
}

if (-not $package.bin.'teochew-people-skill') {
    Fail "package.json 应提供 teochew-people-skill 命令"
}

$requiredPackageFiles = @(
    "skills/teochew-people-skill",
    "scripts/install-skill.mjs",
    "examples",
    "assets/hero-background.png",
    "assets/hero.svg",
    "assets/social-preview.png",
    "assets/case-demo.svg",
    "assets/letter-to-grandma-hero.png",
    "assets/yingge-epic.png",
    "assets/letter-to-grandma-timeline.svg",
    "assets/letter-to-grandma-map.svg",
    "assets/qiaopi-object-flow.svg",
    "assets/evidence-layers.svg",
    "assets/video-to-wiki-flow.svg",
    "assets/media-manifest.json",
    "scripts/validate-media-manifest.mjs",
    "docs/github-workflows.md",
    "docs/publishing.md",
    "README.md",
    "README.zh-Hant.md",
    "README.en.md",
    "README.ja.md",
    "CONTRIBUTING.md",
    "LICENSE"
)
$packageFiles = @($package.files)
foreach ($required in $requiredPackageFiles) {
    if ($packageFiles -notcontains $required) {
        Fail "package.json files 应包含 '$required'"
    }
}

foreach ($entry in $packageFiles) {
    $normalized = ([string]$entry).Replace('\', '/').TrimStart('./')
    if ($normalized -in @("", ".", "*", "**", "**/*") -or
        $normalized -match '(^|/)\.teochew-people(/|$)' -or
        $normalized -match '(^|/)\.(worktrees|git)(/|$)' -or
        $normalized -match '(^|/)(private|tmp|temp)(/|$)') {
        Fail "package.json files 不得包含宽泛或私有路径 '$entry'"
    }
}

foreach ($keyword in @("llm-wiki", "knowledge-base", "潮汕文化", "Teochew", "source-grounded")) {
    if (@($package.keywords) -notcontains $keyword) {
        Fail "package.json keywords 应包含 '$keyword'"
    }
}

foreach ($term in @("source-grounded", "LLM wiki", "knowledge base", "Teochew", "writing", "video")) {
    if ($package.description -notmatch [regex]::Escape($term)) {
        Fail "package.json description 应包含 '$term'"
    }
}

$packageLockFile = Join-Path $root "package-lock.json"
$packageLock = Get-Content -LiteralPath $packageLockFile -Raw | ConvertFrom-Json -AsHashtable
if ($packageLock["version"] -ne "0.2.0" -or $packageLock["packages"][""]["version"] -ne "0.2.0") {
    Fail "package-lock.json 的根版本应为 0.2.0"
}

$installer = Get-Content -LiteralPath $installScript -Raw
foreach ($term in @("--codex", "--claude", "--dest", "--force", "skills", "teochew-people-skill")) {
    if ($installer -notmatch [regex]::Escape($term)) {
        Fail "安装脚本应包含 '$term'"
    }
}

$readme = Get-Content -LiteralPath $readmeFile -Raw
foreach ($term in @(
    "assets/social-preview.png",
    "TEOCHEW PEOPLE",
    "npx teochew-people-skill --codex",
    "npx teochew-people-skill --claude",
    "(examples/showcase-article.md)",
    "(examples/showcase-video.md)",
    "assets/yingge-epic.png",
    "原创编辑视觉，非具体演出现场",
    "assets/letter-to-grandma-hero.png",
    "(examples/letter-to-grandma-feature.md)",
    "(examples/letter-to-grandma-video-scripts.md)",
    "(examples/video-to-wiki-demo.md)",
    "(skills/teochew-people-skill/operations/media-ingest.md)",
    "README.zh-Hant.md",
    "README.en.md",
    "README.ja.md",
    "actions/workflows/ci.yml/badge.svg",
    "img.shields.io/npm/v/teochew-people-skill",
    "Node.js-%3E%3D18",
    "License-MIT",
    "Wiki-55_sources",
    "Topics-50",
    "Languages-4",
    "自进化",
    "个性化",
    "越用越好用"
)) {
    if ($readme -notmatch [regex]::Escape($term)) {
        Fail "README 应包含 '$term'"
    }
}

$expectedReadmeSections = @(
    "为什么它不是普通资料合集",
    "它如何持续成长",
    "为写作和视频生产准备的知识",
    "知识如何保持全面和客观",
    "个性化如何工作",
    "快速安装",
    "使用示例",
    "知识结构",
    "贡献资料与主题页",
    "验证、版本与许可证"
)
$actualReadmeSections = @([regex]::Matches($readme, '(?m)^## (.+?)\r?$') | ForEach-Object { $_.Groups[1].Value })
if ($actualReadmeSections.Count -ne $expectedReadmeSections.Count) {
    Fail "README 应且仅应包含 $($expectedReadmeSections.Count) 个规定的 H2 章节"
}
for ($i = 0; $i -lt $expectedReadmeSections.Count; $i++) {
    if ($actualReadmeSections[$i] -ne $expectedReadmeSections[$i]) {
        Fail "README 第 $($i + 1) 个 H2 应为 '$($expectedReadmeSections[$i])'"
    }
}

if ($readme -notmatch '(?s)^!\[TEOCHEW PEOPLE\]\(assets/social-preview\.png\)\r?\n\r?\n[^\r\n]+\r?\n\r?\n<p align="center">.+?</p>\r?\n\r?\n<p align="center">.+?</p>\r?\n\r?\n## 为什么它不是普通资料合集') {
    Fail "README 顶部必须依次包含 social preview、一段产品定义、徽章、语言切换和规定章节"
}

$localizedReadmes = @(
    @{ Path = $readmeTraditionalFile; Label = "繁體中文"; Terms = @("自我演進", "個人化", "寫作與影片製作") },
    @{ Path = $readmeEnglishFile; Label = "English"; Terms = @("evolving", "personalized", "writing and video production") },
    @{ Path = $readmeJapaneseFile; Label = "日本語"; Terms = @("進化", "パーソナライズ", "文章と動画制作") }
)

foreach ($localized in $localizedReadmes) {
    $content = Get-Content -LiteralPath $localized.Path -Raw
    foreach ($term in @(
        "TEOCHEW PEOPLE",
        "README.md",
        "README.zh-Hant.md",
        "README.en.md",
        "README.ja.md",
        "assets/social-preview.png",
        "assets/yingge-epic.png",
        "assets/letter-to-grandma-hero.png",
        "npx teochew-people-skill --codex --no-vault",
        "npx teochew-people-skill --claude --no-vault",
        "npx teochew-people-skill --dest /path/to/skills --no-vault",
        "npx teochew-people-skill --codex --init-vault",
        "npx teochew-people-skill --codex --init-project /path/to/project",
        "editorial_original",
        "link_only",
        "local overlay",
        "MIT License",
        "55",
        "50",
        "9"
    ) + $localized.Terms) {
        if ($content -notmatch [regex]::Escape($term)) {
            Fail "$($localized.Label) README 应包含 '$term'"
        }
    }
}

foreach ($forbidden in @("编译过", "编译内容", "Teochew People (潮汕人) Skill")) {
    if ($readme -match [regex]::Escape($forbidden)) {
        Fail "README 不应包含旧产品表达 '$forbidden'"
    }
}

foreach ($term in @("Anthropic Skills", "mattpocock/skills", "secondsky/claude-skills", "参考的公开 skill 仓库")) {
    if ($readme -match [regex]::Escape($term)) {
        Fail "README 不应展示公开 skill 仓库参考痕迹: $term"
    }
}

if (Test-Path -LiteralPath (Join-Path $root "teochew-people-skill/SKILL.md")) {
    Fail "旧的根目录 teochew-people-skill/SKILL.md 仍存在，应只保留 skills/teochew-people-skill"
}

Write-Host "Skill 验证通过: teochew-people-skill"
