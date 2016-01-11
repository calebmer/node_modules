#!/bin/bash

bold=$(tput bold)
normal=$(tput sgr0)

if [ ! -f package.json ]; then
  echo "Current working directory is not a node package!"
  exit 1
fi

require_clean_work_tree() {
  # Update the index
  git update-index -q --ignore-submodules --refresh
  err=0

  # Disallow unstaged changes in the working tree
  if ! git diff-files --quiet --ignore-submodules --
  then
    echo >&2 "You have unstaged changes."
    git diff-files --name-status -r --ignore-submodules -- >&2
    err=1
  fi

  # Disallow uncommitted changes in the index
  if ! git diff-index --cached --quiet HEAD --ignore-submodules --
  then
    echo >&2 "Your index contains uncommitted changes."
    git diff-index --cached --name-status -r --ignore-submodules HEAD -- >&2
    err=1
  fi

  if [ $err = 1 ]
  then
    echo >&2 "Please commit or stash them."
    exit 1
  fi
}

require_clean_work_tree

curr_version=$(node -e "console.log(require('$PWD/package.json').version)")
next_version=$(node -e "console.log(require('semver').inc('$curr_version', '${1:-patch}'))")

echo "The current version is ${bold}v${curr_version}${normal} and the new version will be ${bold}v${next_version}${normal}"
read -p "Is this ok? [y/n] " -n 1 -r
echo

if [[ $REPLY =~ ^[^Yy]$ ]]
then
  echo "Ok, maybe later."
  exit 0
fi

export VERSION=$next_version

git checkout master

package-lint
package-test
package-build

node -e "var fs = require('fs'); var pkg = require('$PWD/package.json'); pkg.version = '$VERSION'; fs.writeFileSync('$PWD/package.json', JSON.stringify(pkg, null, 2) + '\n');"

npm publish

git add package.json
git commit -m "$(basename $(pwd)) v${VERSION}"
git push origin master
