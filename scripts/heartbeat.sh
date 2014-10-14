#!/bin/bash

GATEWAY=$(/sbin/ip route | awk '/default/ { print $3 }')

ping -c4 ${GATEWAY} > /dev/null

if [ $? != 0 ]
then
  ifdown --force eth0
  ifup eth0
fi