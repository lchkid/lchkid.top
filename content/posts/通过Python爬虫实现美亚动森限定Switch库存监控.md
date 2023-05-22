---
title: "通过Python爬虫实现美亚动森限定Switch库存监控"
subtitle: ""
date: 2020-03-29T15:36:08+08:00
lastmod: 2020-03-29T15:36:08+08:00
categories:
- 捣鼓代码
tags:
- Python
- 爬虫
---


### 前言

最近这波动森大火，搞得我心痒痒想买一个Switch玩，结果看到淘宝上的动森限定动辄小4000，实在不想当冤大头，就动起海淘的小心思。日亚是不想了，美亚隔一段时间还会补个货，靠自己盯着肯定不靠谱，所以就准备搞个小代码来监控一下。


### 准备工作

Python最适合干这种脏活累活，抓取美亚动森限定的网页，看是否有货就行了。


#### 整体架构

| 模块          | 功能                       |
| ------------- | -------------------------- |
| monitor.py    | 主监控程序                 |
| getProxy.py   | 获取代理IP                 |
| checkProxy.py | 检测IP是否可用，构建代理池 |
| notice.py     | 提醒程序                   |


#### 第三方库

用`requests`库抓取网页，`BeautifulSoup`、`xpath`分析网页内容；
`PyMySQL`将代理IP写入数据库，`smtplib`发送邮件提醒。

```
pip install requests
pip install bs4
pip install lxml
pip install pymysql
pip install smtplib
```


### 具体实现

#### 获取代理IP

代理池其实有大佬写过一个很好用的，具体可见[Python爬虫代理池搭建](https://blog.csdn.net/pengjunlee/article/details/90174453) ，
所以我这里只是写了个超简单的用来测试，后面估计会直接用大佬的。


##### 导入第三方库

这里偷懒就用了一个固定的`User-Agent`，正式用的话应该设置一个列表随机获取一个用。

```python
import requests
from lxml import etree

ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.69 Safari/537.36 Edg/81.0.416.34'
```


##### 爬取代理IP

找一个[免费代理网站](https://www.xicidaili.com/)练练手（侵删），
可以看到具体网址为`https://www.xicidaili.com/nn/页码`形式：
获取代理IP网址存于`url_list`中：

```python
url_list = []
# 设置获取代理IP页数page
page = 5
i = 1
while i <= page:
    url_list.append('%s%s' % ('https://www.xicidaili.com/nn/', str(i)))
    i = i + 1
```

而每个页面对我们有用的就是下面这段：

```html
<table id="ip_list">
	<tr></tr> // 没用
    <tr>
      <td></td> // 没用
      <td>117.88.177.188</td>
      <td>3000</td>
    </tr>
```

所以获取有用内容并进行拼接存于`proxy_list`中：

```python
proxy_list = []
for url in url_list:
    r = requests.get(url, headers={'User-Agent': ua})
    e = etree.HTML(r.text)
    tr_list = e.xpath('//table[@id="ip_list"]//tr[position()>1]')
    for tr in tr_list:
        proxy_list.append(list(tr)[1].text + ':' + list(tr)[2].text)
```

这样我们就获取到一个`IP:PORT`为值的代理IP列表了。


#### 校验代理IP

> 简单测试一下，先不存储了，免费代理失效的实在是太多了。

```python
for ip in proxy_list:
    try:
        r_check = requests.get('http://httpbin.org/ip', proxies={'http': 'http://' + ip}, timeout=3)
    except BaseException:
        print('fail')
    else:
        print('success', r_check.status_code, ip)
```


#### 监控主程序

首先拿到美亚动森限定版Switch地址：[https://www.amazon.com/gp/offer-listing/B084DDDNRP](https://www.amazon.com/gp/offer-listing/B084DDDNRP)

> 当然美亚上面600刀的冤大头我们也不会去当的( • ̀ω•́ )✧，所以给它加个参数`m=ATVPDKIKX0DER`，这样就只会显示`Sold by Amazon.com`的了。

可以先找个有货的商品看下具体网页结构，这里就直接抛代码了，我监控的是价格，毕竟有货如果价格不对也没用是吧：

```python
soup = BeautifulSoup(r.text, 'lxml')
product = soup.select('#olpProductDetails h1')[0].text.strip()
if soup.select('.olpOfferPrice'):
    price = soup.select('.olpOfferPrice')[0].text.strip()
    print(product + "\nNow in stock! The price is " + price)
else:
    print(product + "\nOut of stock!")
```

最终效果：

![监控](/images/2020/0329/monitor.png 'monitor')


#### 邮件提醒

这块只要把监控主程序里输出的内容当邮件内容发送到指定邮箱即可，当然是有货的时候才发。
最后把主程序写进Shell里扔到VPS，用`crontab`设置个定时任务就行了


### 碎碎念

这个小代码其实是一个很简单的爬虫，后面还有很多可以扩展，比如把监控网页利用商品代码进行更新，不再监控单一的商品，随机UA和代理池也写进去，代理IP存完真正要用之前还要再检测一遍，防止失效等等。

不过我都没继续写了，因为。。。那天我找到了一个网站：[http://www.nowinstock.net/](http://www.nowinstock.net/)

