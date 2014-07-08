#!/bin/bash

sudo apt-get update
sudo apt-get install -y build-essential sqlite3 libudev-dev

sudo wget http://node-arm.herokuapp.com/node_latest_armhf.deb && sudo dpkg -i node_latest_armhf.deb

npm install --sqlite=/usr/bin