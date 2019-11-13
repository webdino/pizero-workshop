## Raspberry Pi Zero Workshop
Raspberry Pi Zero を利用した IoT ワークショップなどの資料置き場です

## 設定だけで出来る IoT センサーデータ収集

SD カードの設定ファイル編集だけで、IoT 環境センサーを使ってデータを収集し、クラウドサービスによるデータ可視化・監視まで可能なワークショップ資料です。
Raspberry Pi へのログイン・遠隔操作などとそのためのソフトウェアのインストールなどは一切不要です。

- SD カードの編集だけでできる IoT 環境センサーデータ収集
  - [基礎編: まずは動かしてみよう](Workshop.md)
  - [応用編: もっと便利につかってみよう](Workshop2ndPage.md)
  - [計測値を画面に表示する (webAgent)](web-agent.md)
  - [計測値を音声読み上げする (speechAgent)](speech-agent.md)

### ワークショップ運営者向け

- [機材の紹介と購入先](purchase.md)
- [Raspbian をこのワークショップ用にセットアップ](ForDevelopers/pizero-workshopForDevelopers.md)
- [清翔開智高校・鳥取城北高校でワークショップをした際に使った説明資料](https://speakerdeck.com/dynamis/pi-zero-iot-workshop-at-high-school)
  - 当日使用したものを公開用に一部編集したものです。また、当時のプログラム実装に合わせたものであり最新版では変更が必要ですが参考資料として。

## Raspberry Pi Zero で IoT センサーデータ収集

Raspberry Pi Zero で IoT 環境センサーを利用してデータをクラウドに送信するプログラムの利用手順を説明したワークショップです。
Raspberry Pi に SSH 接続するためのソフトウェアのインストールなどは必要ですが、実際の開発環境と同様の手順を学べます。

- [環境センサー (OMRON 2JCIE-BU) で取得したデータをクラウド (Ambient) に記録する](GettingStarted.md)
- [プログラムをサービス化 (自動起動) する](Daemonize.md)
- [Raspberry Pi のパスワードを変更する](ChangePassword.md)
- [環境センサーをカスタマイズする](Configure2JCIEBU01.md)
- [Raspberry Pi の Wifi 設定](WifiSettings.md)

### ワークショップ運営者向け

- [Raspberry Pi の事前セットアップ手順](Setup.md)
- [Raspberry Pi の Wifi 設定手順](SetupWifi.md)

