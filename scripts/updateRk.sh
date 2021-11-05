#!/bin/bash
# updateRk.sh
# git update robokathryn with provided branch. does not kill existing processes.

nump=`ps aux | grep node | grep -v grep | grep -vc root`

if [ $nump -gt 0 ]
then
	echo "A relevant process is running. Please kill it before attempting to make changes"
	echo "Try running find.sh to locate the processes"
else
	if [ $# -eq 0 ]
	then
		echo "You must specify a branch to update with"
		echo "To update using current branch and run, try run.sh"
	else
		cd /srv/shared/rk/files
		git checkout $1
		git pull
	fi
fi
