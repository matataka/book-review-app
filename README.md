
# Book Review App

このプロジェクトは、書籍と感想文を記録・管理できるWebサービスです。

## 構成
- クライアント: React + Vite（`/`）
- サーバサイド: Java (Spring Boot)（`/server`）

## 機能
- 書籍情報の登録・一覧・編集・削除
- 感想文の登録・一覧・編集・削除

## セットアップ

### クライアント
```sh
cd book-review-app
npm install
npm run dev
```

### サーバサイド
今後 `/server` ディレクトリにSpring Bootプロジェクトを作成します。

---

ご質問や追加要望があればお知らせください。

## Kubernetesデプロイ手順

### 1. Dockerイメージのビルド
（イメージ名は任意。例: bookreview-client, bookreview-server）

```sh
# クライアント
docker build -t <your-client-image> .
# サーバ
cd server
docker build -t <your-server-image> .
```

### 2. Kubernetesへデプロイ
```sh
# クライアント
kubectl apply -f k8s-client.yaml
# サーバ
kubectl apply -f server/k8s-server.yaml
```

### 3. アクセス方法
- クライアント: `NodePort` で `http://<NodeIP>:30080` にアクセス
- サーバ: クライアントから `http://bookreview-server:8080` でAPI呼び出し
