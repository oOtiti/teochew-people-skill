![TEOCHEW PEOPLE](assets/social-preview.png)

TEOCHEW PEOPLE は、進化し続けるパーソナライズ可能な潮汕文化 Skill／LLM Wiki です。55件の追跡可能な raw ソース、50件のトピック、9分類を公共知識基盤とし、審査済み資料で Wiki を更新します。読者層、家族内の呼称、表現上の好みは明示的な同意がある場合だけローカル層に保存され、使うほど文章と動画制作に合うようになります。ただし、一度きりの回答や私的経験を公共の事実へ自動変換することはありません。

<p align="center">
  <a href="https://github.com/oOtiti/teochew-people-skill/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/oOtiti/teochew-people-skill/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/teochew-people-skill"><img alt="npm" src="https://img.shields.io/npm/v/teochew-people-skill?logo=npm&label=npm"></a>
  <img alt="Node.js >=18" src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=nodedotjs&logoColor=white">
  <a href="LICENSE"><img alt="License MIT" src="https://img.shields.io/badge/License-MIT-f0a000.svg"></a>
  <img alt="Wiki 55 sources" src="https://img.shields.io/badge/Wiki-55_sources-136f63">
  <img alt="Topics 50" src="https://img.shields.io/badge/Topics-50-8f2d1e">
  <img alt="Languages 4" src="https://img.shields.io/badge/Languages-4-3949ab">
</p>

<p align="center">
  <a href="README.md">简体中文</a> · <a href="README.zh-Hant.md">繁體中文</a> · <a href="README.en.md">English</a> · <strong><a href="README.ja.md">日本語</a></strong>
</p>

## このプロジェクトについて

これは、資料フォルダーを丸ごとモデルへ渡す静的百科事典ではありません。[`raw/`](skills/teochew-people-skill/raw/index.md) は発行主体、日付、証拠レベル、主張できる範囲、制作向けの細部と限界を保存します。[`wiki/`](skills/teochew-people-skill/wiki/index.md) は採用済み証拠を、地域・年代・家庭差・不明点を残したまま検索可能な topic にまとめます。

| 層 | 主な内容 | 使うほど改善する仕組み |
| --- | --- | --- |
| 公共 Wiki | 地域、言語、習俗、食、芸能、移民社会、組織、現在の出来事 | 新資料は発行主体と直接性を審査してから raw／topic に追加 |
| 制御された進化 | `research → ingest → evolve → lint` | 確認済みで再利用可能な更新だけを永続化。通常の会話を自動学習しない |
| パーソナライズ | project／user local vault | 明示的に同意された読者層、例、家族内の用法、文体だけを保存 |
| コンテンツ制作 | 文章と動画制作、ナレーション、絵コンテ、画像・音・動作・物・空間・タイムコード | 同じ証拠チェーンから執筆、編集、撮影設計、レビューを派生 |

![潮汕人の英歌を表すオリジナル編集ビジュアル](assets/yingge-epic.png)

<p align="center"><sub>特定公演の写真ではありません。衣装、臉譜、動作は一つの隊や普遍的な儀礼を示しません。</sub></p>

## raw と topic を分ける理由

- `raw/` は「誰が、いつ発行し、どこまで証明できるか」に答えます。
- `wiki/` は「まず読む topic、地域差、未確認点」に答えます。
- 安定した中核事実は、直接的な A ソース1件、または独立した直接的 B ソース2件を基本とします。
- Wikipedia、百度百科、検索スニペットは手掛かりであり、中核証拠には自動昇格しません。
- `verified`、`synthesis`、`varies`、`unknown` を区別します。
- 一つの都市、村、隊、家族の例を潮汕人全体へ一般化しません。

そのため、[拜老爷](skills/teochew-people-skill/wiki/customs/拜老爷.md) と [营老爷](skills/teochew-people-skill/wiki/customs/营老爷.md) は別 topic です。[潮州古城の世界遺産申請状況](skills/teochew-people-skill/wiki/current-events/潮州古城申遗边界-2026.md) も「申請を推進」を「登録済み」とは書きません。

## Wiki が進化する方法

6つの操作が監査可能な保守チェーンを作ります。

| 操作 | 用途 | 境界 |
| --- | --- | --- |
| [ingest](skills/teochew-people-skill/operations/ingest.md) | 候補資料を採用 | 発行主体、独立性、主張範囲を先に確認 |
| [media ingest](skills/teochew-people-skill/operations/media-ingest.md) | 動画、音声、画像、家族資料 | 権利を先に判定し、必要なタイムコードだけを取得 |
| [query](skills/teochew-people-skill/operations/query.md) | 回答、執筆、校閲、制作 | index から始め、必要な raw だけを参照 |
| [research](skills/teochew-people-skill/operations/research.md) | 空白、矛盾、現在情報 | 公開時点で最新状態を再確認 |
| [evolve](skills/teochew-people-skill/operations/evolve.md) | 再利用可能な更新を永続化 | 公共事実とローカル知識を分離 |
| [lint](skills/teochew-people-skill/operations/lint.md) | 公開前検証 | フィールド、証拠、リンク、鮮度、index を検査 |

