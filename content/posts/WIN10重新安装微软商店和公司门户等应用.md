---
title: "WIN10重新安装微软商店和公司门户等应用"
subtitle: ""
date: 2023-06-03T15:09:57+08:00
lastmod: 2023-06-03T15:09:57+08:00
categories:
- IT相关
tags:
- WINDOWS
- 微软商店
- 公司门户
- Microsoft Store
- Microsoft Company Portal
- Microsoft Intune
---

### 通过XBOX安装

这个方法是从B站一个UP主那看到的，[10秒快速恢复windows11系统Microsoft store应用商店，一键回复，告别运行命令【支持win10】](https://www.bilibili.com/video/av677500171/)

只需要打开XBOX应用，在设置中缺失的依赖关系中找到`Microsoft Store`安装即可，非常快捷方便。

![XBOX](/images/2023/0603/xbox.png 'XBOX')

> Q: 若连XBOX应用也没有怎么办
> 
> A: https://www.xbox.com/en-US/xbox-game-pass/pc-game-pass


### 通过Appx安装

#### 安装微软商店

1. 访问离线下载网站：https://store.rg-adguard.net/

2. 在搜索框左侧选择`PackageFamilyName`，输入`Microsoft.WindowsStore_8wekyb3d8bbwe`获取下载链接

  ![下载离线安装包](/images/2023/0603/applink.png '下载离线安装包')

3. 根据系统版本下载主程序的`appxbunle`文件和各个依赖的`appx`文件

4. 将下载的所有文件放到一个文件夹下，如`D:\Microsoft.WindowsStore`

5. 管理员身份打开`PowerShell`，输入以下命令回车即可

```powershell
Add-AppxPackage -Path "D:\Microsoft.WindowsStore\Microsoft.WindowsStore_12107.1001.15.0_neutral___8wekyb3d8bbwe.AppxBundle" -DependencyPath "D:\Microsoft.WindowsStore\Microsoft.UI.Xaml.2.4_2.42007.9001.0_x64__8wekyb3d8bbwe.Appx", "D:\Microsoft.WindowsStore\Microsoft.NET.Native.Framework.2.2_2.2.29512.0_x64__8wekyb3d8bbwe.Appx", "D:\Microsoft.WindowsStore\Microsoft.NET.Native.Runtime.2.2_2.2.28604.0_x64__8wekyb3d8bbwe.Appx", "D:\Microsoft.WindowsStore\Microsoft.VCLibs.140.00_14.0.30704.0_x64__8wekyb3d8bbwe.Appx"
```


#### 安装公司门户

1. 访问离线下载网站：https://store.rg-adguard.net/

2. 在搜索框左侧选择`URL (link)`，输入`https://apps.microsoft.com/store/detail/%E5%85%AC%E5%8F%B8%E9%97%A8%E6%88%B7/9WZDNCRFJ3PZ`获取下载链接

3. 根据系统版本下载主程序的`appxbunle`文件和各个依赖的`appx`文件

4. 将下载的所有文件放到一个文件夹下，如`D:\Microsoft.CompanyPortal`

5. 管理员身份打开`PowerShell`，输入以下命令回车即可

```powershell
Add-AppxPackage -Path "D:\Microsoft.CompanyPortal\Microsoft.CompanyPortal_11.2.58.0_neutral___8wekyb3d8bbwe.AppxBundle" -DependencyPath "D:\Microsoft.CompanyPortal\Microsoft.UI.Xaml.2.7_7.2208.15002.0_x64__8wekyb3d8bbwe.Appx", "D:\Microsoft.CompanyPortal\Microsoft.NET.Native.Framework.2.2_2.2.29512.0_x64__8wekyb3d8bbwe.Appx", "D:\Microsoft.CompanyPortal\Microsoft.NET.Native.Runtime.2.2_2.2.28604.0_x64__8wekyb3d8bbwe.Appx", "D:\Microsoft.CompanyPortal\Microsoft.VCLibs.140.00_14.0.30704.0_x64__8wekyb3d8bbwe.Appx", "D:\Microsoft.CompanyPortal\Microsoft.Services.Store.Engagement_10.0.19011.0_x64__8wekyb3d8bbwe.Appx"
```