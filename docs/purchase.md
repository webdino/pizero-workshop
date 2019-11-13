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
  - **WiFi 対応モデルは W または WH** であることに注意。
  - OMRON 環境センサーなど Bluetooth や USB で通信するセンサーを利用する場合は GPIO ピンヘッダのないモデル (W) で良いが、GPIO や I2C などで通信するセンサーを利用する場合はピンヘッダありのモデル (WH) を用意すること
  - 購入先 (WH, Wifi 対応、ピンヘッダ付き): [Switch Science](https://www.switch-science.com/catalog/3646/), [KSY (RASPIZWHSC0065)](https://raspberry-pi.ksyic.com/main/index/pdp.id/406/pdp.open/406), [marutsu](https://www.marutsu.co.jp/pc/i/1320453/)
  - 購入先 (W, Wifi 対応、ピンヘッダ無し): [Switch Sciense](https://www.switch-science.com/catalog/3200/), [KSY (RASPI0W11)](https://raspberry-pi.ksyic.com/main/index/pdp.id/219) - 通常一度に 1 つしか購入できないことに注意
- [オフィシャル Pi Zero ケース](https://www.raspberrypi.org/products/raspberry-pi-zero-case/) - 税込 648 円
  - ケース本体、フタ 3 種類、カメラケーブル、ゴム足シールのセット。ケース無しの露出で長期間利用はあり得ないので必須
  - ピンヘッダ付モデルでは GPIO 用カバーしか使えないことには注意 (カメラを使って何かしたいときはピンヘッダ無しモデルをケースに入れることを推奨)
  - 購入先: [Switch Science](https://www.switch-science.com/catalog/3196/), [KSY (RASZEROCASE)](https://raspberry-pi.ksyic.com/main/index/pdp.id/225/pdp.open/225), [marutsu](https://www.marutsu.co.jp/pc/i/1320454/)
- micro SD カード
  - 用量は保存するデータ量に応じたものですが、価格は大差無いので 16GB 以上である程度高速なものを
  - SanDisk Ultra 16GB 変換アダプタ無し (SDSQUAR-016G-GN6MN)
    - 購入先: [あきばお〜](http://www.akibaoo.co.jp/c/item/0619659161354/), [あきばお〜 カード決済用](http://p.akibaoo.co.jp/c/item/0619659161354/), [秋葉 Direct](http://www.akibadirect.com/shopdetail/000000016811), [風見鶏](http://www.flashmemory.jp/shopdetail/000000016169/), [kakaku.com](https://kakaku.com/item/K0001162867/) etc.
  - SanDisk Ultra 16GB 変換アダプタ付き (SDSQUAR-016G-GN6MA)
    - 購入先: [あきばお〜](http://www.akibaoo.co.jp/c/item/0619659161347/), [あきばお〜 カード決済用](http://p.akibaoo.co.jp/c/item/0619659161347) etc.
  - SanDisk Extreme 32GB (他用途でも使い高速なものが欲しい場合)
    - 購入先: [あきばお〜](http://www.akibaoo.co.jp/c/item/0619659155827/) etc.
- micro SD カードリーダー - 100〜1300 円程度
  - 読み書きできれば何でも良いし PC に付属していれば不要
  - micro USB 端子もスマホ対応リーダーなどを使えば PC ナシでのワークショップも可能 (テキストエディタのインストールは必要)
  - 購入先:
    - [100 均の USB2.0 カードリーダーでも十分](https://tech.nikkeibp.co.jp/atcl/nxt/column/18/00424/101000004/)
    - [エレコム カードリーダー (Amazon)](https://www.amazon.co.jp/dp/B01NBHK133/) - メーカー製のものでも 500 円前後である例
    - [キングストン MobileLite G4 カードリーダー (Amazon)](https://www.amazon.co.jp/gp/product/B00KX4TORI/) - 1300 円程度、SD イメージ作成などで高速なものが欲しい場合はこちらが比較的安価でオススメ
- USB 電源 AC アダプタ + micro USB ケーブル - 500 円程度 + 100 円程度
  - Raspberry Pi Zero への給電用 AC アダプターと設置箇所に合わた配線に必要な長さのケーブル
  - スマートフォン向けなどの一般的な AC アダプターや 24 時間稼働している USB 出力ポートのある PC などでも利用可能
  - OMRON センサーへの給電に使うことも出来るが直接刺すと AC アダプターの熱でセンサーの値が不正確になるため注意
  - 購入先:
    - microUSB 給電ケーブルは 100 均のものでも大丈夫です (給電だけに使う場合は通信非対応でもよい)
    -[エレコム USB 充電器 (Amazon)](https://www.amazon.co.jp/dp/B01M073QDM/) (何でも良いが執筆時に送料無料で安かった例)
- microUSB - USB 変換アダプタまたは USB 電源 - 100〜数百円
  - OMRON 環境センサーに Raspberry Pi Zero から給電する場合に micro USB から給電できるアダプターかケーブルを用意する
  - Raspberry Pi Zero とは USB ではなく BLE で無線通信するため USB 電源とケーブルを OMRON センサー用に別途用意する場合は不要
  - 購入先: [ノーブランド OTG ケーブル (Amazon)](https://www.amazon.co.jp/dp/B0074D3QCK/), [ノーブランド OTG ケーブル x10 (Amazon)](https://www.amazon.co.jp/dp/B07WYYSRN3/), [超小型変換アダプタ x5 (Amazon)](https://www.amazon.co.jp/gp/product/B01GFOOXO8/) など

注意: "Pi Zero WH Official Simple Kit" というボード本体・ケースの他に USB 変換ケーブルと mini HDMI 変換アダプターが同梱されているセットが 3000 円程度で販売されているが、USB 変換ケーブルの出来が非常に悪く、OMRON 環境センサーを刺したらほぼ確実にピンが曲がり壊れるため使わないこと。最悪、Raspberry Pi Zero 本体やセンサーが故障します。

### OMRON 環境センサー利用時

企業でも利用できる環境センサーとしては OMRON のものが比較的安価でしっかりしているのでオススメ (本ワークショップでメインに採用)

- OMRON 環境センサー 2JCIE-BU01 (12,600〜14,000 円)
  - [製品紹介ページ](https://www.omron.co.jp/ecb/product-detail?partNumber=2JCIE-BU)
  - 気温、湿度、照度、気圧、騒音、二酸化炭素濃度、総揮発性有機化合物濃度等が取得できる
  - 動作モードを切り替えれば 3 軸加速度が使えたり不快指数、熱中症警戒度、振動情報（地震回数、振動回数、SI 値）を算出したものも得られる (本ワークショップでは扱っていない)
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

### ディスプレイ (オプション)

小型の Raspberry Pi 向けディスプレイを繋いでブラウザをフル画面表示すれば現在のセンサーの値を表示しつつ、背景色の変化で通知が可能。インストール方法は [Web Agent のドキュメント](usage/web-agent.md) を参照してください。

ディスプレイとそれを接続するためのケーブル一式に追加で必要な機材:

| 機材                      | 価格 (最低限の機材の参考値) |
| ------------------------- | --------------------------- |
| HDMI ディスプレイ         | 2660 円                     |
| HDMI - HDMI mini ケーブル | 130 円                      |
| 合計                      | 2880 円                     |

#### HDMI ディスプレイ

3.5 インチ 480x320 が多くある。音声出力端子があるとスピーカーに出力可能。

- 3.5inch 480x320 モデルの購入先: [Amazon](https://www.amazon.co.jp/dp/B07VSB4TS2/), [Amazon (ケース付き)](https://www.amazon.co.jp/dp/B07TXTSJBY/), [AliExpress](https://ja.aliexpress.com/item/32818537950.html)
- 4.0inch 800x480 モデルの購入先: [AliExpress](https://ja.aliexpress.com/item/33057280844.html)
  - 4.0inch はデフォルト縦長方向であることには注意

#### HDMI - HDMI mini ケーブル

Raspberry Pi Zero の場合、HDMI mini 端子なので、HDMI - HDMI mini ケーブルが必要。HDMI - HDMI mini 変換アダプターと HDMI - HDMI ケーブルのセットでも代替可能。L 字ケーブル類は隣の端子と干渉することが多いので要注意

- HDMI - HDMI mini ケーブルの購入先: [AliExpress](https://ja.aliexpress.com/item/32519099637.html), [Amazon (エレコム)](https://www.amazon.co.jp/dp/B00HQY7W22/)
- FPV タイプのケーブル購入先: [AliExpress](https://ja.aliexpress.com/item/32982250238.html)
  - 価格を気にせず綺麗にするのには良いが USB ケーブルなどとの干渉に要注意

### スピーカー (オプション)

スピーカー、HDMI ディスプレイ (または、音声出力可能な USB デバイス)を接続すれば、現在のセンサーの値を音声で読み上げることが可能。インストール方法は [Speech Agent のドキュメント](usage/speech-agent.md) を参照してください。

スピーカーとそれを接続するためのケーブル一式に追加で必要な機材:

| 機材                                     | 価格 (最低限の機材の参考値) |
| ---------------------------------------- | --------------------------- |
| ダイソー USB ミニスピーカー              | 330 円                      |
| 電源二股ケーブル                         | 141 円                      |
| 合計                                     | 471 円                     |

##### USB 給電式スピーカー

- ダイソー USB ミニスピーカー (オススメ)
  - USB 給電で動作する Φ3.5mm オーディオミニプラグ入力のスピーカー。300 円と安価だが音量も十分 (調整可)
- Amazon でも 1000 円以下のスピーカーは複数あり: [Amazon (ノーブランド)](https://www.amazon.co.jp/dp/B07XQHRCS9/), [Amazon (iBUFFALO)](https://www.amazon.co.jp/dp/B01JI045RQ/), [Amazon (ノーブランド)](https://www.amazon.co.jp/dp/B079ZVK9LP/)

#### USB 電源二股ケーブルまたはハブ

Raspberry Pi Zero からは USB 出力が一つしか無く、OMRON 環境センサーと USB スピーカーの両方に給電するには必要。乾電池式のスピーカーの場合は不要。モバイルバッテリー、USB ハブ、給電分岐ケーブルでも代替可能。

- 電源二股ケーブル: [Amazon](https://www.amazon.co.jp/dp/B076CCM9LP)
- USB 2.0 ハブ [AliExpress (3 ポート)](https://ja.aliexpress.com/item/33034957047.html) 安価・小型でオススメ
- USB 3.0 ハブ: [AliExpress (3ポート)](https://ja.aliexpress.com/item/4000077505184.html), [AliExpress (2 ポート)](https://ja.aliexpress.com/item/4000030666712.html)
- 電源専用 USB 2 又アダプタ: [AliExpress](https://ja.aliexpress.com/item/33019197633.html)

#### オーディオ端子付き HDMI VGA 変換ケーブル

多くの場合、HDMI ディスプレイにオーディオ出力端子があるので、その場合不要。あるいは、 USB オーディオ変換アダプタで代替可能。

- HDMI VGA 変換ケーブル: [Amazon](https://www.amazon.co.jp/dp/B07Y1R7GDN/)
