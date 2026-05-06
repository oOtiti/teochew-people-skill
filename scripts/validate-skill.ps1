$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$skillDir = Join-Path $root "skills/chaoshan-ren"
$skillFile = Join-Path $skillDir "SKILL.md"
$agentFile = Join-Path $skillDir "agents/openai.yaml"
$referencesDir = Join-Path $skillDir "references"
$requiredReferenceFiles = @(
    "00-使用索引.md",
    "01-范围与称谓.md",
    "02-风俗礼仪.md",
    "03-节庆岁时.md",
    "04-饮食与工夫茶.md",
    "05-语言戏曲英歌工艺.md",
    "06-侨乡与社会组织.md",
    "07-写作模板与审校清单.md",
    "08-常用词库.md",
    "09-任务示例.md",
    "90-资料来源.md"
)

function Fail($message) {
    Write-Error $message
    exit 1
}

if (-not (Test-Path -LiteralPath $skillFile)) {
    Fail "缺少 skills/chaoshan-ren/SKILL.md"
}

$skill = Get-Content -LiteralPath $skillFile -Raw
if ($skill -notmatch '(?s)^---\s*\r?\nname:\s*chaoshan-ren\s*\r?\ndescription:\s*(.+?)\r?\n---') {
    Fail "SKILL.md 必须包含 name: chaoshan-ren 和 description"
}

$description = $Matches[1].Trim()
if ($description.Length -lt 120) {
    Fail "SKILL.md 的 description 太短，触发信息不足"
}

if ($skill -match '\[TODO|TODO:|Replace with|Structuring This Skill') {
    Fail "SKILL.md 仍包含模板 TODO 文本"
}

foreach ($term in @("是什么", "什么时候使用", "什么时候不要使用", "粤东", "汕头", "揭阳", "潮州")) {
    if ($skill -notmatch [regex]::Escape($term)) {
        Fail "SKILL.md 应包含 '$term'"
    }
}

foreach ($path in @($agentFile, $referencesDir)) {
    if (-not (Test-Path -LiteralPath $path)) {
        Fail "缺少必要文件: $($path.Substring($root.Length + 1))"
    }
}

foreach ($file in $requiredReferenceFiles) {
    $path = Join-Path $referencesDir $file
    if (-not (Test-Path -LiteralPath $path)) {
        Fail "缺少参考资料: skills/chaoshan-ren/references/$file"
    }
}

$agent = Get-Content -LiteralPath $agentFile -Raw
if ($agent -notmatch '\$chaoshan-ren') {
    Fail "agents/openai.yaml 的 default_prompt 必须包含 `$chaoshan-ren"
}

$reference = foreach ($file in $requiredReferenceFiles) {
    Get-Content -LiteralPath (Join-Path $referencesDir $file) -Raw
}
$referenceText = $reference -join "`n"

foreach ($term in @("粤东", "汕头", "揭阳", "潮州", "工夫茶", "潮剧", "英歌", "出花园", "七样羹", "营老爷", "侨批", "善堂", "常用词库", "任务示例", "资料来源")) {
    if ($referenceText -notmatch [regex]::Escape($term)) {
        Fail "参考资料应包含 '$term'"
    }
}

if ($referenceText -match '\[TODO|TODO:') {
    Fail "参考资料仍包含 TODO 文本"
}

if (Test-Path -LiteralPath (Join-Path $root "chaoshan-ren/SKILL.md")) {
    Fail "旧的根目录 chaoshan-ren/SKILL.md 仍存在，应只保留 skills/chaoshan-ren"
}

Write-Host "Skill 验证通过: chaoshan-ren"
