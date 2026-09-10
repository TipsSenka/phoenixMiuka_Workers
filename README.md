# phoenixMiuka_Workers

Cloudflare Workers と Pages を組み合わせた小さなデモプロジェクトです。

## 概要
- Pages で UI を公開
- Worker で API を提供
- `GET /api/course`, `/api/hello`, `/api/fortune` を返す

## 使い方

### ローカル開発

```powershell
Set-Location .\worker
npm install
npm run dev
```

ブラウザで `http://127.0.0.1:8787` を開くか、Pages 側から `http://127.0.0.1:8787` を指定して API を確認します。

### 本番デプロイ

```powershell
Set-Location .\worker
npm run deploy
```

`pages/index.html` の `workerBaseUrl` を Cloudflare にデプロイした Worker URL に更新して利用します。

## エンドポイント

- `GET /api` : ヘルスチェック
- `GET /api/course` : 講座一覧
- `GET /api/hello?name=山田` : 挨拶
- `GET /api/fortune` : 今日のメッセージ
- `GET /api/unknown` : 404
