---
title: 简单shell脚本
abbrlink: 26c51008
date: 2025-09-28 10:50:55
tags: learn
description: "简单贝壳"
sticky: 0
draft: false
---

编辑器`vim` / `nano` 左转Linux

vi game.sh

> 不需要.sh后缀，但是一般来说要加



`echo $HOME` 当前用户的目录

`echo $PATH` 存储系统的查找目录

`echo $SHELL` 当前系统默认的shell的路径

`echo $0` 当前执行脚本的名字

# 脚本基础



```shell
echo "请输入您的姓名"
read name
echo "您好，$name"
```

## 执行文件

- `bash  game.sh`
- `./game.sh`
  - 直接执行方式需要给予权限`chmod +x game.sh` 详见Linux
- `./game.sh param1 param2` 可以执行时传递参数



## 环境变量

- `export name(变量名)=xxx`
  - 只在当前shell会话中有用
- 在配置文件中配置，bash的配置文件是.bashrc，配置后需要source重载或重进后生效



生成随机数`number=$(shuf -i 1-10 -n 1 )`

让GPT生成了一个实例脚本

```shell
#!/usr/bin/env bash
# beginner_tutorial.sh
# 这是一个面向初学者的 shell 脚本示例。注释尽可能详细，方便学习。
# 运行: chmod +x beginner_tutorial.sh
#      ./beginner_tutorial.sh [可选的参数]

# ---------- 基本信息 ----------
SCRIPT_NAME="$(basename "$0")"   # 脚本名（basename 去掉路径）
START_TIME="$(date '+%Y-%m-%d %H:%M:%S')"

echo "==== 欢迎使用 Shell 入门示例脚本 ===="
echo "脚本: $SCRIPT_NAME  启动时间: $START_TIME"
echo

# ---------- 简单说明函数 ----------
show_help() {
  # 函数：打印帮助信息
  cat <<'HELP'
用法:
  ./beginner_tutorial.sh [arg1 arg2 ...]

脚本示例演示:
  - 变量、读取输入、位置参数 ($1, $2 ...)
  - if / case 条件判断
  - for / while 循环
  - 函数与返回值
  - 数组、字符串操作
  - 简单文本处理（grep）
  - trap 捕捉 Ctrl+C 信号

按数字选择菜单中的操作，或传入 "auto" 参数试运行几个示例。
HELP
}

# 如果用户传入 -h 或 --help，显示帮助并退出
for a in "$@"; do
  if [[ "$a" == "-h" || "$a" == "--help" ]]; then
    show_help
    exit 0
  fi
done

# ---------- 位置参数示例 ----------
# $1 是第一个参数，$2 第二个，$@ 是所有参数的数组形式，$# 是参数个数
echo "传入的位置参数数量: $#"
if [[ $# -gt 0 ]]; then
  echo "位置参数内容（按顺序）: $@"
else
  echo "没有传入位置参数（可以试试 ./beginner_tutorial.sh 你好 世界）"
fi
echo

# ---------- 变量与替换 ----------
name="Alice"            # 直接赋值：变量名不带 $，引用时带 $
readonly GREETING="Hi"  # readonly 使变量不可变（常量）
echo "示例变量 name=$name, GREETING=$GREETING"
echo

# ---------- 读取用户输入 ----------
# read 用于从标准输入读取一行
echo -n "请输入你的名字（回车）: "
read user_name
if [[ -z "$user_name" ]]; then
  # -z 判断字符串是否为空
  user_name="匿名用户"
fi
echo "你好, $user_name！"
echo

# ---------- if / elif / else 条件示例 ----------
# 这里用一个数字判断演示条件分支
echo -n "输入一个整数（我会判断它是正/负/零）："
read num_input

# 检查是否为整数（简单正则）
if [[ "$num_input" =~ ^-?[0-9]+$ ]]; then
  if [[ "$num_input" -gt 0 ]]; then
    echo "你输入的是正数：$num_input"
  elif [[ "$num_input" -lt 0 ]]; then
    echo "你输入的是负数：$num_input"
  else
    echo "你输入的是零"
  fi
else
  echo "你输入的不是整数，跳过数字判断。"
fi
echo

# ---------- case 语句（类似 switch） ----------
echo -n "输入 yes/no/other："
read yn
case "$yn" in
  y|Y|yes|Yes)
    echo "你选择了 yes"
    ;;
  n|N|no|No)
    echo "你选择了 no"
    ;;
  *)
    echo "选择了其他：$yn"
    ;;
esac
echo

# ---------- for 循环（遍历列表） ----------
echo "for 循环示例：打印前三个传入的位置参数（如果有）"
i=1
for p in "$@"; do
  echo " 参数 $i -> $p"
  ((i++))  # (( )) 中可以做算术运算
  if [[ $i -gt 3 ]]; then
    break
  fi
done
echo

# ---------- while 循环 ----------
echo "while 循环示例：从 5 倒计时到 1（每秒）"
count=5
while [[ $count -gt 0 ]]; do
  echo "倒计时：$count"
  sleep 1    # 暂停 1 秒钟（可以观察）
  ((count--))
done
echo "倒计时结束！"
echo

# ---------- 函数与返回值 ----------
# 定义一个函数用于计算两个整数的和并返回（通过 echo 输出结果）
add_numbers() {
  # 参数: $1 $2
  if ! [[ "$1" =~ ^-?[0-9]+$ && "$2" =~ ^-?[0-9]+$ ]]; then
    echo "错误：add_numbers 需要两个整数参数" >&2
    return 1  # 函数退出码：1 表示失败
  fi
  local a=$1
  local b=$2
  local sum=$((a + b))   # 算术计算（注意：整数运算）
  echo "$sum"            # 通过标准输出返回值（常见做法）
  return 0               # 成功
}

echo "函数示例：计算 7 + 13"
result="$(add_numbers 7 13)" && echo "结果是：$result" || echo "计算失败"
echo

# ---------- 数组操作 ----------
# 定义数组（注意：数组索引从 0 开始）
fruits=("apple" "banana" "cherry")
echo "数组示例：全部元素 -> ${fruits[@]}"
echo "第一个元素 -> ${fruits[0]}"
echo "数组长度 -> ${#fruits[@]}"
# 遍历数组（索引法）
for idx in "${!fruits[@]}"; do
  echo "fruits[$idx] = ${fruits[$idx]}"
done
echo

# ---------- 字符串操作（常见） ----------
s="Hello,Shell"
echo "字符串示例：原始 -> $s"
echo "取子串（从索引 6 长度 5） -> ${s:6:5}"
echo "查找长度 -> ${#s}"
echo "替换（Hello -> Hi） -> ${s/Hello/Hi}"
echo

# ---------- 管道、重定向与简单文本处理 ----------
# 创建一个临时文件并写入若干行文本，演示 grep 管道
tmpfile="$(mktemp)"
cat > "$tmpfile" <<EOF
apple
banana
apple pie
grape
pineapple
EOF

echo "临时文件内容："
cat "$tmpfile"
echo "使用 grep 搜索包含 'apple' 的行："
grep "apple" "$tmpfile" || true  # grep 失败时会返回非零，使用 || true 避免脚本退出（如果启用了 errexit）
echo

# 清理临时文件
rm -f "$tmpfile"

# ---------- trap：捕捉信号（比如 Ctrl+C） ----------
on_interrupt() {
  echo
  echo "检测到中断（Ctrl+C），正在清理并退出..."
  # 在这里可以做一些清理操作
  exit 130   # 130 是常见的中断退出码
}
# trap 将 SIGINT（Ctrl+C）和 EXIT 绑定到处理函数
trap 'on_interrupt' INT

# ---------- 小练习菜单（供你操作并熟悉） ----------
menu() {
  cat <<MENU

请选择下面的操作（输入编号并回车）：
 1) 显示当前目录和文件（ls -la）
 2) 显示当前环境变量（前 10 个）
 3) 创建并查看一个示例文件（temp_demo.txt）
 4) 显示当前登录用户信息（whoami）
 5) 退出菜单

输入 q 也可以退出菜单。

MENU

  while true; do
    echo -n "你的选择: "
    read choice
    case "$choice" in
      1)
        echo "当前目录：$(pwd)"
        ls -la
        ;;
      2)
        echo "环境变量（前 10）："
        # env 列出环境变量，head -n10 显示前 10 行
        env | head -n 10
        ;;
      3)
        echo "创建示例文件 temp_demo.txt 并写入三行文本..."
        cat > temp_demo.txt <<EOT
这是示例文件第一行
第二行：$(date)
第三行：由 $USER 创建
EOT
        echo "文件内容："
        cat temp_demo.txt
        ;;
      4)
        echo "当前用户：$(whoami)"
        ;;
      5|q|Q)
        echo "退出菜单。"
        break
        ;;
      *)
        echo "无效选择，请输入 1-5 或 q 退出。"
        ;;
    esac
    echo    # 空行分隔每次操作
  done
}

# 如果第一个位置参数是 "auto"，就自动执行示例（便于快速演示）
if [[ "$1" == "auto" ]]; then
  echo "自动模式：将演示部分功能..."
  add_numbers 2 3
  menu
else
  echo "进入交互式菜单（可以试试输入 auto 参数自动运行一段演示）"
  menu
fi

# 取消 trap（可选）
trap - INT

# ---------- 结尾与退出码 ----------
END_TIME="$(date '+%Y-%m-%d %H:%M:%S')"
echo
echo "脚本执行结束 时间: $END_TIME"
exit 0

```



