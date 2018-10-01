FROM ubuntu:18.04
MAINTAINER Hemanshu <Hemanshu@futurecities.catapult.org.uk>
RUN apt-get update && apt-get -y install sudo
RUN apt-get install -y python3 python3-dev python3-pip
COPY Analytics/requirements.txt /
RUN sudo apt-get -y install postgresql-client
RUN pip3 install -r /requirements.txt
