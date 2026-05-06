# 潮汕人 Skill

`chaoshan-ren` is a Codex skill for culturally grounded writing and research support around Chaoshan / Teochew customs, etiquette, festivals, foodways, language, and public-facing cultural explanation.

## Contents

- `chaoshan-ren/SKILL.md` - the skill entrypoint Codex loads after the skill triggers.
- `chaoshan-ren/references/chaoshan-customs.md` - compact domain notes and source pointers.
- `chaoshan-ren/agents/openai.yaml` - UI metadata for the skill list.
- `.githooks/pre-commit` - runs local skill validation before commits.
- `scripts/validate-skill.ps1` - dependency-free repository validation.

## Local Setup

After cloning, enable tracked hooks:

```powershell
git config core.hooksPath .githooks
```

Run validation manually:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/validate-skill.ps1
```

## Publishing Note

This repository is ready to publish as a public GitHub project, but no open-source license has been selected yet. Add a license before publishing if reuse rights should be explicit.
