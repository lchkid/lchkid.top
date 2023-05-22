---
title: "基于CentOS8下MySQL8.0.17和Nginx的Zabbix4.4部署记录"
subtitle: ""
date: 2020-03-20T16:39:57+08:00
lastmod: 2020-03-20T16:39:57+08:00
categories:
- 运维相关
tags:
- Linux
- MySQL
- Nginx
- Zabbix
---

### 准备工作

#### 系统环境

> 系统版本：CentOS Linux release 8.1.1911
> 
> MySQL版本：8.0.17
> 
> Nginx版本：1.16.1
>
> Zabbix版本：4.4


#### 安装MySQL

Zabbix支持多种数据库来存放采集到的数据，常用的如：MySQL、PostgreSQL、Oracle、IBM DB2、SQLite等，低版本可以参考[上次部署](/posts/基于centos8的mysql5.7.28部署记录/)好的MySQL `5.7.28`，这次准备装MySQL `8.0.17`


##### 通过YUM安装

###### 安装yum源

```shell
$ rpm -ivh https://dev.mysql.com/get/mysql80-community-release-el8-1.noarch.rpm
```


###### 安装MySQL

```shell
$ yum install -y @mysql
$ mysql --version
```

当前MySQL版本是`8.0.17`

![](/images/2020/0320/mysql1.png)


###### 启动MySQL

```shell
$ systemctl start mysqld
# 设置自启动
$ systemctl enable mysqld
$ systemctl status mysqld
```

![](/images/2020/0320/mysql2.png)


###### 配置MySQL

```shell
# 与低版本不同
$ mysql_secure_installation

# 是否配置密码验证组件
Would you like to setup VALIDATE PASSWORD component? N
# 是否删除匿名账号
Remove anonymous users? Y
# 是否禁止远程登录（看个人需求）
Disallow root login remotely? N
# 是否删除test库
Remove test database and access to it? Y
# 是否重载权限表？
Reload privilege tables now? Y

# 登录试试
$ mysql -uroot -p
```

![](/images/2020/0320/mysql3.png)


```mysql
# 添加root远程权限
use mysql;
update user set host='%' where user='root';
flush privileges;
```


#### 安装Nginx

##### 通过RPM包安装

###### 添加yum源

```shell
$ vim /etc/yum.repos.d/nginx.repo
###
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
###
```


###### 安装Nginx

```shell
$ yum install -y nginx
$ nginx -v
```

当前Nginx stable版本是`1.16.1`

![](/images/2020/0320/nginx1.png)


##### 通过二进制包安装

###### 下载压缩包

```shell
$ wget http://nginx.org/download/nginx-1.16.1.tar.gz
$ tar -xvf nginx-1.16.1.tar.gz
```


###### 安装依赖包

```shell
$ yum install -y pcre pcre-devel zlib zlib-devel gcc-c++ libtool openssl openssl-devel
```


###### 编译Nginx

```shell
$ ./configure
$ make && make install
$ nginx -v
```


###### 配置环境变量

```shell
$ vim /etc/profile

# 插入一行
export PATH=$PATH:/usr/local/nginx/sbin

$ source /etc/profile
```


### 安装Zabbix

#### 安装yum源

```shell
$ rpm -ivh https://repo.zabbix.com/zabbix/4.4/rhel/8/x86_64/zabbix-release-4.4-1.el8.noarch.rpm
```


#### 安装Zabbix组件

```shell
$ yum install -y zabbix-server-mysql zabbix-web-mysql zabbix-nginx-conf zabbix-agent
```

> 这里可能会因为网络问题导致某些组件下载安装失败，解决方法是用阿里云替换官方源

```shell
$ rpm -e zabbix-release
$ vim /etc/yum.repos.d/zabbix.repo
###
[zabbix]
name=Zabbix Official Repository - $basearch
baseurl=http://mirrors.aliyun.com/zabbix/zabbix/4.4/rhel/8/$basearch/
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-ZABBIX-A14FE591

[zabbix-non-supported]
name=Zabbix Official Repository non-supported - $basearch
baseurl=http://mirrors.aliyun.com/zabbix/non-supported/rhel/8/$basearch/
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-ZABBIX
gpgcheck=1
###
$ yum clean packages
```


