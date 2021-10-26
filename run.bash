#!/bin/bash
cd robo_kathryn
rm google/events.csv

node google/.
node deploy-commands.js
node .

read -p "Press enter..."