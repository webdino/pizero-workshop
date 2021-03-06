## Machinistのいろいろな機能をつかってみる

ここでは Machinist の機能をより詳しく説明していきます。

### グラフ表示

まず、いろいろなスタイルでグラフ表示をさせてみましょう。

Machinistの画面上部のメニューから「メトリック」にアクセスします。そして、ためしに「二酸化炭素濃度」のグラフをクリックしてみましょう。

すると、二酸化炭素濃度のグラフが表示され、その右上には「折れ線グラフ」「最新値」「現在」「CSVダウンロード」「設定」のメニューがあります。
それぞれのメニューの項目をクリックして、いろいろと試してみましょう。

さて、表示する期間についての説明をしておきます。（ある程度長期のデータが蓄積されないと、よくわからないかもしれません）

Machinistでは、蓄積されたデータのなかで、どの期間のものを選んで表示するかを選択できます。

まず、期間の幅は「最新値」「1日」「一週間」「一ヶ月」「６ヶ月」のいづれかを選択できます。そしてそれが、いつの時点を基準にしたものかを日付で指定できます。

いろいろと試してみてください。

>期間の幅が「最新値」以外の場合、とても多くのデータの描画になってしまうのをさけるために、ある程度のデータを一定期間で平均していくことでデータ数を減らした（省略した）ものが描画されるようです。したがってこの場合は、長期間の変動をおおまかに観察する用途には適していますが、瞬間的な小さい値や大きい値などは、描画に反映されない可能性があることに注意してください。

### 監視機能をつかってみる

さて、長期間データを集めるにあたって、つねにずっとグラフを観察しつづるけるわけにはいきません。

そこでIotではプログラムに監視をさせます。

今回の場合ですと、たとえば揮発性有機化合物濃度が急上昇した場合に、自動でメール通知するなどの監視をさせるのです。また、知らないうちにRaspberry Pi Zeroの電源がきれてしまっていて、データアップロードが何日も前からされていなかった、などということがないように、たとえば１５分間データアップロードがない場合には、自動でメール通知させるなどです。

前者のような監視を「しきい値監視」、後者のような監視を「死活監視」といいます。

Machinistでは、この「しきい値監視」と「死活監視」の機能を提供しています。ここからはそれらを設定してみましょう。

### しきい値監視

まず、しきい値監視です。

はじめに、「アクション」を作成します。<!-- https://app.machinist.iij.jp/action-settings -->　画面上部のメニューから「アクション」にアクセスし、さらに「＋アクションを作成する」をクリックします。

そして「タイプ」で「メール通知」を選び、つづいて「アクション名」を適当に入力して、最後に「TO」にメールアドレスを入力します。

これでアクションが作成されたので、ためしに「テスト実行」をしてみましょう。入力したメールアドレスに、Machinistからテストメールが届きましたか？

つぎに「監視」を設定します。画面上部のメニューから「監視」にアクセスし、さらに「設定」を開き「＋監視設定を作成する」をクリックします。すると「監視設定名」の入力をうながされるので適当に入力します。

これで「監視設定」が追加されましたので、「詳細を見る」をクリックして、その内容を設定していきましょう。

設定するのは「条件」と「監視対象メトリック」です。

ここでは、「メトリックを選択する」で、まず「照度」を選んでみましょう。そして「条件を追加する」で、以下のように設定してみます。

「タイプ」を「しきい値」、「演算子」を「＜」、「値」を「１００」、「値の種別」を「平均値」、「条件一致時の状態名」を「暗くなりました」、「アクション」はさきほど作成したアクションを選びます。

最後に「保存」して、さらに「設定の反映」をクリックします。

これで「しきい値監視」が設定されました。

では、ためしに環境センサーをなにかで覆って、しばらく光を閉ざしてみましょう。 (直近５分間の平均値が、設定した値を下回ったら通知する、という設定をしたので５分ぐらいやってみます。)。上手く監視設定が出来ていれば、次のような通知メールが送信されます。

```
送信者: machinist-noreply@iij.ad.jp
タイトル: "Machinist監視通知"
-----
監視状態に変化がありました
 (YYYY/MM/DD HH:MM:SS)

エージェント: xxxxxxxx
メトリック:   2JCIE-BU / 照度
タグ:         {}
状態:         未設定 -> 暗くなりました
条件:         19.0(avg) < 100.0


詳細は以下のページよりご確認ください。
https://app.machinist.iij.jp/#/metrics/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

machinist-noreply@iij.ad.jp は送信専用のメールアドレスです
```

### 死活監視

つづいては「死活監視」です。

再び「条件を追加する」で、今度は以下のように設定してみます。

「タイプ」を「死活監視」に、「メトリック投稿が途絶えてから検知するまでの時間」を「１５分」に、「条件一致時の状態名」を「データの投稿が途絶えました」、そして「アクション」はさきほど作成したアクションを選びます。

これで、１５分間データアップロードがされない場合には、自動で次のような通知メールが送信されます。

```
送信者: machinist-noreply@iij.ad.jp
タイトル: "Machinist監視通知"
-----
監視状態に変化がありました
 (YYYY/MM/DD HH:MM:SS)

エージェント: xxxxxxxx
メトリック:   2JCIE-BU / 温度
タグ:         {}
状態:         未設定 -> 計測中断！
条件:         死活監視

詳細は以下のページよりご確認ください。
https://app.machinist.iij.jp/#/metrics/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

machinist-noreply@iij.ad.jp は送信専用のメールアドレスです
```

監視機能について詳しくはサービスの説明ページをご覧ください:

- [監視設定の追加](https://machinist.iij.jp/getting-started/getting_started/monitoring.html)
- [監視設定の条件について](https://machinist.iij.jp/getting-started/spec/monitor_setting.html)

### カスタムチャートをつくってみる

Machinistでは、複数のメトリックをひとつのグラフに描画したり、グラフを外部に公開することができます。

「画面上部のメニュー」から「カスタムチャート」にアクセスし、「＋カスタムチャートを作成する」をクリックします。

「チャートの作成」が表示されるので、「チャート名」を適当に入力します。すると、「メトリックの選択」になるので、まずは「温度」と「湿度」を選択して、「保存」しましょう。

これで「温度」と「湿度」が「折れ線グラフ」で描画されました。ためしに「折れ線グラフ」の部分を「散布図」に変更してみましょう。

またグラフの上にマウスカーソルをもってくると、いろいろな情報が表示されます。

つぎに、「チャートの共有」を「有効」にして、「共有リンクを作成する」をクリックしてみましょう。すると、グラフを外部に公開するWEBのURLが作成されます。また同時にWEBサイトにグラフを埋め込むためのHTMLの埋め込みコードも作成されます。

カスタムチャートの作成のオフィシャルドキュメントは以下です。
>カスタムチャートの作成
https://machinist.iij.jp/getting-started/getting_started/custom_chart.html
