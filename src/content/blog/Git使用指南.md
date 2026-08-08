---
category: 系统技术
title: Git使用指南
categories: 系统技术
abstract: 
abbrlink: 74add858
date: 2024-11-10 09:49:24
tags: learn
---

重温

# 流程
修改------>暂存区------>仓库
     add       commit
  (文件记录)
git commit -a -m = git commit -am
# git reset回退版本
`-soft` 工作去和暂存区都不会被清空
`-hard` 工作去和暂存区都会被清空
`-mixed` 默认参数 工作区不会被清空 暂存区会被清空
`git relog` 操作历史记录  可以撤回误操作

# git diff
一般有gui查看
| cmd                                                    |                                   |
| :----------------------------------------------------- | :-------------------------------- |
| git diff                                               | `工作期` VS `暂存区`              |
| git diff HEAD                                          | `工作期` + `暂存区` VS `本地仓库` |
| git diff --cached/git diff --staged                    | `暂存区` VS `本地仓库`            |
| get diff <commit_hash><commit_hash>/git diff HEAD~HEAD | 比较提交之间的差异                |
| git diff <branch_name><branch_name>                    | 比较分支之间的差异                |

# .gitignore
列出哪些文件需要被忽略
可以从github上直接拿

# 远程仓库
## ssh
**生成密钥** `ssh-keygen -t rsa -b 4096`
第二次生成需要输入新建文件名称
私钥文件:id_rsa 公钥文件:id_rsa.pub
在github主页ssh上添加.pub文件里的内容
*如果是第二次生成密钥 需要`tail -5 config` 表示访问github时指定使用这个文件里的密钥
**克隆仓库** `git clone repo-address`
**推送更新内容** `git push <remote><branch>`
**拉取更新内容** `git pull<remote>`
## 关联本地仓库和远程仓库
github上有提示代码

# vsc使用git
`??` (Untracked)
`M`  (Modified)
`A`  (Added)
`D`  (Deleted)
`R`  (Renamed)
`U`  (Updated)已更新未合并

# Branch
`git branch` 查看分支列表
`git branch branch-name` 创建分支
`git switch branch-name` 切换分支
`git merge branch-name` 合并分支(把branch-name合并到当前分支下)
`git branch -d branch-name` 删除分支(已合并)
`git branch -D branch-name` (未合并)
`git log --graph --decorate --all` 图形显示
# 解决合并冲突

# rebase
移植
`git rebase branch-name`
**Merge**不会破坏原分支的提交历史 方便回溯和查看 会产生额外的提交记录
**Rebase** 不会新增额外的提交记录 形成线性历史 改变了当前分支branch out的节点 应避免在共享分支使用

END