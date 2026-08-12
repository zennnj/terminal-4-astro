---
title: Docker
abbrlink: f5f9fa9b
date: 2025-10-18 13:55:53
tags: learn
---

图标好看。



Docker仓库 [Docker Hub Container Image Library | App Containerization](https://hub.docker.com/)

镜像仓库↑，镜像和容器相当于类和实例

Docker是容器的一种实现，是一个容器化的解决方案和平台，容器是一种虚拟化技术，和虚拟机类似，不同的是不需要完整的操作系统，而是使用宿主机的操作系统。



# 安装

[Docker: Accelerated Container Application Development](https://www.docker.com/)



# 容器化和Dockerfile

- 创建一个Dockerfile
- 使用Dockerfile构建镜像
- 使用镜像创建和运行容器



# 创建镜像

[ =＞ERROR [internal\] load metadata for docker.io/library/alpine:3.13+vscode+python+docker+本地调试问题-CSDN博客](https://blog.csdn.net/m0_74140153/article/details/142309629)

网络问题。。

解决办法：先把node给docker pull了

## dockerfile

根目录下创建名为Dockerfile（无后缀）的文件

```dockerfile
FROM node:14-alpine
COPY index.js /index.js
CMD node /index.js
```

`node` 网站外运行js的环境，`-alpine` linux的一个发行版，node是基于这个构建的

`COPY` 将文件夹里的index.js文件复制到镜像文件夹的/index.js

`CMD` 执行参数

```shell
 docker build -t hello-docker .
```

构建目录，`hello-docker`镜像名字，`.`当前目录

```shell
docker image ls
```

查看所有镜像

```shell
docker run hello-docker
```

运行

```shell
docker pull hello-docker
```

从docker hub拉镜像，和github差不多



[Play with Docker](https://labs.play-with-docker.com/) 在线虚拟机



**以上所有操作可以在dockerdesktop图形化界面中完成**

# 逻辑卷

持久化容器中的数据



# Docker Compose

- 用于定义和运行多容器Docker应用程序的工具
- 使用YAML文件来配置应用程序的服务
- 一条命令即可创建并启动所有服务
