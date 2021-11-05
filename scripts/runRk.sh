#!/bin/bash
# lowRunRk.sh
# run robokathryn in the background.
# attempts to check for running process before starting.
# outputs to log_out.txt

nump=`ps aux | grep node | grep -v grep | grep -vc root`

if [ $nump -gt 0 ]
then
	echo "This process is already running. Please stop it first to avoid problems."
else
	cd /srv/shared/rk/files
	git pull
	scripts/run.bash || ./run.bash
fi
