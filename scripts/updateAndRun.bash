#!/bin/bash
cd robo_kathryn
rm google/events.csv
git pull hub main
node google/.
node deploy-commands.js
node .

read -p "Press enter..."