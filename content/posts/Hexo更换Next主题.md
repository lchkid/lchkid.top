---
title: "Hexo更换Next主题"
subtitle: ""
date: 2020-03-05T18:07:07+08:00
lastmod: 2020-03-05T18:07:07+08:00
categories:
- 博客相关
tags:
- Hexo
- Next
---

## 前言

通过之前的[简单教程](/posts/基于centos8部署hexo并发布到githubpages简单记录/)搭完Hexo之后，觉得默认的主题landscape太单调了，所以就找了网上大热的Next来用，下面记录一下如何更改Hexo主题为Next，并且更改一些个性化内容。


## 安装主题

### git clone快速下载主题

```shell
$ cd /hexo
$ git clone https://github.com/theme-next/hexo-theme-next themes/next
```


### 配置`_config.yml`

```shell
$ vi ./_config.yml
```

```yaml
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: next
```


### 重新生成静态页面并发布

```shell
$ hexo clean
$ hexo g
$ hexo d
```

完成操作大概几分钟之后，再打开 https://lchkid.github.io 就已经是新的主题了，但是还是很简陋。


## 个性化主题

### 更换Scheme：

> 要激活哪个配置选项就去掉行首的#，后面不再复述。

```yaml
# Schemes
#scheme: Muse
#scheme: Mist
scheme: Pisces
#scheme: Gemini
```


### 激活导航栏菜单

> 标签

```shell
$ hexo new page tags
$ vi /hexo/source/tags/index.md
```
```yaml
title: tags
date: 
type: "tags"
comments: false
---
```
> 分类

```shell
$ hexo new page categories
$ vi /hexo/source/categories/index.md
```
```yaml
title: categories
date: 
type: "categories"
comments: false
---
```
> 关于

```shell
$ hexo new page about
$ vi /hexo/source/about/index.md
```
```yaml
title: about
date: 
type: "about"
---
```

```yaml
menu:
  home: / || home
  categories: /categories/ || th
  archives: /archives/ || archive
  tags: /tags/ || tags
  about: /about/ || user
  #schedule: /schedule/ || calendar
  #sitemap: /sitemap.xml || sitemap
  #commonweal: /404/ || heartbeat
```


### 设置侧栏

> 只有Scheme设置为Pisces时，此处的position选项才会生效。

```yaml
sidebar:
  position: left
  display: post
```


### 设置头像

```yaml
avatar:
  url: /images/avatar.jpg
  rounded: true
  rotated: true
```


## 重新生成静态页面并发布

```shell
$ hexo clean
$ hexo g -d
```

简单的个性化配置就完成了，还有更多的地方可以修改就先不提了。


## 参考资料

> https://theme-next.iissnan.com
> 
> https://segmentfault.com/a/1190000009544924
