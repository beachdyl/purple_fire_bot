#!/bin/bash
# runRk.sh
# run robokathryn
# attempts to check for running process before starting.

nump=`ps aux | grep node | grep -v grep | grep -vc root`

if [ $nump -gt 0 ]
then
	echo "This process is already running. Please stop it first (such as with kill.sh) to avoid problems."
else
	cd /srv/shared/rk/files
	git pull
	if [ `ls -l scripts/run.bash | awk '{print $1}'` != "-rwxrwxr--" ]
	then
		echo "Permissions need updating, allow sudo to modify perms of scrips/run.bash"
		sudo chmod 774 scripts/run.bash || echo "Permissions successfully updated"
	fi
	scripts/run.bash
fi
