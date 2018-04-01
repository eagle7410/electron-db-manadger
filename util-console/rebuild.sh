#!/usr/bin/env bash

npm run pkg-win
npm run pkg-mac
npm run pkg-linux

appName="electron_password_store"
folder="/home/igor/Рабочий\ стол/projects/"$appName"/app_build"

win=$folder"/"$appName"-win32-ia32"
winZip=$win".tar.gz"

lin=$folder"/"$appName"-linux-x64"
linZip=$lin".tar.gz"

mac=$folder"/"$appName"-darwin-x64"
macZip=$mac".tar.gz"

tar -czvf $winZip $win
tar -czvf $linZip $lin
tar -czvf $macZip $mac

echo "finish build"