「進化」は自動的に真実を獲得するという意味ではありません。出典評価と地域境界は人間が検証できる形で決め、ツールは index と構造契約を確定的に確認します。

## 文章と動画制作のショーケース

![二世代の手、白紙の手紙、海の両岸を描いたオリジナル編集イラスト](assets/letter-to-grandma-hero.png)

<p align="center"><sub>歴史写真、映画スチル、実在する僑批の複製ではありません。</sub></p>

映画『给阿嬷的情书』のデモは、映画の登録／流通、制作者の発言、僑批アーカイブ、潮語の地域差、マレーシア／シンガポールの上映を別の証拠層として扱います。ローカルの7画像は `editorial_original` で、映画のスチル、映像、台詞、音楽をコピーしません。

- [図版付き長文「一封信，穿过海」](examples/letter-to-grandma-feature.md)：約4,100漢字、6つのビジュアル単位。
- [60秒版と約3分版の動画台本](examples/letter-to-grandma-video-scripts.md)：ナレーション、時間、ショット、音、出典、権利、現地確認項目。
- [新華社動画から Wiki への実例](examples/video-to-wiki-demo.md)：URL、必要なタイムコード、確認済み要約のみを保存し、MP4や全文書き起こしは保存しません。
- [メディアマニフェスト](assets/media-manifest.json)：ローカル画像はオリジナル編集素材。外部の映画、報道、アーカイブ資料は `link_only`。

## パーソナライズと事実の分離

知識は `<project>/.teochew-people` → `~/.teochew-people` → bundled public wiki の順で解決されます。

- project 層：一つの制作に必要な読者、例、表現制約。
- user 層：明示的に承認された文体、家族内の用法、許諾済みローカル資料。
- public 層：公開可能で出典を追跡できる共通知識。

ローカル層は揭陽の例を優先したり家族内の呼称を使ったりできますが、公共の証拠を黙って上書きできません。家族写真、手紙、録音、動画は local overlay に残し、公開、匿名公開、内部確認のみ、保存しない、のいずれかを資料ごとに選びます。

## インストール

Codex：

```bash
npx teochew-people-skill --codex --no-vault
```

Claude Code：

```bash
npx teochew-people-skill --claude --no-vault
```

任意の skills 親ディレクトリ：

```bash
npx teochew-people-skill --dest /path/to/skills --no-vault
```

パーソナライズを明示的に選んだ後だけ実行：

```bash
npx teochew-people-skill --codex --init-vault
npx teochew-people-skill --codex --init-project /path/to/project
```

npm registry にこの版がない場合：`npx github:oOtiti/teochew-people-skill --codex --no-vault`。

## 使用例

```text
$teochew-people-skill を使い、拜老爷と营老爷の違いを説明して60秒のナレーションを書いてください。各事実に topic/raw ID を付け、地域例を一般化せず、ショットを source_detail または editorial_structure と表示してください。
```

```text
$teochew-people-skill を使い、揭陽の家族向けに工夫茶の記事を書いてください。公共事実は topic/raw で検証し、この家族の用法はローカル層に限定してください。
```

編集例は [Before / After](examples/before-after.md) を参照してください。

## 知識構造

```text
skills/teochew-people-skill/
├── SKILL.md                 # 薄いルーター
├── raw/                     # 採用済み55ソースと審査台帳
├── wiki/                    # 9分類、50 topic
├── operations/              # ingest/media-ingest/query/research/evolve/lint
├── scripts/                 # index、lint、status、vault ツール
├── assets/vault-template/   # ユーザーデータを含まない私有層テンプレート
├── wiki-purpose.md
├── wiki-schema.md
└── wiki-log.md
```

## コントリビューション、検証、ライセンス

更新は source-first です。候補と採用／却下理由を `raw/source-review.md` に記録し、採用 raw を作成してから topic を更新します。[CONTRIBUTING.md](CONTRIBUTING.md) を読み、次を実行してください。

```bash
npm run wiki:index:check
npm run wiki:lint
npm run media:check
npm test
npm run pack:check
```

コードとプロジェクト内容は [MIT License](LICENSE) です。外部資料、画像、映画、音楽、公演、家族資料にはそれぞれの権利と許諾が残ります。私有 vault、project overlay、圧力テスト証拠、コピーしたメディアは npm package に含めません。
