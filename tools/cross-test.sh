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

source ~/.nvm/nvm.sh

nvm install iojs
node_modules/.bin/_mocha ./test

nvm install 0.12.2
node_modules/.bin/_mocha ./test

nvm install 0.10.38
node_modules/.bin/_mocha ./test
