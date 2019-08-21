## 機材手配について

本ワークショップに必要な機材と購入先をまとめます。

### Raspberry Pi Zero
まずは計測データを取得・WiFi 経由でインターネットに送信するボードが必要。

- Raspberry Pi Zero W or Raspberry Pi Zero WH
  - WiFi 対応モデルは W または WH であることに注意。
  - OMRON 環境センサーなどを利用する場合は GPIO ピンヘッダのないモデル (W) で良い
  - その他のセンサーを利用する場合はピンヘッダありのモデル (WH) を用意すること
  - 購入先 (WH, Wifi対応、ピンヘッダ付き): 1800円ちょっと
    - [Switch Science](https://www.switch-science.com/catalog/3646/)
    - [KSY (RASPIZWHSC0065 でショップ内検索)](https://raspberry-pi.ksyic.com/)
  - 購入先 (W, Wifi対応、ピンヘッダ無し): - 1300円程度
    - 通常一人 1 つしか購入できないことに注意
    - [Switch Sciense](https://www.switch-science.com/catalog/3200/)
    - [KSY (RASPI0W11 でショップ内検索)](https://raspberry-pi.ksyic.com/)
- オフィシャル Pi Zero ケース - 税込 648 円
  - ケース本体、フタ 3 種類、カメラケーブル、ゴム足シールのセット。ケース無しの露出で長期間利用はあり得ないので必須
  - ピンヘッダ付モデルでは GPIO 用カバーしか使えないことには注意 (カメラを使って何かしたいときはピンヘッダ無しモデルをケースに入れることを推奨)
  - [製品情報](https://www.raspberrypi.org/products/raspberry-pi-zero-case/)
    - [Switch Science](https://www.switch-science.com/catalog/3196/)
    - [KSY (RASZEROCASE でショップ内検索)](https://raspberry-pi.ksyic.com/)
- microUSB - USB 変換アダプタまたは USB 電源 - 100〜数百円
  - OMRON 環境センサーに Raspberry Pi Zero から直接給電する場合に必要
  - Raspberry Pi Zero とは USB ではなく BLE で無線通信するため USB 電源が別途あれば不要
  - 購入先:
    - [超小型変換アダプタ (Amazon)](https://www.amazon.co.jp/gp/product/B01GFOOXO8/)

注意: "Pi Zero WH Official Simple Kit" というボード本体・ケースの他に USB 変換ケーブルと HDMI 変換アダプターが同梱されているセットが販売されているが、USB 変換ケーブルの出来が非常に悪く、特に OMRON 環境センサーとは相性が悪く刺したらほぼ確実にピンが曲がって壊れるため非推奨です。その状態で電源を入れると最悪、Raspberry Pi Zero 本体やセンサーの故障に繋がるためご注意ください。

### OMRON 環境センサー利用時
企業でも利用できる環境センサーとしては OMRON のものが比較的安価でしっかりしているのでオススメ (本ワークショップでメインに採用)

- OMRON 環境センサー 2JCIE-BU01 (12,600〜14,000 円)
  - [製品紹介ページ](https://www.fa.omron.co.jp/products/family/3724/)
  - 気温、湿度、照度、気圧、騒音、二酸化炭素濃度、総揮発性有機化合物濃度等が取得できる
  - 動作モードを切り替えれば 3 軸加速度が使えたり不快指数、熱中症警戒度、振動情報（地震回数、振動回数、SI値）を算出したものも得られる (本ワークショップでは扱っていない)
  - 購入先: 
    - [オムロン FA ストア](https://store.fa.omron.co.jp/st/search?b5id=3724) - 公式で買うのが普通に安いが受注生産扱いで納期不明
    - [Amazon](https://www.amazon.co.jp/dp/B07NB9RHB1) - Amazon でも手軽に買える
    - [Mousur](https://www.mouser.jp/ProductDetail/Omron/2JCIE-BU01?qs=qSfuJ%252bfl%2Fd5uHxAOzS%252bn8w%3D%3D)
    - [Digi Key](https://www.digikey.jp/product-detail/ja/omron-electronics-inc-emc-div/2JCIE-BU01/Z11673-ND/9603172?utm_adgroup=&mkwid=sLrpajr1l&pcrid=317427575467&pkw=&pmt=&pdv=c&productid=9603172&&gclid=EAIaIQobChMI69Oiib2h4QIV0KuWCh2oygIwEAYYASABEgJzefD_BwE)
    - [Chip 1 Stop](https://www.chip1stop.com/product/detail?partId=OMRO-0141827&mpn=2JCIE-BU01) - 10 以上まとめ買いする場合の単価が低いが単体購入は高い注意。

### その他のセンサー利用時
扱うセンサー毎にコードを書いて対応する必要があるが、OMRON のセンサーで対応できない情報も安価に取得可能。企業で利用する場合には設置時の防塵対策などの安定性も考えて利用可能か要検討。

- Grove Baee HAT for Raspberry Pi Zero
  - [製品紹介ページ](http://wiki.seeedstudio.com/Grove_Base_Hat_for_Raspberry_Pi_Zero/)
  - Grove センサーを簡単に接続できるだけでなく ADC も搭載しておりアナログセンサーを使えるのに安価で良い
  - 購入先:
    - [秋月電子通商](http://akizukidenshi.com/catalog/g/gM-13879/)
- Grove の各種センサー
- その他のセンサー
