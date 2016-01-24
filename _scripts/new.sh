#!/bin/bash

name=$1
root=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd)/..
assets=$root/_assets
cwd=$(pwd)

cd $root

mkdir $1

cd $1

cp $assets/.env $cwd/.env
cp $assets/LICENSE $cwd/LICENSE
cp -n $assets/README.md $cwd/README.md
cp -n $assets/package.json $cwd/package.json
cp -n $assets/index.js $cwd/index.js