然后又问了GPT：

> ## 🧩 **1. `cat << EOF` 是什么？和 `echo` 有什么区别？**
>
> 这叫做 **Here Document（重定向输入块）**，语法是：
>
> ```shell
> cat <<EOF
> 这里的所有内容都会被当作 cat 的标准输入
> 你可以写多行
> 甚至写变量：$USER
> EOF
> ```
>
> 直接创建了一个带多行内容的文件，非常常用。
>
> ```shell
> cat > myfile.txt <<EOF
> 这是文件第一行
> 第二行：$(date)
> 第三行：当前用户是 $USER
> EOF
> ```
>
> ---
>
> ## 🔢 **2. `"$num_input" =~ ^-?[0-9]+$` 是什么意思？**
>
> 这是 **正则表达式匹配**（regex match），完整语法是：
>
> ```
> [[ "$变量" =~ 正则表达式 ]]
> ```
>
> 逐个解释：
>
> | 元素         | 含义                                            |
> | ------------ | ----------------------------------------------- |
> | `[[ ... ]]`  | Bash 的“测试命令”，类似 `if` 判断语句里的条件块 |
> | `=~`         | 表示“正则匹配”运算符（不是等号）                |
> | `^-?[0-9]+$` | 一段正则表达式，用来匹配整数                    |
> | `^`          | 匹配字符串的开头                                |
> | `-?`         | 表示一个可选的 `-`（负号）                      |
> | `[0-9]+`     | 表示 1 个或多个数字                             |
> | `$`          | 匹配字符串的结尾                                |
>
> 所以：
>
> - `123` ✅ 匹配
> - `-45` ✅ 匹配
> - `3.14` ❌ 不匹配（因为有小数点）
> - `abc` ❌ 不匹配
>
> ---
>
> ## 🔄 **3. `case` 语句**
>
> `case` 是 Bash 里相当于 C/C++ 的 `switch`，但更灵活，**可以用通配符、正则匹配字符串模式**。
>
> ### 基本语法
>
> ```
> case 变量名 in
>   模式1)
>     命令序列
>     ;;
>   模式2)
>     命令序列
>     ;;
>   *)
>     默认命令序列
>     ;;
> esac
> ```
>
> 特点：
>
> - 每个 `;;` 表示“结束这个分支”。
> - `*` 表示“默认情况”。
> - `|` 可以连接多个匹配模式。
> - 模式可以使用通配符（`*`, `?`, `[a-z]`），比 C/C++ 的 switch 灵活很多。
>
> ------
>
> ## 🧮 **4. `return 0` 和 `exit 0` 的区别**
>
> | 命令       | 作用范围                           | 通常用法                 |
> | ---------- | ---------------------------------- | ------------------------ |
> | `return N` | 仅在函数或被 `source` 的脚本中生效 | 用于函数中返回状态码     |
> | `exit N`   | 结束整个脚本进程                   | 用于脚本结束时返回状态码 |
>
> ### 举例：
>
> ```
> add() {
>   local sum=$(( $1 + $2 ))
>   echo "$sum"
>   return 0  # 函数执行成功
> }
> 
> add 3 4   # 调用函数
> echo "函数运行完脚本还在继续"
> 
> exit 0    # 整个脚本在这里终止
> echo "这行不会执行"
> ```
>
> 简而言之：
>
> - **`return`** 就像 C 函数里的 `return`，结束函数；
> - **`exit`** 就像 `exit()` 系统调用，整个程序结束。
>
> **退出码（Exit Code）约定：**
>
> - `0` = 成功
> - 非 0 = 失败（不同值代表不同错误类型）
>
> 你可以在终端输入 `echo $?` 查看上一条命令的退出码。
>
> ------
>
> ## ⚙️ **5. `trap` 是干嘛的？**
>
> `trap` 用于**捕捉信号（signal）**，类似于 C 里的 `signal()` 或 `try...finally`。
>
> 语法：
>
> ```
> trap '命令序列' 信号名
> ```
>
> 例如：
>
> ```
> cleanup() {
>   echo "捕获到 Ctrl+C，正在清理临时文件..."
>   rm -f temp.txt
>   exit 130
> }
> 
> trap cleanup INT   # INT 表示 Ctrl+C（SIGINT 信号）
> ```
>
> 这样，当用户在脚本运行时按下 Ctrl+C：
>
> - 程序不会立刻退出
> - 而是先执行 `cleanup` 函数，再退出
>
> ### 常见信号：
>
> | 信号名 | 含义                                 | 触发方式                   |
> | ------ | ------------------------------------ | -------------------------- |
> | `INT`  | Interrupt                            | Ctrl + C                   |
> | `TERM` | Terminate                            | 系统杀进程                 |
> | `EXIT` | 程序退出时触发                       | 无论正常或异常退出都会触发 |
> | `ERR`  | 命令出错时触发（结合 set -e 时有用） |                            |
>
> 例子：
>
> ```
> trap 'echo "脚本即将退出"; rm -f temp.txt' EXIT
> ```
>
> 无论脚本怎么退出，都会执行这条清理命令，**相当于“析构函数”或 C++ 的 RAII。**
>
> 

