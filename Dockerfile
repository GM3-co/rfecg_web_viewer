FROM centos:7

### 作者
MAINTAINER gm3 <info@gm3.jp>

EXPOSE 50001
EXPOSE 8080

### node.js v6  Install
RUN    yum -y install  gcc-c++ make bzip2
RUN    curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
RUN    yum -y install nodejs

RUN    yum reinstall -y glibc-common
ENV    LANG ja_JP.utf8

RUN    /bin/cp -f /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# work dir
RUN    mkdir /workspace
COPY   workspace /workspace
RUN    bash -c 'cd /workspace && npm install '
       

COPY   run.sh /
RUN    chmod +x /run.sh
CMD    /run.sh
