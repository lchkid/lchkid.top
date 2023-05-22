---
title: "基于CentOS8通过Docker配置ASF实现Steam云挂卡"
subtitle: ""
date: 2020-03-06T13:39:56+08:00
lastmod: 2020-03-06T13:39:56+08:00
categories:
- 运维相关
tags:
- Docker
- Steam
- ASF
---

## 前言

假期Steam喜+1多了之后又没那么多时间玩，所以想着拿ArchiSteamFarm（以下简称ASF）来挂下卡，去官方文档一看，`v3.0.3.2`版本之后ASF已经有[官方镜像](https://hub.docker.com/r/justarchi/archisteamfarm)了，以前还需要用Screen来后台挂卡，这回直接上Docker。


## 准备工作

### 安装并启动Docker

步骤很简单，先卸载老版本，然后添加yum源，最后安装`docker-ce`（社区版本）就好了。

```shell
# 安装
$ yum remove docker docker-client \
                    docker-client-latest \
                    docker-common \
                    docker-latest \
                    docker-latest-logrotate \
                    docker-logrotate \
                    docker-engine
$ yum install -y yum-utils \
                 device-mapper-persistent-data \
                 lvm2
$ yum-config-manager --add-repo \
		             https://download.docker.com/linux/centos/docker-ce.repo
$ yum install -y docker-ce docker-ce-cli containerd.io

# 启动
$ systemctl start docker
```


### 下载ASF官方镜像

```shell
$ docker pull justarchi/archisteamfarm
```

> 可以根据实际情况选择镜像，不过ASF最新版支持自动更新，不用重新创建容器，建议latest。


## 配置ASF

### 创建ASF容器

> ASF官方镜像的WORKDIR是/app，为了以后配置方便，做一个数据卷指向/app/config来修改json文件。

```shell
$ docker run -it -v $PWD/asf:/app/config --name=asf justarchi/archisteamfarm
```

此时如果返回下图所示的提示，说明ASF容器已经创建成功，直接`CTRL+D`退出即可：

![ASF容器](/images/2020/0306/Docker%E9%85%8D%E7%BD%AEASF%E6%8F%90%E7%A4%BA.png 'ASF容器')


### 配置`config`文件

到官方提供的[在线配置文件生成器](https://justarchinet.github.io/ASF-WebConfigGenerator/#/)页面分别配置好全局配置文件和机器人配置文件。

```json
//ASF.json
{
  "s_SteamOwnerID": "",  //steam64位ID，可以在https://steamrepcn.com/找到
  "CurrentCulture": "zh-CN",  //更改为中文
  "IPC": true  //启用IPC
}

//Botname.json
{
  "SteamLogin": "",  //steam用户名
  "SteamPassword": "",  //steam密码
  "Enabled": true,  //必须启用
  "CustomGamePlayedWhileFarming": "贪玩蓝月"  //挂卡显示非steam自定义游戏
}
```


### 导入配置文件

在宿主机上将上面配置好的json文件放到`/asf`目录中。

```shell
$ mv ASF.json Botname.json -t /asf
```


### 重新启动ASF容器

```shell
$ docker start asf
$ docker attach asf
```

此时再按提示输入两步验证的验证码或者steam令牌就可以开始挂卡了。


## 补充

1. 可以通过`docker stop asf`和`docker start asf`来停止和启动挂卡。
2. 通过`docker logs -f asf`来获取ASF运行日志。
3. 在创建容器时可以添加端口映射`-p 127.0.0.1:1242:1242 -p [::1]:1242:1242`来通过宿主机 http://localhost:1242 访问ASF。
4. 配置完毕后可以通过修改全局配置文件中的`Headless`属性为`true`来关闭控制台输入。
5. 修改全局配置文件中的`SteamMasterClanID`属性可以通过steam组来控制ASF，详见[官方文档](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Configuration-zh-CN#steammasterclanid)。


## 参考资料

> https://github.com/JustArchiNET/ArchiSteamFarm/wiki/