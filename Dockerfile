FROM ubuntu:16.04
MAINTAINER Hemanshu <Hemanshu@futurecities.catapult.org.uk>
RUN apt-get update && apt-get -y install sudo
RUN apt-get install -y libpq-dev python-dev libxml2-dev libxslt1-dev libldap2-dev libsasl2-dev libffi-dev
RUN apt-get install -y python3 python3-dev python3-pip
COPY Analytics/requirements.txt /
RUN sudo apt-get update && apt-get -y install postgresql postgresql-client postgresql-contrib
RUN pip3 install -r /requirements.txt
USER postgres
RUN    /etc/init.d/postgresql start &&\
    psql --command "CREATE USER root WITH SUPERUSER PASSWORD 'root';" &&\
    createdb -O root test_analytics
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/9.5/main/pg_hba.conf
USER root

