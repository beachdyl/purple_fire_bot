#!/bin/bash
cd files
rm google/events.csv
git pull hub dev
node google/.
node deploy-commands.js
node .
../updateAndRun.bash