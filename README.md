

# Book Review App

書籍タイトルと感想文を記録・検索・編集・削除できるフルスタックWebアプリです。

## 構成
- クライアント: React + Vite + Nginx（`/`）
- サーバ: Java (Spring Boot) + PostgreSQL（`/server`）
- DB: PostgreSQL
- インフラ: Docker, Kubernetes
- CI/CD: DockerHub, GitHub

## 主な機能
- 書籍タイトル・感想文の登録/一覧/編集/削除（CRUD）
- 検索（タイトル・感想文の全文検索）
- 登録日時・更新日時の自動記録・表示
- 一覧は更新日時/登録日時の降順で自動ソート
- レスポンシブUI（スマホ・PC両対応、横スクロールなし）
- すべての操作ボタンはreact-iconsで統一
- 編集・削除・保存・キャンセルはアイコンボタン

## 画面イメージ
![screenshot](public/vite.svg) <!-- 必要に応じて実際のスクリーンショットに差し替えてください -->

## セットアップ（ローカル開発）

### クライアント
```sh
cd book-review-app
npm install
npm run dev
```
アクセス: http://localhost:5173

### サーバ
```sh
cd book-review-app/server
./mvnw spring-boot:run
```
API: http://localhost:8080

### DB
PostgreSQL（docker/k8sで自動起動）

## Docker/Kubernetes運用

### 1. Dockerイメージのビルド＆プッシュ
```sh
# クライアント
docker build -t masapath/book-review-client:latest -f Dockerfile .
docker push masapath/book-review-client:latest
# サーバ
cd server
docker build -t masapath/book-review-server:latest -f Dockerfile .
docker push masapath/book-review-server:latest
```

### 2. Kubernetesデプロイ
```sh
# DB
kubectl apply -f k8s-postgres.yaml
# サーバ
kubectl apply -f server/k8s-server.yaml
# クライアント
kubectl apply -f k8s-client.yaml
```

### 3. ロールアウト更新
```sh
kubectl rollout restart -f k8s-client.yaml
kubectl rollout restart -f server/k8s-server.yaml
```

### 4. アクセス方法
- クライアント: `http://localhost:30080`（NodePort）
- サーバAPI: クライアントから `/api/reviews` で呼び出し

## GitHub/DockerHub
- GitHub: https://github.com/matataka/book-review-app.git
- DockerHub: masapath/book-review-client, masapath/book-review-server

## その他
- UI/UX・スマホ対応・Kubernetes運用・CI/CD・DB永続化などご要望に応じて随時改善中

---
ご質問・要望はIssueまたはPRでどうぞ。
