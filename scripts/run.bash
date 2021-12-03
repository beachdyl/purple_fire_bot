#!/bin/bash
cd robo_kathryn
rm google/events.csv 2>/dev/null

node google/.
node deploy-commands.js
node .

read -p "Press enter..."