## はじめに

Raspberry Pi Zero を利用して安価な機材でセンサーデータを収集する IoT システムはいろいろとありますが、実際に機材手配・セットアップ・コーディングをしてクラウドにデータを収集して AI (機械学習モデル) による分析や将来予測を行うまでには相応の知識・技術と手間・コストが必要となります。

そこで、**非エンジニアが IoT を試してみる**場合は勿論、探求の授業などで**子供に IoT を体験学習させる**場合などにも使って頂けるよう、**プログラミング不要で簡単**に環境センサーなどの値を取得・記録しつつ**無償で試用可能なクラウドサービス**に送信してログデータとして蓄積したり、異常値を検知した時に通知や音声読み上げを行うシステムを用意しました。

このシステムは単に子供向け、非エンジニア向けに簡単に試せるようにしたオモチャではなく、実際に企業で導入して PoC (Proof of Concept: 概念実証) に利用可能なこと、有償・商用クラウドサービスを利用していく場合にも応用がしやすいことを念頭に用意されています。

## 特徴

- 安価
  - 安価で入手可能な機材を選定し購入先も紹介
  - 機材購入以外にサービスの月額料金などの追加コストなし
- 簡単
  - プログラミング不要
  - PC 環境側へのプログラムのインストールは不要
- 手軽
  - クラウドサービス利用時もクレジットカード登録などは不要
  - Windows, macOS, ChromeOS, Linux 全ての PC 環境で実施可能

## 利用方法

SD カードの設定ファイル編集だけで、IoT 環境センサーを使ってデータを収集し、クラウドサービスによるデータ可視化・監視まで可能なワークショップ資料です。
Raspberry Pi へのログイン・遠隔操作などとそのためのソフトウェアのインストールなどは一切不要です。

- プログラミングレス IoT 環境データ収集
  - [基本的な使い方](basic-usage.md)
    - まずは OMRON 環境センサーからセンサーデータを取得し IIJ Machinist に送信してみましょう。
  - [便利な機能とカスタマイズ](advanced-usage.md)
    - [Ambient にデータを送信する](ambient.md)
    - [計測値を画面に表示する (Web Agent の使い方)](usage/web-agent.md)
    - [計測値を音声読み上げする (Speech Agent の使い方)](usage/speech-agent.md)

### 機材の手配とセットアップ

自分で機材手配やセットアップを行う方や、この環境を利用したワークショップ運営者向けの情報です。

- [利用機材の紹介と購入先情報](purchase.md)
- [セットアップ済み Raspberry Pi Zero 用 SD Image (Google Drive)](https://drive.google.com/drive/folders/1lD7MQWp0rofRv73_3_kEUZb0ipGymSTj)
  - [Etcher](https://www.balena.io/etcher/) 等のプログラムで SD カードにイメージを焼き込むだけで利用頂けます
- [Raspbian をこのワークショップ用にセットアップ](usage/index.md)

## 参考資料・その他のメモ

- [Raspberry Pi のパスワードを変更する](change-password.md)
- [OMRON 環境センサーをカスタマイズする](configure-2jcie-bu01.md)

## 活用事例

- [「とっとりIoT推進ラボ西部プロジェクト」IoT試作体験ワークショップを開催します ～「とっとりIoT推進ラボ」産学官連携先導事例創出プロジェクト～](http://db.pref.tottori.jp/pressrelease.nsf/webview/441DD1FD54BB3814492583AD000164F8?OpenDocument)
- [鳥取県、WebDINO Japanと共同で県内教育現場を活用した IoT等先端技術人材育成プログラム開発をスタート ～「とっとりIoT推進ラボ」先端人材育成プログラム開発事業～](http://db.pref.tottori.jp/pressrelease.nsf/webview/499E4EB9C39A63C34925846D000221CA)
  - [清翔開智高校・鳥取城北高校でワークショップをした際に使った説明資料](https://speakerdeck.com/dynamis/pi-zero-iot-workshop-at-high-school) - 当日使用したものを公開用に一部編集したものです。当時のプログラム実装に合わせたものですが参考資料としてリンクしています

## お問い合わせ

こちらで紹介しているプログラム・ワークショップに関するご質問などは [WebDINO Japan のお問い合わせフォーム](https://www.webdino.org/contact/) よりお願いします。