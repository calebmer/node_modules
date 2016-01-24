#!/bin/bash

name=$1
root=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd)/..

cd $root/packages

mkdir $1

cd $1

$root/bin/package-init
