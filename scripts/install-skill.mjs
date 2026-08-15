#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initVault } from "../skills/teochew-people-skill/scripts/wiki-lib.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const source = path.join(root, "skills", "teochew-people-skill");
const templateRoot = path.join(source, "assets", "vault-template");

const args = process.argv.slice(2);

function usage() {
  console.log(`Teochew People (潮汕人) Skill 安装器

用法:
  npx teochew-people-skill --codex
  npx teochew-people-skill --claude
  npx teochew-people-skill --dest <skills目录>

选项:
  --codex       安装到 Codex 个人 skills 目录，默认使用 CODEX_HOME/skills 或 ~/.codex/skills
  --claude      安装到 Claude Code 个人 skills 目录 ~/.claude/skills
  --dest <dir>  安装到自定义 skills 父目录
  --force       目标已存在时覆盖
  --init-vault  初始化全局用户 vault（默认 ~/.teochew-people）
  --vault <dir> 指定全局用户 vault 目录
  --init-project <dir>
                在指定项目中初始化 .teochew-people 覆盖层
  --no-vault    仅安装公共 skill，不初始化任何 vault
  --dry-run     只显示将要复制的位置
  --help        显示帮助
`);
}

function parseArguments(argv) {
  const options = {
    codex: false,
    claude: false,
    force: false,
    dryRun: false,
    initVault: false,
    noVault: false,
  };
  const booleanFlags = new Map([
    ["--codex", "codex"],
    ["--claude", "claude"],
    ["--force", "force"],
    ["--dry-run", "dryRun"],
    ["--init-vault", "initVault"],
    ["--no-vault", "noVault"],
  ]);
  const valueFlags = new Map([
    ["--dest", "dest"],
    ["--vault", "vault"],
    ["--init-project", "project"],
  ]);

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (booleanFlags.has(argument)) {
      options[booleanFlags.get(argument)] = true;
      continue;
    }
    if (valueFlags.has(argument)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${argument} requires a directory path`);
      options[valueFlags.get(argument)] = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown option: ${argument}`);
  }

  if (options.noVault && (options.initVault || options.project)) {
    throw new Error("--no-vault cannot be combined with --init-vault or --init-project");
  }
  return options;
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

function overlaps(left, right) {
  return isWithin(left, right) || isWithin(right, left);
}

function assertNoLinkedComponents(candidate, label) {
  const absolute = path.resolve(candidate);
  const parsed = path.parse(absolute);
  const parts = absolute.slice(parsed.root.length).split(path.sep).filter(Boolean);
  let current = parsed.root;
  for (const part of parts) {
    current = path.join(current, part);
    if (!fs.existsSync(current)) break;
    if (fs.lstatSync(current).isSymbolicLink()) {
      throw new Error(`${label} contains a symbolic link, junction, or reparse point: ${current}`);
    }
  }
}

function assertNoLinkedTree(candidate, label) {
  if (!fs.existsSync(candidate)) return;
  const stats = fs.lstatSync(candidate);
  if (stats.isSymbolicLink()) {
    throw new Error(`${label} contains a symbolic link, junction, or reparse point: ${candidate}`);
  }
  if (!stats.isDirectory()) return;
  for (const entry of fs.readdirSync(candidate, { withFileTypes: true })) {
    const child = path.join(candidate, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`${label} contains a symbolic link, junction, or reparse point: ${child}`);
    }
    if (entry.isDirectory()) assertNoLinkedTree(child, label);
  }
}

async function main() {
  if (args.includes("--help") || args.includes("-h")) {
    usage();
    return;
  }

  const options = parseArguments(args);
  if (!fs.existsSync(path.join(source, "SKILL.md"))) {
    throw new Error(`找不到 skill 源目录: ${source}`);
  }

  const parentDir = options.dest
    ? path.resolve(options.dest)
    : options.claude
      ? path.join(os.homedir(), ".claude", "skills")
      : path.join(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), "skills");
  const target = path.join(parentDir, "teochew-people-skill");
  const globalVault = options.initVault
    ? path.resolve(options.vault || path.join(os.homedir(), ".teochew-people"))
    : null;
  const projectOverlay = options.project
    ? path.join(path.resolve(options.project), ".teochew-people")
    : null;

  if (overlaps(source, target)) throw new Error("Skill source and installation target must not overlap");
  for (const [label, privateTarget] of [
    ["Global vault", globalVault],
    ["Project overlay", projectOverlay],
  ]) {
    if (privateTarget && overlaps(target, privateTarget)) {
      throw new Error(`${label} must be separate from the public skill installation target`);
    }
  }
  if (globalVault && projectOverlay && overlaps(globalVault, projectOverlay)) {
    throw new Error("Global vault and project overlay must be separate directories");
  }

  if (options.dryRun) {
    console.log(`将复制: ${source}`);
    console.log(`到: ${target}`);
    if (globalVault) console.log(`将初始化全局 vault: ${globalVault}（保留已有文件）`);
    if (projectOverlay) console.log(`将初始化项目 overlay: ${projectOverlay}（保留已有文件）`);
    return;
  }

  assertNoLinkedComponents(source, "Skill source");
  assertNoLinkedComponents(target, "Skill destination");
  if (fs.existsSync(target)) {
    if (!options.force) {
      throw new Error(`目标已存在: ${target}\n如需覆盖，请加 --force。`);
    }
    assertNoLinkedTree(target, "Skill destination");
    fs.rmSync(target, { recursive: true, force: true });
  }

  fs.mkdirSync(parentDir, { recursive: true });
  assertNoLinkedComponents(target, "Skill destination");
  fs.cpSync(source, target, { recursive: true });

  console.log(`已安装 Teochew People (潮汕人) Skill 到: ${target}`);

  if (globalVault) {
    const result = await initVault({ target: globalVault, templateRoot });
    console.log(`全局用户 vault 已就绪: ${result.target}（${result.created} 新建，${result.skipped} 保留）`);
  }
  if (projectOverlay) {
    const result = await initVault({ target: projectOverlay, templateRoot, projectOverlay: true });
    console.log(`项目 overlay 已就绪: ${result.target}（${result.created} 新建，${result.skipped} 保留）`);
  }

  console.log("Codex 中可用 $teochew-people-skill 调用；Claude Code 中可用 /teochew-people-skill 调用。");
}

main().catch((error) => {
  console.error(`安装失败: ${error.message}`);
  process.exitCode = 1;
});
