#!/bin/sh

set -e

export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;

nvm use v19.0.0
npm install
npm run build