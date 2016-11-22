RF-ECG WEB Viewer
====

RF-ECG WEB Viewerは[RF-ECG2-BR(β版)](http://gm3.jp/rf-ecg-wifi.html)のサーバ版サンプルプログラムです。  

## To Use

[Git](https://git-scm.com)、[Node.js](https://nodejs.org/en/download/)がインストールされたPCが必要です。  
コマンドラインから以下の入力します。

```bash
git clone https://github.com/GM3-co/rfecg_web_viewer.git
cd rfecg_web_viewer/workspace
npm install && npm start
```

## To Use by Docker

Dockerがある環境では以下のコマンドで実行することができます。

```bash
git clone https://github.com/GM3-co/rfecg_web_viewer.git
cd rfecg_web_viewer
docker build . -t whrv
docker run -d -p 80:80 -p 8080:8080 whrv
```

## ECGデータを受信する表示する

前提：ローカルもしくはDockerにてシステムを起動していること

* ECG-Bridgeの設定を行います。[ECG-Bridgeネットワーク設定を行う](http://gm3.jp/rf-ecg-wifi.html#bridgeSetting)
* ECGを胸に張り、電源を入れてます。  
* 中継器の電源を入れます。  
* PCまたはスマートフォンなどからブラウザで http://IPアドレス にアクセスします。
* ECGのグラフが画面に表示されます。

## 動作しない場合

### 中継器の設定を再設定

中継器の設定が間違っている可能性があります。再度設定を行ってください。

### ファイアーウォールの無効化

PCのファイアーウォールによりECGデータがはじかれる場合があります。その場合、使用しているポートを例外(はじかない)設定をしてください。  
また、一時的にPCのファイアーウォールを無効、アンチウィルスソフトを無効にするなどをしてください。

## デフォルトで使用しているポート番号

デフォルトではWEBポートとして80、データ受信ポートとして8080を使用しています。用途に合わせて変更を行ってください。

* WEBポート：app.tsファイルの末尾あたり

    http.listen(80);

* データ受信ポート：app.tsファイルの末尾あたり

    tcpServer.listen(8080);


