RF-ECG WEB Viewer
====

RF-ECG WEB Viewerは[RF-ECG IoT Bridge](http://gm3.jp)のサーバ版サンプルプログラムです。  
デスクトップ版は[RF-ECG WEB Viewer](http://gm3.jp)となります。  

必要構成、データの流れとしては  
ECG → 中継器 → Wifiルータ → PC となります。

Wifiルータ、PCは別途ご用意ください。

当システムはnode.js v6.4.0にて動作確認を行っています。  
また、ソース一式はworkspaceディレクトリに入っています。

## To Use

[Git](https://git-scm.com)、[Node.js](https://nodejs.org/en/download/)がインストールされたPCが必要です。  
コマンドラインから以下の入力します。

```bash
git clone xxxxxxxxxxxxxxxxxxx/rfecg_web.git
cd rfecg_web
npm install && npm start
```

Docker環境がない場合でシステムを実行したい場合、node.jsが入っている環境が必要になります。  
node.jsは[https://nodejs.org](https://nodejs.org)よりダウンロードすることができます。  
node.jsインストール後、コンソールにてworkspaceディレクトリに移動し以下のコマンドを実行することによりシステムを起動することができます。

    npm install
    npm start

## Dockerでのシステム起動

Dockerがある環境ではQuickstart手順からサーバーを立ち上げることができます。

    docker build . -t whrv
    docker run -d -p 8080:8080 -p 50001:50001 whrv

## ECGデータを受信する表示する

前提：ローカルもしくはDockerにてシステムを起動していること

* ローカルもしくはDockerのIPを確認し、IPアドレスを中継器に設定します。  
* ECGを胸に張り、電源を入れてます。  
* 中継器の電源を入れます。  
* PCまたはスマートフォンなどからブラウザで http://IPアドレス:8080 にアクセスします。
* ECGのグラフが画面に表示されます。

## 動作しない場合

### 中継器の設定を再設定

中継器の設定が間違っている可能性があります。再度設定を行ってください。

### ファイアーウォールの無効化

PCのファイアーウォールによりECGデータがはじかれる場合があります。その場合、使用しているポートを例外(はじかない)設定をしてください。  
また、一時的にPCのファイアーウォールを無効、アンチウィルスソフトを無効にするなどをしてください。

## ECGデータのフォーマット

ECGデータのフォーマットは以下の通りになります。

    カウンター,ECG,加速度1,加速度2,加速度3

## デフォルトで使用しているポート番号

デフォルトではWEBポートとして8080、データ受信ポートとして50001を使用しています。用途に合わせて変更を行ってください。

* WEBポート：app.tsファイルの末尾あたり

    http.listen(8080);

* データ受信ポート：app.tsファイルの末尾あたり

    espReciver.listen(50001);


