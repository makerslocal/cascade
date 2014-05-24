#!/bin/bash

sudo apt-get update &&
sudo apt-get install build-essential libsqlite3-dev libudev-dev

sudo wget http://node-arm.herokuapp.com/node_latest_armhf.deb &&
sudo dpkg -i node_latest_armhf.deb