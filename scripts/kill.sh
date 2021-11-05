#!/bin/bash
# findKill.sh
# look for the node processes, then kill one

nump1=`ps aux | grep node | grep -v grep | grep -vc root`

if [ $nump1 -eq 0 ]
then
	echo "Found no relevant processes. Nothing changed."
else
	pid=`ps aux | grep node | grep -v grep | grep -v root | awk '{print $2}' | head -10`
	kill $pid
	nump2=`ps aux | grep node | grep -v grep | grep -vc root`
	echo "Killed PID $pid. $nump2 remaining relevant process(es)." 
fi