#### 创建Zabbix库

```shell
$ mysql -uroot -p
```

```mysql
# 创建zabbix库
create database zabbix character set utf8 collate utf8_bin;
# 创建zabbix用户
create user zabbix@localhost identified by 'zabbix@lch123';
# 给zabbix用户授权
grant all privileges on zabbix.* to zabbix@localhost with grant option;
exit;
```


##### 导入表结构

```shell
$ zcat /usr/share/doc/zabbix-server-mysql/create.sql.gz | mysql -uzabbix -p zabbix
```

这就是导入后的zabbix库

![](/images/2020/0320/zabbix1.png)


##### 连接Zabbix server与MySQL

```shell
$ vim /etc/zabbix/zabbix_server.conf

# 设置DB
DBHost=localhost
DBName=zabbix
DBUser=zabbix
DBPassword=zabbix@lch123
DBPort=3306
```


### 启动Zabbix

#### 启动PHP

修改PHP时区

```shell
$ vim /etc/php-fpm.d/zabbix.conf
php_value[date.timezone] = Asia/Shanghai
```

设置自启动

```shell
$ systemctl enable --now php-fpm
```


#### 启动Nginx

配置Nginx

```shell
$ vim /etc/nginx/conf.d/zabbix.conf
listen          9000;
server_name     localhost;
```

设置自启动

```shell
$ nginx -t
$ systemctl enable --now nginx
```


#### 启动Zabbix

```shell
$ systemctl enable --now zabbix-server zabbix-agent
```

这里可能会遇到启动失败的问题

![](/images/2020/0320/zabbix2.png)

按提示查看失败原因，可以看到是SELinux的锅

![](/images/2020/0320/zabbix3.png)

直接关掉再启动zabbix-server

```shell
$ setenforce 0
$ systemctl start zabbix-server
$ systemctl status zabbix-server
```

![](/images/2020/0320/zabbix4.png)

配置一下SELinux

```shell
$ vim /etc/sysconfig/selinux
SELINUX=disable
```

再看一下监听端口是否成功开启

```shell
$ netstat -tnlp
```

![](/images/2020/0320/zabbix5.png)

全部启动完毕后就可以在浏览器打开 http://localhost:9000/ 浏览Zabbix安装页面了

![](/images/2020/0320/zabbix6.png)


### 配置Zabbix

#### 检查前端环境

这里一般都是PHP相关的配置，如果有项目报错就去修改`/etc/php.ini`


#### 配置数据库连接

这里是配置前端和数据库连接的账户信息，填入之前配置好的MySQL库、用户和密码
如果你的数据库不是在本机，记得填入数据库所在的IP地址

![](/images/2020/0320/zabbix7.png)


#### 配置服务端信息

填入自定义host和name，端口如果没有修改过`/etc/zabbix/zabbix_server.conf`就是默认的`10051`
最后会在`/etc/zabbix/web/`下生成一个`zabbix.conf.php`文件来保存刚刚配置好的所有信息

![](/images/2020/0320/zabbix8.png)

这样基于MySQL和Nginx的Zabbix就部署完毕了，访问 http://localhost:9000/ 就可以用初始用户名密码登陆。


### 常用配置文件

| 目录                            | 描述                 |
| :------------------------------ | :------------------- |
| /usr/share/zabbix/              | zabbix组件目录       |
| /etc/nginx/conf.d/zabbix.conf   | nginx-zabbix配置文件 |
| /etc/php-fpm.d/zabbix.conf      | php-fpm配置文件      |
| /etc/php.ini                    | php配置文件          |
| /etc/zabbix/web/zabbix.conf.php | zabbix-web端配置信息 |


### 参考资料

> https://www.zabbix.com/documentation/4.4/manual
> 
> https://blog.csdn.net/zhwxl_zyx/article/details/104885812
