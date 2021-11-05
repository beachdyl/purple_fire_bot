#!/bin/bash
# updateRk.sh
# git update robokathryn with provided branch. does not kill existing processes.

if [ $# = 0 ] then
	echo "You must specify a branch to update with"
	echo "To update using current branch and run, try run.sh"
else
	cd /srv/shared/rk/files
	git checkout $1
	git pull
fi
