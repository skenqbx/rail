#/bin/bash
#
# Run tests for all LTS versions of node.js
#
# nvm
#   https://github.com/creationix/nvm
#
# $ git clone https://github.com/creationix/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
# $ echo "source ~/.nvm/nvm.sh" >> ~/.bashrc
#
#

source ~/.nvm/nvm.sh


declare -a versions=("0.10" "0.12" "4" "6")

for i in "${versions[@]}"
do
   echo "Testing with node v$i"
   nvm install $i
   npm i
   node_modules/.bin/mocha ./test
done
