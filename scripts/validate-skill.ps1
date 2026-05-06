$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$skillDir = Join-Path $root "chaoshan-ren"
$skillFile = Join-Path $skillDir "SKILL.md"
$referenceFile = Join-Path $skillDir "references/chaoshan-customs.md"
$agentFile = Join-Path $skillDir "agents/openai.yaml"

function Fail($message) {
    Write-Error $message
    exit 1
}

if (-not (Test-Path -LiteralPath $skillFile)) {
    Fail "Missing chaoshan-ren/SKILL.md"
}

$skill = Get-Content -LiteralPath $skillFile -Raw
if ($skill -notmatch '(?s)^---\s*\r?\nname:\s*chaoshan-ren\s*\r?\ndescription:\s*(.+?)\r?\n---') {
    Fail "SKILL.md must have YAML frontmatter with name: chaoshan-ren and a description"
}

$description = $Matches[1].Trim()
if ($description.Length -lt 80) {
    Fail "SKILL.md description is too short to trigger reliably"
}

if ($skill -match '\[TODO|TODO:|Replace with|Structuring This Skill') {
    Fail "SKILL.md still contains template TODO text"
}

foreach ($path in @($referenceFile, $agentFile)) {
    if (-not (Test-Path -LiteralPath $path)) {
        Fail "Missing required file: $($path.Substring($root.Length + 1))"
    }
}

$agent = Get-Content -LiteralPath $agentFile -Raw
if ($agent -notmatch '\$chaoshan-ren') {
    Fail "agents/openai.yaml default_prompt must mention `$chaoshan-ren"
}

$reference = Get-Content -LiteralPath $referenceFile -Raw
foreach ($term in @("工夫茶", "潮剧", "英歌", "出花园", "七样羹", "营老爷", "潮州菜", "sources")) {
    if ($reference -notmatch [regex]::Escape($term)) {
        Fail "Reference file should include '$term'"
    }
}

if ($reference -match '\[TODO|TODO:') {
    Fail "Reference file still contains TODO text"
}

Write-Host "Skill validation passed: chaoshan-ren"
