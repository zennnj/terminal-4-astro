---
category: 系统技术
title: Linux
tags: learn
categories: 系统技术
abbrlink: 15691
date: 2024-09-10 19:03:02
---

只是简单个人记录，没有多少调理
~~我现在看见运维二字就想笑~~

 windows subsystem for linux （WSL）
[神秘链接1](https://blog.csdn.net/Academiction/article/details/140902670 "好像已经没用了")
[WSL官方使用教程](https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment "lookhere^^")

[WSL子系统启动报错 Wsl/Service/CreateInstance/CreateVm/HCS_E_SERVICE_NOT_AVAILABLE_wsl启动失败-CSDN博客](https://blog.csdn.net/no1xium/article/details/131285182)

bro开模拟器玩昨日圆车之后忘了吧虚拟机打开了

**控制面板-程序-程序和功能-启用和关闭windows功能-启用wsl和虚拟机平台** 就可以

# 基础命令
## ls
 list

`ls -l` 每个文件的详细信息 `long`
`d/-`目录或普通文件`rwx`read&write&执行`r--` `r-x`group用户权限`r-x`其他人权限
`ls -h` 以人类可读的方式展示列表 `human` 
`ls -a`
`.`开头的文件是隐藏文件
`ls -la`=`ll`以详细的方式列出来


## cd

`cd ..`进入上一层目录
`cd .`进入当前目录（啥用
`cd ../..`上层目录的上层目录
**在windows操作系统里是\，除了windows系统都是/**
`cd -`回到你刚才所在的目录

## pwd
print working directory(打印当前路径)

## cat/head/tail
看文件内容
`head --lines=2 README.md`只看两行

## less/more
看全文
按`Q`退出

## nano/vim
文本编辑器
vim 按`I`进入insert模式后修改 `Esc` 退出Insert状态
按`:q`退出 `:q!`强制退出 `:wq`写后退出

## file/where
file查看文件属性
where查找文件位置，可能是which，whereis

## echo
打印
``` Linux
h="hello"
echo $h
echo "abc$h"
echo "abc${h}efg"
```
**变量的使用要加`$`,可以自由连接`{}`防止歧义**

## mv
重命名
mv 文件名 新文件名

## touch
改变时间戳

## mkdir/rmdir
`make directory`目录创建指令
`remove directory`
```
mkdir -p dir/dir2/dir3
tree dir #查看目录
```
创建递归目录

## rm
删除命令

## cp
复制命令

## 进程相关
### top
进程查看
**快捷键**
`C` 显示进程绝对路劲
`P` 根据CPU使用率排序
`M` 根据物理内存使用率排序
`1` 显示每个核的CPU状况
*这居然是大小写敏感的...*

`top -c` 完整进程动态
`top -d 5` 指定信息刷新时间5秒
`top -p 1877` 指定监控进程1877的状态
`top -n 2` 设置信息更新次数

### ps
`process status` 进程管理
```
ps -aux | less # 分页展示
ps -A
ps -ef
ps -axf #树状展示
ps aux | grep ssh #查看特定进程信息，这里查看的是ssh相关
```
这几个好像没什么区别（

## 查看服务运行日志
```
nohup ping www.baidu.com &
```
把ping www.baidu.com 的日志放到 nohup.out里
后续可以使用`less`结合`-f`或`tail`结合`shift+f`实现日志的实时查看

### 排查系统日志
`latest` 显示所有用户的最近登录信息
`maillog` 记录系统上的邮件运行信息

## 学习命令
```
-h
--help
ls --help 
```
 ls有快捷帮助 其他可能不行
```
man cd
```
`man`+空格+`命令`来查找对应的命令
按`q`可以退出
不过也可能没有，比如 man cd
```
whatis ls
```
简单查看

```
info ls
```
好像是更详细的，操作也更麻烦

# 简单shell

使用vim或nano创建修改.sh文件
后`chmod a+x 文件名`赋予执行权限
`./文件名`执行文件

## for循环
```
for ff in week*  #以week开头的文件 ; week??(以week开头后有两个字符的文件)
do
echo $ff #循环体
echo ${ff#week} #把week给掐掉
echo chapter${ff#week} #再把chapter加上
mv $ff chapter${ff#week} #这里前一个ff是不是$不加也行  
done
```
**没有撤销机制^^**
**但是可以用git调回上一个版本**





