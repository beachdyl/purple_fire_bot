#!/bin/bash
# killRestart.sh
# kill existing robo-kathryns and then restart her

pid=`ps aux | grep node | grep -v grep | grep -v root | awk '{print $2}'`
kill $pid
/srv/shared/rk/files/scripts/run.bash || /srv/shared/rk/files/run.bash
