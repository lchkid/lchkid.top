---
title: "解决Tomcat管理后台保存配置时StoreConfig报错问题"
subtitle: ""
date: 2020-03-10T19:15:54+08:00
lastmod: 2020-03-10T19:15:54+08:00
categories:
- 运维相关
tags:
- Tomcat
---


### 系统环境

>Apache Tomcat/8.5.51

最近在测试（玩）Tomcat的管理后台，不过实际好像很少有用这个改配置的。只要用的少，遇到的问题就肯定多，这不刚开始在通过Tomcat的Host Manager添加虚拟主机（Virtual Host）的时候就遇到问题了。

首先设置好Name和App base后点击Add添加VH：

![add](/images/2020/0310/tomcat-host-manager-add.png 'add')

看到提示信息：

```
OK - Host [test.tomcat.org] added
```

![added](/images/2020/0310/tomcat-host-manager-added.png 'added')

测试一下是否成功，由于提前修改了`/webapps2/ROOT/index.jsp`（Home-Test），所以可以明显看到访问该Host跳转到了`webapps2`目录下：

![started](/images/2020/0310/tomcat-host-manager-started.png 'started')

然后点击Persist configuration下的All，想将当前VH配置保存到`/conf/server.xml`中

> 该功能说明如下：
> 
> Save current configuration (including virtual hosts) to server.xml and per web application context.xml files

结果就报错了：

```
FAIL - Failed to persist configuration
Please enable StoreConfig to use this feature.
```

摸索了一会找到问题所在：少了一个监听（Listener）。

打开`server.xml`：

```shell
$ vim conf/server.xml
```

定位到`GlobalNamingResources`之前，在最后加上一个监听：

```xml
  <Listener className="org.apache.catalina.startup.VersionLoggerListener" />
  <!-- Security listener. Documentation at /docs/config/listeners.html
  <Listener className="org.apache.catalina.security.SecurityListener" />
  -->
  <!--APR library loader. Documentation at /docs/apr.html -->
  <Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="on" />
  <!-- Prevent memory leaks due to use of particular java/javax APIs-->
  <Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener" />
  <Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener" />
  <Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener" />
  <!-- add StoreConfig -->
  <Listener className="org.apache.catalina.storeconfig.StoreConfigLifecycleListener"/>
```

重新启动Tomcat后打开Host Manager页面，重试Add VH然后保存配置文件：

```
OK - Host [test.tomcat.org] added
OK - Configuration persisted
```

这样就可以了，不过我记得以前看教程的时候是有这个监听的，可能是`Apache Tomcat/8.5.51`取消了？也可能是我记错了也说不定，不过解决了就好:D。

