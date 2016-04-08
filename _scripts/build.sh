#!/bin/bash

if [ ! -d "src" ]; then
  exit 0
fi

npm_bin=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd)/../node_modules/.bin

$npm_bin/babel src -d lib
