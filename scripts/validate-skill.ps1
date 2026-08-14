$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$skillDir = Join-Path $root "skills/teochew-people-skill"
$skillFile = Join-Path $skillDir "SKILL.md"
$agentFile = Join-Path $skillDir "agents/openai.yaml"
$packageFile = Join-Path $root "package.json"
$installScript = Join-Path $root "scripts/install-skill.mjs"
$readmeFile = Join-Path $root "README.md"
$licenseFile = Join-Path $root "LICENSE"
$contributingFile = Join-Path $root "CONTRIBUTING.md"
$exampleFile = Join-Path $root "examples/before-after.md"
$caseDemoFile = Join-Path $root "assets/case-demo.svg"
$requiredSkillFiles = @(
    "wiki-purpose.md",
    "wiki-schema.md",
    "wiki-log.md",
    "agents/openai.yaml",
    "operations/ingest.md",
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

foreach ($path in @($packageFile, $installScript, $readmeFile, $licenseFile, $contributingFile, $exampleFile, $caseDemoFile)) {
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

if (-not $package.bin.'teochew-people-skill') {
    Fail "package.json 应提供 teochew-people-skill 命令"
}

$installer = Get-Content -LiteralPath $installScript -Raw
foreach ($term in @("--codex", "--claude", "--dest", "--force", "skills", "teochew-people-skill")) {
    if ($installer -notmatch [regex]::Escape($term)) {
        Fail "安装脚本应包含 '$term'"
    }
}

$readme = Get-Content -LiteralPath $readmeFile -Raw
foreach ($term in @("Teochew People (潮汕人) Skill", "assets/case-demo.svg", "名字怎么理解", "一个具体案例", "给阿嬷的情书", "为什么值得用", "快速安装", "使用示例", "效果预览", "npx teochew-people-skill --codex", "npx teochew-people-skill --claude")) {
    if ($readme -notmatch [regex]::Escape($term)) {
        Fail "README 应包含 '$term'"
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
