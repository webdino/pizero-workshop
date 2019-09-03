#!/bin/bash

tmpfile=$(mktemp)

#echo "date,RX,RXerror,TX,TXerror"

ifconfig wlan0 |tee $tmpfile > /dev/null
RX=$(cat $tmpfile | grep 'RX packets' | awk '{print $5}')
RXe=$(cat $tmpfile | grep 'RX errors' | awk '{print $3}')
TX=$(cat $tmpfile | grep 'TX packets' | awk '{print $5}')
TXe=$(cat $tmpfile | grep 'TX errors' | awk '{print $3}')
echo $(date +"%H:%M:%S"),$RX,$RXe,$TX,$TXe
