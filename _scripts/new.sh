#!/bin/bash

name=$1
root=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd)/..
assets=$root/_assets
new=$root/$1

cd $root

mkdir $new || exit 1

cd $new

cp $assets/.env $new/.env
cp $assets/LICENSE $new/LICENSE
cat $assets/README.md | sed -e "s/\$1/$1/g" > $new/README.md
cat $assets/package.json | sed -e "s/\$1/$1/g" > $new/package.json
cp $assets/index.js $new/index.js
