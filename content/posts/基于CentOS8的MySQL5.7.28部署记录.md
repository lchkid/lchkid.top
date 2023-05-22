---
title: "基于CentOS8的MySQL5.7.28部署记录"
subtitle: ""
date: 2020-03-14T12:46:08+08:00
lastmod: 2020-03-14T12:46:08+08:00
categories:
- 运维相关
tags:
- Linux
- MySQL
---

### 系统环境

> 系统版本：CentOS Linux release 8.1.1911
> 
> MySQL版本：5.7.28


### 通过RPM包安装

#### 卸载mariadb

```shell
$ rpm -qa|grep mariadb
```

![旧版本](/images/2020/0314/mariadb.png 'mariadb')

我的centos版本没装，如果有的话用以下命令卸载

```shell
$ rpm -e --nodeps mariadb
```


#### 检查依赖环境

```shell
$ rpm -qa | grep libaio
```

![依赖](/images/2020/0314/deps.png 'deps')


#### 下载rpm包

去[官网](https://dev.mysql.com/downloads/mysql/)下载对应版本的rpm包，一般来说只用下common、libs、client和server这4个包，直接下Bundle包也行。网速可以的话直接用wget下载就行。

```shell
$ cd /opt
$ wget https://downloads.mysql.com/archives/get/p/23/file/mysql-community-common-5.7.28-1.el7.x86_64.rpm
$ wget https://downloads.mysql.com/archives/get/p/23/file/mysql-community-libs-5.7.28-1.el7.x86_64.rpm
$ wget https://downloads.mysql.com/archives/get/p/23/file/mysql-community-client-5.7.28-1.el7.x86_64.rpm
$ wget https://downloads.mysql.com/archives/get/p/23/file/mysql-community-server-5.7.28-1.el7.x86_64.rpm
```

> 附上Bundle包：

```shell
$ wget https://downloads.mysql.com/archives/get/p/23/file/mysql-5.7.28-1.el7.x86_64.rpm-bundle.tar
$ tar -xzvf mysql-5.7.28-1.el7.x86_64.rpm-bundle.tar
```


#### 安装MySQL

> 这里要注意安装顺序，common-libs-client-server

```shell
$ rpm -ivh mysql-community-common-5.7.28-1.el7.x86_64.rpm
$ rpm -ivh mysql-community-libs-5.7.28-1.el7.x86_64.rpm
$ rpm -ivh mysql-community-client-5.7.28-1.el7.x86_64.rpm
$ rpm -ivh mysql-community-server-5.7.28-1.el7.x86_64.rpm
```

![安装](/images/2020/0314/install.png 'install')

装完检查一下安装是否成功：

```shell
$ mysqladmin --version
```

![检查版本](/images/2020/0314/version.png 'version')


#### 初始化MySQL

5.7版本安装MySQL后默认没有启动，需要手动初始化：

```shell
$ mysqld --initialize --user=mysql
```

初始化后也没有回显，需要到日志文件中寻找初始密码：

```shell
$ cat /var/log/mysqld.log
```

![初始化密码](/images/2020/0314/initialize.png 'initialize')

此时我们可以看一下配置文件：

```shell
$ cat /etc/my.cnf
```

![配置文件](/images/2020/0314/conf.png 'conf')

可以看到数据库目录在/var/lib/mysql，列一下主要的目录地址：

| 参数       | 目录                       |
| :--------- | :------------------------- |
| --basedir  | /usr/bin                   |
| --datadir  | /var/lib/mysql             |
| --pid-file | /var/run/mysqld/mysqld.pid |


#### 本地连接MySQL

有了初始密码就可以本地连接MySQL了，先启动服务：

```shell
$ systemctl start mysqld
```

检查一下：

```shell
$ systemctl status mysqld
```

![mysql状态](/images/2020/0314/start.png 'start')

OK没问题，通过root和初始密码连接：

```shell
$ mysql -uroot -p
```

![登录数据库](/images/2020/0314/link.png 'login')

熟悉的界面是吧，别急，还得改一下初始密码：

```mysql
ALTER USER 'root'@'localhost' IDENTIFIED BY '新的密码';
```

注意默认配置下密码不能过于简单否则会报错，重新登录一下，搞定！

![密码修改完成](/images/2020/0314/over.png 'over')


#### 远程连接MySQL
如果需要通过第三方工具远程连接数据库进行操作的话，还要给root添加一下远程权限。
先看一下root的权限：

```mysql
use mysql;
SELECT host,user FROM user;
```

![查看用户](/images/2020/0314/user.png 'user')

显然现在只允许root通过本地连接，给它改成允许所有连接：

```mysql
UPDATE user SET host='%' WHERE user='root';
```

![修改用户权限](/images/2020/0314/update.png 'update')

> 这里也可以用另一种方式：

```mysql
GRANT all privileges on *.* to root@'%' identified by 'mysql123456';
```

刷新一下：

```mysql
flush privileges;
```

用SQLyog连接一下试试：

![连接数据库](/images/2020/0314/sqlyoglink.png 'sqlyoglink')

这样MySQL5.7.28就部署成功了。
顺便附上一份之前写的的二进制包安装及配置简单教程。


### 通过二进制包安装

#### 下载二进制包

```shell
$ wget https://downloads.mysql.com/archives/get/p/23/file/mysql-5.7.28-linux-glibc2.12-x86_64.tar.gz
```


#### 安装MySQL

```shell
# 解压二进制包
$ tar -xzvf mysql-5.7.28-linux-glibc2.12-x86_64.tar.gz

# 添加mysql用户
$ groupadd mysql
$ useradd -g mysql mysql
$ passwd mysql

# 修改目录权限
$ mv mysql-5.7.28-linux-glibc2.12-x86_64 /usr/local/mysql
$ cd /usr/local/mysql
$ mkdir data
$ chown -R mysql:mysql .

# 添加环境变量
$ vim /etc/profile
$ export PATH=$PATH:/usr/local/mysql/bin
$ source /etc/profile
$ cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysql
```


#### 初始化MySQL

```shell
$ mysqld --initialize --user=mysql --basedir=/usr/local/mysql --datadir=/usr/local/mysql/data

# 从回显中查看初始密码
$ [Note] A temporary password is generated for root@localhost:
```


#### 连接MySQL

```mysql
$ service mysql start
$ mysql -uroot -p

# 修改初始密码
ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';

# 添加远程权限
use mysql;
update user set host='%' where user ='root';
flush privileges;
```
