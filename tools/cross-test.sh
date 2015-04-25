#/bin/bash
#
# Run tests for all relevant versions of io.js/node.js
#
# nvm
#   https://github.com/creationix/nvm
#
# $ git clone https://github.com/creationix/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
# $ echo "source ~/.nvm/nvm.sh" >> ~/.bashrc
#
# $ nvm install -s 0.10
# $ nvm install -s 0.12
# $ nvm install iojs
#

source ~/.nvm/nvm.sh

nvm use iojs
node_modules/.bin/_mocha ./test

nvm use 0.12
node_modules/.bin/_mocha ./test

nvm use 0.10
node_modules/.bin/_mocha ./test
