/**
 * 画面再描画間隔(ms)
 */
var DROW_INTERVAL = 200;
/*
 * canvasの背面に描画される1セルあたりの幅・高さ。
 * 値を変更してもグラフには影響しない
 */
var CANVAS_CELL_LENGTH = 40;
/**
 * キャンバス(心電描画エリア)のサイズ変更フラグ
 * true: 固定
 * false : 非固定(可変)
 */
var CANVAS_FIXING = false;
/**
 * CANVAS_FIXING == true非固定(可変)の時の画面のwidthの割合
 * 小数点で指定する(例:0.7の場合画面の70%)
 * 1以下を設定する
 */
var CANVAS_WIDTH_PER = 0.9;
/**
 * CANVAS_FIXING == true非固定(可変)の時の画面のheightの割合
 * 小数点で指定する(例:0.5の場合画面の50%)
 */
var CANVAS_HEIGHT_PER = 0.9;
/**
 * データ間の移動ピクセル数(Default:1)
 * ※ X軸の表示データ数 = (canvasWidth / DATA_INTERVAL_WIDTH)
 */
var DATA_INTERVAL_WIDTH = 1;
/**
 * canvas-Width
 * CANVAS_FIXING == falseの場合、変動する
 */
var canvasWidth = 600;
/**
 * canvas-Height
 * CANVAS_FIXING == falseの場合、変動する
 */
var canvasHeight = 300;
/**
 * 最大描画データ保持数(Full HD = 1980,4K = 3960)
 */
var MAX_DATA_SIZE = (3960 / DATA_INTERVAL_WIDTH);
/** 画面に描画するECG生データの最低値の絶対値(MAX:2048) */
var ECG_LOW_LIMIT = 350;
/** 画面に描画するECG生データの最高値の絶対値(MAX:2047) */
var ECG_HIGHT_LIMIT = 500;
/**
 * 1Gあたりを0とするための定数
 */
var ZERO_G = 110;
/**
 * ECGの生データを格納
 * 最大格納データ数は'MAX_DATA_SIZE'となる。
 */
var ecgData;
/** canvasのcontext */
var context;

/** ECGデータ退避エリア */
function EcgStack() {
    this._a = new Array();
};
/**
 * ECGから来たデータを格納する。
 * 引数oはECGデータの1行分の文字列(改行記号なし)
 */
EcgStack.prototype.push = function(o) {
    var owk = o;
    // データ保持数が最大だったら一番古いデータを捨てる
    if (this._a.length > MAX_DATA_SIZE) {
        this._a.splice(0, 1);
    }
    // データを格納する
    this._a.push(o);
};
/**
 * 保持しているECGデータを返す。
 */
EcgStack.prototype.get = function() {
    return this._a;
};
ecgData = new EcgStack();

window_load();
window.onresize = window_load;

/**
 * windowsリサイズイベント.
 * canvasを画面サイズに合わせる。
 */
function window_load() {
    // Canvasサイズが可変だった場合
    if (!CANVAS_FIXING) {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        // 方眼紙のように四角が収まるようにする
        canvasWidth = Math.floor((Math.floor(canvasWidth * CANVAS_WIDTH_PER)) / CANVAS_CELL_LENGTH) * CANVAS_CELL_LENGTH;
        canvasHeight = Math.floor((Math.floor(canvasHeight * CANVAS_HEIGHT_PER)) / CANVAS_CELL_LENGTH) * CANVAS_CELL_LENGTH;
    }
    var elem = document.getElementById('myCanvas');
    elem.setAttribute("width", canvasWidth.toString());
    elem.setAttribute("height", canvasHeight.toString());
}

/**
 * 初期処理.
 */
function init() {
    context = myCanvas.getContext('2d');
    context.fillStyle = "#FF0";
    context.fill();
}

/**
 * Canvasライン描画.
 * 記載例:[X座標,Y座標]
 * [x1,y1]から[x2,y2]までの線を引く
 */
function drawLine(x1, y1, x2, y2, color, lineWidth) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = color;
    if (lineWidth === undefined) lineWidth = 0.2; // IE-ES6対応
    context.lineWidth = lineWidth;
    context.stroke();
}

/**
 * CanvasECGライン描画.
 * y1,y2は1行分のECGデータ(csv形式)を渡す
 * ECGデータフォーマット：count:int,ecg:int,加速度1:int,加速度2:int,加速度3:int
 */
function drawLineEcg(x1, y1, x2, y2, color) {
    var wy1 = y1.split(',');
    var wy2 = y2.split(',');
    // ECG draw
    var ecg_y1 = drowFormatEcgY(wy1[1], ECG_LOW_LIMIT, ECG_HIGHT_LIMIT);
    var ecg_y2 = drowFormatEcgY(wy2[1], ECG_LOW_LIMIT, ECG_HIGHT_LIMIT);
    drawLine(x1, ecg_y1, x2, ecg_y2, "#222", 1);

    // 重力
    var g_y1 = drowFormatEcgY(wy1[2] - ZERO_G, 300, 300);
    var g_y2 = drowFormatEcgY(wy2[2] - ZERO_G, 300, 300);
    drawLine(x1, g_y1, x2, g_y2, "#BABBDA", 1);

    // 横
    var g_s1 = drowFormatEcgY(wy1[3], 300, 300);
    var g_s2 = drowFormatEcgY(wy2[3], 300, 300);
    drawLine(x1, g_s1, x2, g_s2, "#CAFBDA", 1);

    // 縦
    var g_t1 = drowFormatEcgY(wy1[4], 300, 300);
    var g_t2 = drowFormatEcgY(wy2[4], 300, 300);
    drawLine(x1, g_t1, x2, g_t2, "#FBDAE7", 1);
}

