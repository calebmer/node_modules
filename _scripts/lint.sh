#!/bin/bash

npm_bin=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd)/../node_modules/.bin

$npm_bin/standard lib/**/*.js
