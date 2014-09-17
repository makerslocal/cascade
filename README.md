[![Code Climate](https://codeclimate.com/github/makerslocal/cascade.png)](https://codeclimate.com/github/makerslocal/cascade)

cascade
=======

Cash Caching Automaton, Deluxe Edition


## Install Raspbian

1. Download latest Wheezy 

	```
	http://downloads.raspberrypi.org/raspbian_latest
	```
2. Write to sd card

	```
	$ sudo dd if=raspbian.img of=/dev/SDDISK bs=1m
	```
	
## Update Raspbian

1. ssh into our pi -- the default user:pass is `pi:raspberry`
3. `sudo raspi-config` -> `Expand Filesystem` -> `Finish` & reboot
4. After rebooting, ssh into our pi
5. `sudo raspi-config` -> `Advanced Options` -> `Update` -> Finish

## Libnfc conf
```
$ sudo cp contrib/libnfc/pn532_uart_on_rpi.conf.sample /etc/nfc/devices.d/pn532_uart_on_rpi.conf
$ echo "allow_intrusive_scan = true" >> /etc/nfc/device.d/pn532_uart_on_rpi.conf
```

## edit /etc/inittab
Comment out 
```
T0:23:respawn:/sbin/getty -L ttyAMA0 115200 vt100
```

## Pre-reqs

```
sudo apt-get install build-essential 
```

```
$ cd /tmp
$ wget http://dl.bintray.com/nfc-tools/sources/libnfc-1.7.1.tar.bz2
$ tar -xvjf libnfc-1.7.1.tar.bz2
$ cd libnfc-1.7.1/
$ ./configure --with-drivers=pn532_uart --sysconfdir=/etc --prefix=/usr
$ make
$ sudo make install
```