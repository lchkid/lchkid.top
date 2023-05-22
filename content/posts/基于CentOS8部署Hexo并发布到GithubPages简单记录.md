---
title: "基于CentOS8部署Hexo并发布到GithubPages简单记录"
subtitle: ""
date: 2020-03-05T16:06:53+08:00
lastmod: 2020-03-05T16:06:53+08:00
categories:
- 博客相关
tags:
- Linux
- Hexo
- Next
---

## 前言

前几年闲着没事在GitHub Pages搭了一个Hexo，一直没怎么用，一些记录和心得什么的都放在CSDN上了，这回趁着时间多把Hexo重新拾起来，就从搭建开始重新写起吧。


## 搭建环境

> Hexo是一个快速、简洁且高效的博客框架。Hexo使用Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。
首先要找一个环境来搭Hexo，可以用本机、虚拟机或者云主机，我这次用的是AWS，所以以下的操作都是基于Linux的。我们都知道Hexo是基于node.js的，而且要在GitHub Pages上发布就肯定少不了git，所以准备工作就很明显了。


### 安装git

```shell
$ yum install -y git-core
```


### 安装node.js

```shell
$ curl -sL https://rpm.nodesource.com/setup_13.x | bash -
$ yum install -y nodejs
```


### 检查是否安装成功

```shell
$ git --version && node -v
```

这样我们的准备工作就完成了。


## 配置git

### 配置git全局信息

```shell
$ git config --global user.name "GitHub用户名"
$ git config --global user.email "GitHub邮箱地址"
```


### 创建SSH秘钥

```shell
$ mkdir ~/.ssh
$ ssh-keygen -t rsa -C "GitHub邮箱地址"
$ cat ~/.ssh/id_rsa.pub
```


### 上传秘钥
将获取到的秘钥配置到GitHub网站，测试一下连接是否成功，这样git环境就配置完成了。

```shell
$ ssh -T git@GitHub.com
```


## 安装Hexo

### 安装hexo包和`hexo-deployer-git`扩展

```shell
$ npm install -g hexo-cli
$ npm install hexo-deployer-git --save
```


### 初始化hexo

```shell
$ hexo init <folder>
```


### 进入hexo目录

```shell
$ cd /hexo
$ npm install
```


## 配置Hexo

### 简单配置一下网站信息：

```shell
$ vi ./_config.yml
```

```yaml
# Site
title: 网站标题
subtitle: '网站副标题'
description: '描述'
keywords: 关键字
   author: 作者
language: 语言
timezone: '时区'

deploy:
type: 'git'
repo: GitHub仓库地址
branch: master
```


### 生成静态页面：

```shell
$ hexo generate  //Hexo g
```


### 本地预览：

```shell
$ Hexo server  //hexo s
```

如果你使用的是远程vps，可以克隆一个会话使用elinks预览：

```shell
$ yum install -y elinks
$ elinks --dump http://localhost:4000
```


## 发布到GitHub Pages

通过以上步骤，Hexo本地环境已经搭建完毕，接下来要做的就是把本地环境部署到GitHub上去：

```shell
$ hexo deploy  //hexo d
```

几分钟后就可以通过 https://lchkid.github.io 来访问博客了。
至此，我们通过GitHub创建了一个Hexo博客，后续可以再把Hexo美化一下。


## 补充

以下是很早前遇到过的一些小问题，也搬运过来在此简单记录：
> npm问题，切换为taobaonpm即可，具体见 http://cnodejs.org/topic/4f9904f9407edba21468f31e


## 参考资料

> Hexo官方docs https://hexo.io/zh-cn/docs