/**
 * 描画するY座標を返す.
 * yの値の最小値がlow、最大値がhightとした場合の現在のcanvasの高さから換算した値を返す。
 * 備考:
 *   ECGデータ理論データ範囲は-2048～＋2047だが、安静時の人間では-500～+500ぐらいまでに収まる可能性があるため
 */
function drowFormatEcgY(y, low, hight) {
    var rtny;
    rtny = y - 0;
    rtny = rtny + low;
    if (rtny <= 0) {
        rtny = 0;
    }
    var alg = canvasHeight / (low + hight);
    rtny = (rtny * alg);
    rtny = canvasHeight - rtny;
    return rtny.toString();
}

/**
 * ecgData(socketから受信・退避したデータ)を元に画面サイズに合わせて描画する
 */
function ecgDrow() {
    var mEcg = ecgData.get(); // 自分のデータ部分をそのままコピーする。
    var viewMaxCnt = canvasWidth / DATA_INTERVAL_WIDTH;
    var lastx = 0;
    var lasty = '0,0,0,0,0,0,0'; // 始めだけのデータ
    cleareData();
    // 描画エリア分のデータが存在しない場合
    if (viewMaxCnt > mEcg.length) {
        lasty = mEcg[0];
        for (var i = 1; i < mEcg.length; i++) {
            var p = i * DATA_INTERVAL_WIDTH;
            drawLineEcg(lastx, lasty, p, mEcg[i]);
            lastx = p;
            lasty = mEcg[i];
        }
    } else {
        // 描画エリア分以上のデータが存在した場合、画面をシークし描画する
        var ecgStartLen = mEcg.length - viewMaxCnt;
        lasty = mEcg[mEcg.length - viewMaxCnt];
        for (var i = 0; i < viewMaxCnt; i++) {
            var p = i * DATA_INTERVAL_WIDTH;
            drawLineEcg(lastx, lasty, p, mEcg[ecgStartLen]);
            lastx = p;
            lasty = mEcg[ecgStartLen];
            ecgStartLen++;
        }
    }
}

/**
 * canvasのフォーマットを行う
 */
function cleareData() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    // 縦線
    for (i = CANVAS_CELL_LENGTH; i < canvasWidth; i += CANVAS_CELL_LENGTH) {
        drawLine(i, 0, i, canvasHeight, "#CCC");
    }
    // 横線
    for (i = CANVAS_CELL_LENGTH; i < canvasHeight; i += CANVAS_CELL_LENGTH) {
        drawLine(0, i, canvasWidth, i, "#CCC");
    }
}

/**
 * canvasの描画間隔の設定
 */
setInterval(ecgDrow, DROW_INTERVAL);
init();

// -- socket.io
var socket = io();
socket.on('connect', function() {});
// socket受信データの残骸部分(tcp通信のため、末尾データがきれいに1行分こない場合があるため)
var dastData = [];
socket.on('data', function(data) {
    var wk = data.toString().split('\r\n');

    var lastDast = null;
    if (wk.length === 0) {
        return;
    }

    // TCP通信+callback方式のため行単位では受信されない。
    // 今回受信した先頭データと前回の末尾データを連結させてる。
    // 正常データ(カンマ数で確認)の場合、データを格納する
    if ((wk[0].split(',').length - 1) !== 5) {
        // 前回の退避データの末尾と、最新データの先頭行を連結
        var ddata = dastData.pop() + wk.shift();
        // カンマの数が5個だったら正常に連結ができたとみなして退避
        if ((ddata.split(',').length - 1) === 5) {
            dastData.push(ddata);
        }
    }

    // かならず1行のはずだがループさせる
    for (var i = 0; i < dastData.length; i++) {
        ecgData.push(dastData[i].toString());
    }

    // 受信したデータの最下行のデータが不足している場合、退避させる
    var lastwk = wk[wk.length - 1];
    if (lastwk.length !== 0) {
        if ((lastwk.split(',').length - 1) !== 5) {
            dastData.push(wk.pop());
        }
    }

    // 受信したデータを退避させる - 普通は最終行の1行しか残っていないがループで処理する
    for (var i = 0; i < wk.length; i++) {
        // 綺麗なデータだと最終行が改行になるため、splitすると空データ(正常)になる。
        if (wk[i] === '') {
            continue;
        }
        ecgData.push(wk[i]);
    }
});

socket.on('disconnect', function() {});
var saveFlg = false;
var saveData = '';
