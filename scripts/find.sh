#!/bin/bash
# find.sh
# look for the node processes

nump=`ps aux | grep node | grep -v grep | grep -vc root`
echo "Found $nump relevant process(es). PIDs:" 
ps aux | grep node | grep -v grep | grep -v root | awk '{print $2}'
