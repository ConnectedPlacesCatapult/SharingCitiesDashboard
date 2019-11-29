FROM ubuntu:16.04
MAINTAINER Hemanshu <Hemanshu@futurecities.catapult.org.uk>
RUN apt-get update && apt-get -y install sudo
RUN apt-get install -y libpq-dev python-dev libxml2-dev libxslt1-dev libldap2-dev libsasl2-dev libffi-dev
RUN apt-get install -y python3 python3-dev python3-pip

COPY Analytics/requirements.txt /tmp/requirements.txt
RUN pip3 install --no-cache-dir -r /tmp/requirements.txt

# Create a Work Directory for the Code
RUN mkdir /Analytics
WORKDIR /Analytics
COPY Analytics .

RUN sudo apt-get update && apt-get -y install postgresql postgresql-client postgresql-contrib
RUN sudo apt-get -y install postgis

USER postgres
RUN    /etc/init.d/postgresql start &&\
    psql --command "CREATE USER root WITH SUPERUSER PASSWORD 'root';" &&\
    createdb -O root test_analytics &&\
    psql -d test_analytics -c "CREATE EXTENSION postgis;"
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/9.5/main/pg_hba.conf
USER root