#!/bin/bash
# updateRk.sh
# git update robokathryn with provided branch. does not kill existing processes.

cd /srv/shared/rk/files
git checkout $1
git pull

