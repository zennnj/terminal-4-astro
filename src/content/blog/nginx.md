---
category: 前端
title: nginx
tags: learn
categories: 前端
abbrlink: a477be03
date: 2025-12-03 13:11:30
---

#  介绍

**Nginx（发音：engine-x）** 是一个**高性能的 Web 服务器、反向代理服务器和负载均衡器**。
 它不是 Java 框架，也不是数据库，而是运行在操作系统上的独立程序（比如在 Linux 上安装的 nginx 服务）。

简单来说：

> Spring Boot 负责“生成网页或接口的数据”，
> 而 Nginx 负责“把这些网页或接口高效地传递给用户”。

nginx占用80端口



## Nginx 的主要作用

### 1️⃣ **反向代理**

客户端访问 `www.example.com/api`，Nginx 把请求转发给后端 Spring Boot（例如 `localhost:8080`）。
 这样用户看不到后端真实地址，提高安全性。

> e.g.
>
> 前端请求地址：http://localhost/api/employee/login
>
> 后端接口地址：http://localhost:8080/admin/employee/login

### nginx 反向代理的配置方式：



### 2️⃣ **静态资源服务器**

把前端的打包文件（如 Vue、React 打包生成的 `dist/` 文件夹）放在 Nginx 上托管，
 它直接返回 HTML/CSS/JS，而不是经过 Spring Boot。

### 3️⃣ **负载均衡**

当你项目做大后，可以部署多个 Spring Boot 实例。
 Nginx 可以自动把请求分发给不同的服务器，提高并发能力和可用性。

### 4️⃣ **安全与限流**

Nginx 可以做：

- HTTPS（SSL证书配置）
- 防止恶意请求（限制频率）
- 跨域配置（CORS）
- 自定义错误页面

## 配置文件nginx.conf

```nginx
	upstream webservers{
    	#负载均衡
	  	server 127.0.0.1:8080 weight=90 ;
	  	#server 127.0.0.1:8088 weight=10 ;
	}

    server {
    	#反向代理
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html/sky;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # 反向代理,处理管理端发送的请求
        location /api/ {
			proxy_pass   http://localhost:8080/admin/;
            #proxy_pass   http://webservers/admin/;
        }
		
		# 反向代理,处理用户端发送的请求
        location /user/ {
            proxy_pass   http://webservers/user/;
        }
		
		# WebSocket
		location /ws/ {
            proxy_pass   http://webservers/ws/;
			proxy_http_version 1.1;
			proxy_read_timeout 3600s;
			proxy_set_header Upgrade $http_upgrade;
			proxy_set_header Connection "$connection_upgrade";
        }
	}

```



