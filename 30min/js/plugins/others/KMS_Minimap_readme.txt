_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
_/ RPG ツクール MV 用プラグイン
_/   - Minimap v0.1.2
_/
_/ Author     : TOMY (Kamesoft)
_/ Last update: 2017/11/19
_/
_/                  http://ytomy.sakura.ne.jp/
_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

■ 概要

画面上にミニマップを表示する機能を追加します。


■ 使用方法

1. KMS_Minimap.js を、プロジェクトの js/plugins
   フォルダにコピーしてください。

2. 同梱の img/system 下の PNG 画像を、プロジェクトの
   img/system フォルダにコピーしてください。

3. RPG ツクール MV のプラグインマネージャから
   「KMS_Minimap」を追加してください。

詳細に関しては、公式サイトを参照してください。
http://ytomy.sakura.ne.jp/tkool/rpgtech/tech_mv/map/minimap.html

  ※ URL は変更される場合があります。


■ 動作確認環境

RPG ツクール MV 1.3 以降必須

Windows 10
  - エディタテストプレイ
  - Mozilla Firefox 50.1.0
  - Google Chrome 55.0


■ 設定項目

[Map rect]
マップの表示位置とサイズをピクセル単位で指定します。
書式は
  X座標, Y座標, 幅, 高さ
です。

[Grid size]
ミニマップの 1 マスのサイズをピクセル単位で指定します。

[Blink time]
ミニマップ上のアイコンを点滅させる時間をフレーム単位で指定します。

[Foreground color]
ミニマップの通行可能領域の色を CSS カラーで指定します。

[Background color]
ミニマップの通行不可領域の色を CSS カラーで指定します。

[Mask style]
ミニマップの表示領域のマスク方法を指定します。
0: なし  1: 楕円  2: 角丸矩形  3: 六角形1  4: 六角形2

[Mask radius]
マスク方法を角丸矩形 (2) にした場合の、角の丸め具合を指定します。

