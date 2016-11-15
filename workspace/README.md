Dynamic RR Chart Sample
====

xxx(製品名が決まったら入れる)から送られたデータをCanvasに表示する

xxxのデータフォーマットは以下の通りとなる

    カウンター,ECG,加速度1,加速度2,加速度3

## 使用しているポート番号
* ブラウザのポート：app.tsファイルの末尾あたり(default:8080)

    http.listen(8080);


* TCPポート：app.tsファイルの末尾あたり(default:50001)

    espReciver.listen(50001);

## Usage

    npm install
    npm start

http://localhost:8080 にアクセス

