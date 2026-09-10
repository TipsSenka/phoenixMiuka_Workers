# phoenixMiuka Workers

Cloudflare Workers と Pages を組み合わせたサンプルプロジェクトです。

## 構成

- pages/index.html: Pages 上の UI
- worker/src/index.js: Workers API の実装
- worker/wrangler.toml: Worker の設定

## 使い方

### 1. Worker を起動

```powershell
Set-Location .\worker
npm install
npm run dev
```

開発時のデフォルト URL は次のようになります。

```text
http://127.0.0.1:8787
```

### 2. Pages の URL を更新

pages/index.html の Worker URL 初期値は、ローカル開発時は `http://127.0.0.1:8787` です。
本番公開時は `https://<worker-name>.<subdomain>.workers.dev` に置き換えてください。

### 3. API を確認

- GET /api
- GET /api/course
- GET /api/hello?name=Miuka
- GET /api/fortune
- GET /api/events

### 4. 本番デプロイ

```powershell
Set-Location .\worker
npm.cmd run deploy
```

デプロイ後に、Pages 側で `Worker URL` を新しい公開 URL に更新してください。

## 主要 API

### /api/course

講座一覧を返します。

### /api/hello

`name` パラメータを受け取り、挨拶メッセージを返します。

### /api/fortune

ランダムなメッセージを返します。

### /api/events

イベント情報の配列を返します。

## 変更ポイント

- Worker URL は `pages/index.html` の入力欄で切り替え可能
- CORS は簡易設定の `*` で動作させており、運用時は Pages ドメインに限定可能
- `wrangler.toml` の `name` を変更して Worker 名を反映する
