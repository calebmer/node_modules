#!/bin/bash

if [ ! -d "test" ]; then
  exit 0
fi

npm_bin=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd)/../node_modules/.bin

$npm_bin/mocha -r babel-register test/*.test.js
