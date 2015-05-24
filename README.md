# cloudstat

Install all required python packages on cloud instance or host that you like to monitor:

 - sudo apt-get update
 - sudo apt-get -y install python-pi
 - sudo pip install -U pip
 - sudo -H pip install Django==1.6.2
 - sudo pip install -U datautil

Start the server
 - $python manage.py runserver hostname:port
 - example: python manage.py runserver ec2-52-8-155-144.us-west-1.compute.amazonaws.com:7415

Open index.html file provided in the sb-admin direcory containing angular js (javascripts) or use the 
url:
 - http://cloudstat.cloudperf.net/

Enter hostname or IP address with port number

 - example: ec2-52-8-155-144.us-west-1.compute.amazonaws.com:7415



