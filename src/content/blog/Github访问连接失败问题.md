---
category: 杂项
title: Github访问连接失败问题
tags: problems
categories: 杂项
abbrlink: 7165
date: 2024-09-11 20:22:42
---

感觉完全就是因为vpn的问题!!

不知道出了什么问题来了学校之后git一直连接失败，几个办法换着用.....
![why..](/images/Github访问连接失败问题/1.png)

**查询代理**
```
git config --global http.proxy
```

# 设置github访问代理
```
git config --global https.proxy 127.0.0.1:33210
git config --global http.proxy 127.0.0.1:33210
```

# 取消github访问代理
```
git config --global --unset http.proxy
git config --global --unset https.proxy
```
这两个是一个有用了下一次就是另一个有用了......



```
ssh -T git@github.com
```
这个的运行结果是
![ee](/images/Github访问连接失败问题/2.png)
通过生成了ssh秘钥添加到github上后连接成功了，
不过呢，还是部署失败了！
...............

似乎我配置的确实没问题，估计只是单纯的网络问题...
可能是用VPN导致的，更好地解决方案待更新...

10.13 可以在设置了代理的情况下开vpn

