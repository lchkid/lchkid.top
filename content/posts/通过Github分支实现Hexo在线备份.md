---
title: "通过Github分支实现Hexo在线备份"
subtitle: ""
date: 2020-03-05T22:20:16+08:00
lastmod: 2020-03-05T22:20:16+08:00
categories:
- 博客相关
tags:
- GitHub
- Hexo
---

## 前言

在[更换完Hexo的主题](/posts/hexo更换next主题/)后，博客大致就搭建完毕了，这时我们又遇到一个问题，如果我们更换了电脑或者VPS到期了，除了拷贝整个文件夹还有什么好方法可以备份Hexo呢？这次我们就通过git分支功能来备份。


## 备份步骤

### 在hexo目录创建本地仓库

```shell
$ cd /hexo
$ git init
```


### 添加远程仓库并设置别名为origin

```shell
$ git remote add origin git@github.com:lchkid/lchkid.github.io.git
```


### 新建并切换到分支hexo

```shell
$ git branch -b hexo
```


### 配置忽略文件

查看hexo目录下的`.gitignore`文件，若无则新建：

```
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/
```

> 该文件会忽略目录中hexo渲染完后生成的`public`目录和`.deploy_git`目录


### 添加hexo目录到本地仓库

```shell
$ git add .
$ git commit -m "Blog Initial"
```


### 推送到远程仓库的hexo分支

```shell
$ git push -u origin hexo:hexo
```

> 第一次push需要用-u关联，之后就不用-u了。


### 检查远程仓库

登陆Github查看`lchkid.github.io`仓库是否新增了hexo分支并包含所有自定义文件：

![github](/images/2020/0305/github%E5%88%86%E6%94%AF%E6%88%AA%E5%9B%BE.png 'github')

以后定期push即可：

```shell
$ hexo clean
$ hexo g -d
$ git add .
$ git commit -m ""
$ git push -u origin hexo:hexo
```


## 还原步骤

### 搭建git、node.js环境并配置SSH和git

详见[CentOS搭建Hexo并发布到GithubPages简单教程](/posts/centos搭建hexo并发布到githubpages简单教程)


### 安装hexo

```shell
$ npm install -g hexo-cli
```

### 从git分支clone主目录

```shell
$ git clone -b hexo git@github.com:lchkid/lchkid.github.io.git
```

> Tips：如果在github的setting中设置hexo为default，就可以直接git clone而不加-b参数了。


### hexo初始化

```shell
$ cd ./lchkid.github.io
$ npm install
$ npm install hexo-deployer-git --save
```


### hexo渲染和发布

```shell
$ hexo g -d
```


## 参考资料

> https://www.zhihu.com/question/21193762/answer/489124966
>
> https://quareia.github.io/blog/6efb1d64
>
> https://stackoverflow.com/questions/15681643/how-to-clone-git-repository-from-its-zip
