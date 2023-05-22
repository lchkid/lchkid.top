---
title: "解决Windows系统L2TP协议的VPN连接报错问题"
subtitle: ""
date: 2020-12-02T11:04:08+08:00
lastmod: 2020-12-02T11:04:08+08:00
categories:
- 运维相关
tags:
- VPN
- L2TP
---


### 前言

这年头用`L2TP/IPsec`协议的真不多了，巧的是我司就是其中之一，以前用`SSLVPN`客户端登录的便利一去不复返，遇上“优化”过的WIN10系统报错茫茫多还不重样，就此记录下遇到过的故障和解决方案吧。


### WIN7系统

#### 错误609

##### 错误说明

指定了一个不存在的设备类型


##### 解决方法

一般重启就完事了。
如果还是不行可以试下打开服务，找到`IPsec Policy Agent`设为自动，重启电脑。


#### 错误809

##### 错误说明

无法建立计算机与 VPN 服务器之间的网络连接，因为远程服务器未响应。这可能是因为未将计算机与远程服务器之间的某种网络设备(如防火墙、NAT、路由器等)配置为允许 VPN 连接。


##### 解决方法

1. 打开注册表

2. 找到`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\RasMan\Parameters`

3. 新建一个`DWORD`值，名称为`ProhibitIpSec`，数值为`1`
   > 此键值为无需密钥`L2TP`连接

   ![](/images/2020/1202/ProhibitIpSec.png)

4. 找到`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\PolicyAgent`

5. 新建一个`DWORD`值，名称为`AssumeUDPEncapsulationContextOnSendRule`，数值为`2`

   ![](/images/2020/1202/AssumeUDPEncapsulationContextOnSendRule.png)

   > 或者新建一个`.reg`注册表文件，输入以下内容保存双击运行即可：
   > ```
   > Windows Registry Editor Version 5.00 
   > [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\RasMan\Parameters]
   > "ProhibitIpSec"=dword:00000001
   > [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\PolicyAgent]
   > "AssumeUDPEncapsulationContextOnSendRule"=dword:00000002
   > ```

6. 最后重启电脑再次尝试连接。


### WIN10系统

#### 错误720

##### 错误说明

不能建立到远程计算机的连接。你可能需要更改此连接的网络设置。

##### 解决方法

这是因为TCP/IP协议故障导致的，所以找到设备管理器中的网络适配器，一般会有一个打了黄色叹号的`WAN Miniport(IP)`

1. 右键属性-详细信息-驱动程序关键字，记住这个值

   ![](/images/2020/1202/WANMiniport.png)

2. 打开注册表

3. 找到`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Class\{4d36e972-e325-11ce-bfc1-08002be10318}\0010`

   > 部分设备也可能是0011，具体参照第一步的关键字数值

4. 删除如下图所示的`DriverDesc`键值

   ![](/images/2020/1202/DriverDesc.png)

5. 开始重新安装`WAN Miniport(IP)`的驱动，首先更新成错误的驱动，右键更新驱动程序，并按下方图示顺序操作

   ![](/images/2020/1202/%E6%9B%B4%E6%96%B0%E9%A9%B1%E5%8A%A8%E7%A8%8B%E5%BA%8F1.png)

   ![](/images/2020/1202/%E6%9B%B4%E6%96%B0%E9%A9%B1%E5%8A%A8%E7%A8%8B%E5%BA%8F2.png)

   ![](/images/2020/1202/%E6%9B%B4%E6%96%B0%E9%A9%B1%E5%8A%A8%E7%A8%8B%E5%BA%8F3.png)

   ![](/images/2020/1202/%E6%9B%B4%E6%96%B0%E9%A9%B1%E5%8A%A8%E7%A8%8B%E5%BA%8F4.png)

6. 此时，原先的`WAN Miniport(IP)`将会显示为**蓝牙设备**

7. 选中该蓝牙设备，右键更新驱动程序，重装为正确的`WAN 微型端口(IP)`驱动即可。

   ![](/images/2020/1202/%E6%9B%B4%E6%96%B0%E9%A9%B1%E5%8A%A8%E7%A8%8B%E5%BA%8F5.png)

#### 错误

##### 错误说明

L2TP连接尝试失败，因为安全层在初始化与远程计算机的协商时遇到了一个处理错误。


##### 解决方法

1. 在运行中输入`services.msc`打开服务

2. 找到`IPsec Policy Agent`、`Remote Access Connection Manager`和`Routing and Remote Access`

3. 右键属性设为自动，重启电脑再次尝试连接


### 参考文档

> https://me.jinchuang.org/archives/369.html
> 
> http://www.shenduwin8.com/jiaocheng/win8/8064.html
