## 機材手配について

本ワークショップに必要な機材と購入先をまとめています。

標準的な一式は安く購入できれば合計 18000 円くらい (送料別) です:

| 機材                           | 価格     |
| ------------------------------ | -------- |
| OMRON 環境センサー 2JCIE-BU01  | 13500 円 |
| Raspberry Pi Zero WH           | 1814 円  |
| オフィシャル Pi Zero ケース    | 648 円   |
| microSD カード 16GB            | 400〜 円 |
| microSD カードリーダー         | 100〜 円 |
| USB 電源 AC アダプタ           | 500〜 円 |
| micro USB ケーブル             | 100〜 円 |
| micro USB - USB-A 変換アダプタ | 100〜 円 |


### Raspberry Pi Zero
まずは計測データを取得・WiFi 経由でインターネットに送信するボードが必要。

- Raspberry Pi Zero W or Raspberry Pi Zero WH - 1300 円程度 or 1800 円程度
  - WiFi 対応モデルは W または WH であることに注意。
  - OMRON 環境センサーなどを利用する場合は GPIO ピンヘッダのないモデル (W) で良い
  - その他のセンサーを利用する場合はピンヘッダありのモデル (WH) を用意すること
  - 購入先 (WH, Wifi対応、ピンヘッダ付き): [Switch Science](https://www.switch-science.com/catalog/3646/), [KSY (RASPIZWHSC0065)](https://raspberry-pi.ksyic.com/main/index/pdp.id/406/pdp.open/406)
  - 購入先 (W, Wifi対応、ピンヘッダ無し): [Switch Sciense](https://www.switch-science.com/catalog/3200/), [KSY (RASPI0W11)](https://raspberry-pi.ksyic.com/main/index/pdp.id/219) - 通常一度に 1 つしか購入できないことに注意
- [オフィシャル Pi Zero ケース](https://www.raspberrypi.org/products/raspberry-pi-zero-case/) - 税込 648 円
  - ケース本体、フタ 3 種類、カメラケーブル、ゴム足シールのセット。ケース無しの露出で長期間利用はあり得ないので必須
  - ピンヘッダ付モデルでは GPIO 用カバーしか使えないことには注意 (カメラを使って何かしたいときはピンヘッダ無しモデルをケースに入れることを推奨)
  - 購入先: [Switch Science](https://www.switch-science.com/catalog/3196/), [KSY (RASZEROCASE)](https://raspberry-pi.ksyic.com/main/index/pdp.id/225/pdp.open/225)
- micro SD カード
  - 用量は保存するデータ量に応じたものですが、価格は大差無いので 16GB 以上である程度高速なものを
  - SanDisk Ultra 16GB 変換アダプタ無し (SDSQUAR-016G-GN6MN)
    - 購入先: [あきばお〜](http://www.akibaoo.co.jp/c/item/0619659161354/), [あきばお〜 カード決済用](http://p.akibaoo.co.jp/c/item/0619659161354/), [風見鶏](http://www.flashmemory.jp/shopdetail/000000016169/),  [kakaku.com](https://kakaku.com/item/K0001162867/) etc.
  - SanDisk Ultra 16GB 変換アダプタ付き (SDSQUAR-016G-GN6MA)
    - 購入先:  [あきばお〜](http://www.akibaoo.co.jp/c/item/0619659161347/), [あきばお〜 カード決済用](http://p.akibaoo.co.jp/c/item/0619659161347) etc.
  - SanDisk Extreme 32GB (他用途でも使い高速なものが欲しい場合)
    - 購入先: [あきばお〜](http://www.akibaoo.co.jp/c/item/0619659155827/) etc.
- micro SD カードリーダー - 100〜1300 円程度
  - 読み書きできれば何でも良いし PC に付属していれば不要
  - micro USB 端子もスマホ対応リーダーなどを使えば PC ナシでのワークショップも可能 (テキストエディタのインストールは必要)
  - 購入先:
    - [100 均の USB2.0 カードリーダーでも問題ない](https://tech.nikkeibp.co.jp/atcl/nxt/column/18/00424/101000004/)
    - [エレコム カードリーダー (Amazon)](https://www.amazon.co.jp/dp/B01NBHK133/) - メーカー製のものでも 500 円前後である例
    - [キングストン MobileLite G4 カードリーダー (Amazon)](https://www.amazon.co.jp/gp/product/B00KX4TORI/) - 1300 円程度、SD イメージ作成などで高速なものが欲しい場合はこちらが比較的安価でオススメ
- USB 電源 AC アダプタ + micro USB ケーブル - 500 円程度 + 100 円程度
  - Raspberry Pi Zero への給電用 AC アダプターと設置箇所に合わた配線に必要な長さのケーブルです
  - スマートフォン向けなどの一般的な電源で流用可能。持っている場合は追加購入不要
  - PC などでも 24 時間電源を入れておけるものであれば電源として利用可能
  - OMRON センサーへの給電に使うことも出来るが直接刺すと AC アダプターの熱でセンサーの値がずれるので注意
  - 購入先:
    - microUSB 給電ケーブルは 100 均のものでも大丈夫です (給電だけに使う場合は通信非対応でもよい)
    -[エレコム USB 充電器 (Amazon)](https://www.amazon.co.jp/dp/B01M073QDM/) -  何でも良いが執筆時に送料無料で安かった
- microUSB - USB 変換アダプタまたは USB 電源 - 100〜数百円
  - OMRON 環境センサーに Raspberry Pi Zero から給電する場合に micro USB から給電できるアダプターかケーブルを用意する
  - Raspberry Pi Zero とは USB ではなく BLE で無線通信するため USB 電源とケーブルを OMRON センサー用に別途用意する場合は不要
  - 購入先: [超小型変換アダプタ (Amazon)](https://www.amazon.co.jp/gp/product/B01GFOOXO8/) など

注意: "Pi Zero WH Official Simple Kit" というボード本体・ケースの他に USB 変換ケーブルと HDMI 変換アダプターが同梱されているセットが 3000 円程度で販売されているが、USB 変換ケーブルの出来が非常に悪く、特に OMRON 環境センサーとは相性が悪く刺したらほぼ確実にピンが曲がって壊れるため非推奨です。その状態で電源を入れると最悪、Raspberry Pi Zero 本体やセンサーの故障に繋がるためご注意ください。

### OMRON 環境センサー利用時
企業でも利用できる環境センサーとしては OMRON のものが比較的安価でしっかりしているのでオススメ (本ワークショップでメインに採用)

- OMRON 環境センサー 2JCIE-BU01 (12,600〜14,000 円)
  - [製品紹介ページ](https://www.omron.co.jp/ecb/product-detail?partNumber=2JCIE-BU)
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
