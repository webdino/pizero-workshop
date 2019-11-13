# PiZero IoT Workshop

## 概要

Raspberry Pi Zero などを用いて安価に、プログラミングも不要で簡単に、IoT センサーデータの記録・収集を行う為のプログラムとそれを使ってワークショップを行うための資料をまとめたリポジトリです。

多数のモノから様々なセンサーデータを記録・収集し、異常値検知や将来予測などに役立てていく IoT の仕組みを学習したり、自ら試してみたい (PoC 作りに取り組みたい) 人が誰でもすぐ簡単に実践できるように、プログラミング一切不要で IoT センサーデータの記録・収集・通知が可能なようにしています。

Paspberry Pi の起動イメージを焼き込んだ SD カードファイルに含まれる設定ファイルをテキストエディタで書き換えるだけで、OMRON 環境センサーデータの取得・CSV ファイルへの記録と Machinist や Ambient といった手軽に使えるクラウドサービスへの送信、更に画面表示や音声読み上げといった手元で確認・通知などができるので、気軽にご利用ください。

## 利用方法

[セットアップ手順](docs/setup.md) に従って既存の Raspbian にインストールするか、次のセットアップ済み SD Image を使ってセットアップ済みの SD カードを用意してください。

- [Raspberry Pi Zero 用 SD Image](https://drive.google.com/drive/folders/1lD7MQWp0rofRv73_3_kEUZb0ipGymSTj)

詳しくは [使い方説明ページ](docs/usage.md) や [ワークショップ用ページ](docs/workshop.md) をご覧ください。

## ファイル構成

このリポジトリのファイルは以下のような構成になっています。詳しくは

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