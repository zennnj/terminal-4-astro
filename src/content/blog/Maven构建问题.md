---
title: Maven构建问题
abbrlink: 4ee3286d
date: 2025-05-02 21:05:30
tags: problems
---

哎呀我草这个maven怎么一直爆红啊，记录一下解决方案。。。

stackoverflow谢谢你....



> 2025/5/2

# **pom.xml文件开头\<project\>报红:**

> 2025/5/2

Non-resolvable parent POM for org. example:demo1:0.0.1-SNAPSHOT: The following artifacts could not be resolved: org. springframework. boot:spring-boot-starter-parent:pom:3.4.5 (absent): org. springframework. boot:spring-boot-starter-parent:pom:3.4.5 failed to transfer from https:// repo. maven. apache. org/ maven2 during a previous attempt. This failure was cached in the local repository and resolution is not reattempted until the update interval of central has elapsed or updates are forced. Original error: Could not transfer artifact org. springframework. boot:spring-boot-starter-parent:pom:3.4.5 from/ to central (https:// repo. maven. apache. org/ maven2): Connect to repo. maven. apache. org:443 [repo. maven. apache. org/ 146.75.48.215] failed: Connect timed out and 'parent. relativePath' points at no local POM

不仅如此，我的项目文件夹也没有正常标识(e.g.资源文件的三横)

**解决方案:**
删除c盘用户文件夹下的.m2文件 这个文件是本地缓存

所以问题应该是springboot starter这个依赖我用的是最新版本，而缓存里还是上一个版本，所以没下成功？



# Lombok log缺失

根据网上说法更换了Lombok版本、增加了注释说明，还是没有用！
最后看弹幕解决了...

 **解决方案**:

在设置里面搜索注解处理器，把default和底下的都改成从项目类路径获取处理器

## 所有的log，constructor失效

都是LOMBOK依赖问题：）

```
<version>${lombok.version}</version>
```

让他自动选版本吧。

## Lombok 问题的终极答案



```
Class com.sun.tools.javac.tree.JCTree$JCImport does not have member field ‘com.sun.tools.javac.tre
```



[spring boot - Compilation error after upgrading to JDK 21 - "NoSuchFieldError: JCImport does not have member field JCTree qualid" - Stack Overflow](https://stackoverflow.com/questions/77171270/compilation-error-after-upgrading-to-jdk-21-nosuchfielderror-jcimport-does-n)

没错，还是jdk版本太高了，我把项目jdk设置为8后一切都解决了

要么升级lombok版本 要么降级jdk版本，choose one！
