# PiZero Easy IoT

**安価で簡単に IoT を始めよう！ - Raspberry Pi Zero によるプログラミングレス IoT 環境データ収集**

## 概要

**非エンジニアが IoT を試してみる**場合は勿論、探求の授業などで**子供に IoT を体験学習させる**場合などにも使って頂けるよう、**プログラミング不要で簡単**に環境センサーなどの値を取得・記録しつつ**無償で試用可能なクラウドサービス**に送信してログデータとして蓄積したり、異常値を検知した時に通知や音声読み上げを行うシステムです。

背景や特徴などについては [ドキュメント](docs) をご覧ください。

## 特徴と利用方法

セットアップ済み SD Image を使えばすぐにでもお試し頂けます。

- [Raspberry Pi Zero 用 SD Image](https://drive.google.com/drive/folders/1lD7MQWp0rofRv73_3_kEUZb0ipGymSTj)

使い方や自分でセットアップする手順は [ドキュメント](docs) をご覧ください。

## ファイル構成

このリポジトリのファイルは以下のような構成になっています。それぞれの使い方などについて詳しくは  [ドキュメント](docs) をご覧ください。

- bootPi
  - Raspberry Pi 起動時に処理するスクリプト
- bootWifi
  - Raspberry Pi の WiFi 接続設定用スクリプト
- docs
  - ドキュメントディレクトリ (https://tottori-iot.netlify.com/ として公開)
- lib
  - bootPi, bootWifi などで使用するライブラリファイル
- log
  - センサーデータログファイルの保存先ディレクトリ
- packages
  - Web Agent, Speech Agent プログラム
- script
  - メンテナンス・試験用スクリプト
- setting
  - 設定ファイルのテンプレート
- syncLog
  - ログファイルを /boot パーティーション配下や Google Drive に同期するスクリプト