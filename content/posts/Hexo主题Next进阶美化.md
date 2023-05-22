---
title: "Hexo主题Next进阶美化"
subtitle: ""
date: 2020-03-06T19:52:45+08:00
lastmod: 2020-03-21T15:52:45+08:00
categories:
- 博客相关
tags:
- Hexo
- Next
- 前端
- CSS
---

## 前言

之前换了Next主题后又改了一些[简单的设置](/posts/hexo更换next主题/)，不过对有一些样式还是不满意，但是官方的`_config.yml`文件并没有提供这些选项，只能通过修改CSS的方式来改了。先是去网上搜了一些教程，因为版本原因很多教程都失效了，还得靠自己摸索。

>不同版本文件路径或者具体属性都不完全一样，本文基于[NexT 7.7.2](https://pisces.theme-next.org/next-7-7-2-released/)，食用本文需要一点点点CSS基础:D。


## Next进阶美化

### 添加背景图片

先将大小合适的图片放到`./source/image/`目录中。
打开`./themes/next/source/css/_common/scaffolding/base.styl`，找到`body`，增加以下代码：

```css
background: url("/images/bg.png") fixed;  //自己更改图片url
background-position: 0 -100px;  //微调背景图片位置
```


### 鼠标点击爱心

下载以下js文件放到`./themes/next/source/js/`目录中。

```javascript
!function(e,t,a){function n(){c(".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: fixed;}.heart:after{top: -5px;}.heart:before{left: -5px;}"),o(),r()}function r(){for(var e=0;e<d.length;e++)d[e].alpha<=0?(t.body.removeChild(d[e].el),d.splice(e,1)):(d[e].y--,d[e].scale+=.004,d[e].alpha-=.013,d[e].el.style.cssText="left:"+d[e].x+"px;top:"+d[e].y+"px;opacity:"+d[e].alpha+";transform:scale("+d[e].scale+","+d[e].scale+") rotate(45deg);background:"+d[e].color+";z-index:99999");requestAnimationFrame(r)}function o(){var t="function"==typeof e.onclick&&e.onclick;e.onclick=function(e){t&&t(),i(e)}}function i(e){var a=t.createElement("div");a.className="heart",d.push({el:a,x:e.clientX-5,y:e.clientY-5,scale:1,alpha:1,color:s()}),t.body.appendChild(a)}function c(e){var a=t.createElement("style");a.type="text/css";try{a.appendChild(t.createTextNode(e))}catch(t){a.styleSheet.cssText=e}t.getElementsByTagName("head")[0].appendChild(a)}function s(){return"rgb("+~~(255*Math.random())+","+~~(255*Math.random())+","+~~(255*Math.random())+")"}var d=[];e.requestAnimationFrame=function(){return e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,1e3/60)}}(),n()}(window,document);
```

打开`./themes/next/layout/_layout.swig`，在末尾`</html>`前增加以下代码：

```html
<!-- click love -->
<script src="/js/clickLove.js"></script>
```


### 动态背景Canvas-nest

在`./source/`新建一个`_data`目录，新建`footer.swig`文件，输入以下代码：

```js
<script color="0,0,255" opacity="0.5" zIndex="-1" count="99" src="https://cdn.jsdelivr.net/npm/canvas-nest.js@1/dist/canvas-nest.js"></script>
```

打开主题配置文件`_config.yml`，找到`custom_file_path`，去掉行首`#`使以下代码生效：

```yaml
footer: source/_data/footer.swig
```


### 设置透明度 

打开`./themes/next/source/css/_schemes/Pisces/_layout.styl`，找到`.header-inner`和`.content-wrap`，

打开`./themes/next/source/css/_schemes/Pisces/_sidebar.styl` ，找到`.sidebar`，增加以下代码：

```css
opacity: .8;
```


### 修改code样式

打开`./themes/next/source/css/_common/scaffolding/highlight/highlight.styl`，找到`code`，修改以下代码：

```css
background: #颜色;
border-radius: 2px;
color: #颜色;
padding: 1px 2px;
word-wrap();
```


### 修改超链接样式

打开`./themes/next/source/css/_common/scaffolding/base.styl`，找到`a, span.exturl`和`&:hover`，修改以下代码：

```css
border-bottom: 1px solid #颜色;
color: #颜色;

border-bottom-color: #颜色;
color: #颜色;
```


### 修改阅读全文按钮样式

打开`./themes/next/source/css/_common/scaffolding/buttons.styl`，找到`.btn`和`&:hover`，修改以下代码：

```css
background: #颜色;
border: 2px solid #颜色;
border-radius: 圆角;
color: #颜色;
display: inline-block;
font-size: 字体大小;
line-height: 2;
padding: 0 20px;
text-decoration: none;
transition-property: background-color;
the-transition();

background: #颜色;
border-color: #颜色;
color: #颜色;
```


### 修改底部文字样式

打开`./themes/next/source/css/_common/outline/footer/footer.styl`，找到`.footer`，修改以下代码：

```css
color: #颜色;
opacity: .8;
border: none;
```


### 合并某些样式

如果觉得上述方法改起来麻烦，可以将他们合并在一个文件中。

打开`./themes/next/source/css/_common/components/post/post.styl`，在最下方新增以下代码：

```css
// code样式
code {
  background: #fffcd7;
  color: #ff6060;
  padding: 1px 2px;
}

// 超链接样式
.post-body p a {
  color: #6097ff;
  border-bottom: none;
  border-bottom: 1px solid #6097ff;
  &:hover {
    color: #ff6060;
    border-bottom: none;
    border-bottom: 1px solid #ff6060;
  }
}


// 阅读全文样式
.btn {
  color: #ff6060;
  background-color: #fff;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid #ff6060;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:hover {
    color: #fff;
    background-color: #ff6060;
    border-color: #ff6060;
  }
}

// 底部文字样式
.footer, .footer a {
  color: #ffffff;
  opacity: .8;
  border: none;
  
  &:hover {
    border: none;
  }
}

// and so on...
```


------

> 2020-03-21更新

### 修改侧边栏和正文圆角

打开`./themes/next/source/css/_schemes/Pisces/_layout.styl`，找到`.header-inner`，修改以下代码：

```css
border-radius: 0 0 6px 6px;
```

找到`.content-wrap`，修改以下代码：

```css
border-radius: 6px;
```

打开`./themes/next/source/css/_schemes/Pisces/_sidebar.styl` ，找到`.sidebar`，修改以下代码：

```css
border-radius: 6px;
```

打开`./themes/next/source/css/_common/components/back-to-top-sidebar.styl`，找到`&.back-to-top-on`，插入以下代码：

```css
border-radius: 6px;
```

找到`&:hover`，插入以下代码：

```css
border-radius: 6px;
color: #ff6060;
```


### 修改侧边栏链接样式

打开`./themes/next/source/css/_common/outline/header/menu.styl`，找到`.menu-item-active a`，插入以下代码：

```css
color: #ff6060;
```

打开`./themes/next/source/css/_schemes/Pisces/_menu.styl`，找到`.menu-item-active a::after`，修改以下代码：

```css
background: #ff6060;
```


### 添加博客标题动画

打开`./themes/next/source/css/_common/outline/header/site-meta.styl`，找到`.site-title`，在前面插入以下代码：

```css
@-webkit-keyframes shake{
	0% {
		-webkit-transform:translateX(9px) rotate(9deg);
    }
    20% {
        -webkit-transform:translateX(-7px) rotate(-7deg);
    }
    40% {
        -webkit-transform:translateX(5px) rotate(5deg);
    }
    60% {
        -webkit-transform:translateX(-3px) rotate(-3deg);
    }
    80% {
        -webkit-transform:translateX(1px) rotate(1deg);
    }
    100% {
        -webkit-transform:translateX(0) rotate(0);
    }
}
```

在`.site-title`插入以下代码：

```css
transition: color 0.5s ease-in-out;

&:hover {
  animation: shake 0.5s ease-in-out 1;
  color: #ff6060;
}
```

可以实现鼠标移到标题后左右晃动并变色效果。


### 修改右上角github标签

打开`./themes/next/source/css/_common/outline/header/github-banner.styl`，找到`svg`，修改以下代码：

```css
color: #ff6060;
fill: transparent;
position: fixed;
```

有兴趣的也可以去 https://github.com/blog/273-github-ribbons 找别的SVG来替换。


### 修改全局超链接文字颜色

打开`./themes/next/source/css/_common/scaffolding/base.styl`，找到`a, span.exturl`下的`&:hover`，修改以下代码：

```css
border-bottom-color: #ff6060;
color: #ff6060;
```


### 修改正文样式

打开`./themes/next/source/css/_schemes/Pisces/_layout.styl`，找到`.content-wrap`，修改以下代码：

```css
// background: var(--content-bg-color);
padding: 0 $content-desktop-padding;
```

打开`./themes/next/source/css/_common/components/post/post-expend.styl`，找到`.posts-expand`，修改以下代码：

```css
// padding-top: 40px;
```

打开`./themes/next/source/css/_common/components/post/post-eof.styl`，注释以下代码：

```css
/*.post-eof {
  background: $grey-light;
  height: 1px;
  margin: $post-eof-margin-top auto $post-eof-margin-bottom;
  text-align: center;
  width: 8%;

  .post-block:last-child & {
    display: none;
  }
}*/
```

打开`./themes/next/source/css/_common/components/post/post.styl`，在最下方新增以下代码：

```css
// 正文和评论样式
.post-block {
  background: var(--content-bg-color);
  padding: 40px;
  margin-bottom: 13px;
  border-radius: 5px;
}
```

打开`./themes/next/source/css/_common/scaffolding/comments.styl`，找到`.comments`，插入以下代码：

```css
margin: 60px 0 20px 0;
background: var(--content-bg-color);
padding: 40px;
border-radius: 5px;
```


### 修改正文标题下方线条动画

打开`./themes/next/source/css/_common/components/post/post-header.styl`，找到`.posts-expand .post-title-link`增加以下代码：

```css
&:hover {
  color: #ff6060;
}
```

找到`&::before`，修改以下代码：

```css
background: #ff6060;
```


### 修改归档页面超链接样式

打开`./themes/next/source/css/_common/components/post/post-collapse.styl`，找到`.post-header`，插入以下代码：

```css
&:hover span {
  color: #ff6060;
}
```


### 修改标签列表颜色

打开主题配置文件`_config.yml`，找到`tagcloud`，修改以下内容：

```yaml
tagcloud:
  # All values below are same as default, change them by yourself.
  min: 12 # Minimun font size in px
  max: 30 # Maxium font size in px
  start: "#EE7AE9" # Start color (hex, rgba, hsla or color keywords)
  end: "#FFD700" # End color (hex, rgba, hsla or color keywords)
  amount: 200 # Amount of tags, change it if you have more than 200 tags
```


### TO DO LIST

- [ ] 增加下拉浮动导航栏

