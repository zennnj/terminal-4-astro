---
title: MySQL
tags: learn
abbrlink: 9977
date: 2024-09-26 16:32:33
description: "刚学没几周就因为忘记了MySQL的密码卡进度实在令人忍俊不禁"
sticky: 0
draft: false
---


[兄弟你的笔记我偷了](https://jimhackking.github.io/%E8%BF%90%E7%BB%B4/MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/#more "^ ^")

# [Mysql忘记登录密码的解决步骤](https://blog.csdn.net/hkdhkdhkd/article/details/121158926)
哈哈（流汗
# VSCODE连接MySQL
添加拓展MySQL,资源管理器里按`+`连接

在MySQL终端输入
`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`
root、password 分别为数据库账户，密码
原因：登录数据库的客户端跟mysql8.0不兼容了，mysql8.0密码认证采用了新的密码格式

# 软件安装

## Navicat



[Navicat Premium 17 激活破解及安装教程 ](https://www.cnblogs.com/gdjgs/p/18377623)

[网盘地址](https://pan.baidu.com/s/1TpzxtDGsEceQ1nGE03sUyw)

提取码：3ciw



[Navicat使用快速入门教程_navicat使用教程](https://blog.csdn.net/qq_45069279/article/details/105919312)

## Mysql

[MySQL :: Download MySQL Installer](https://dev.mysql.com/downloads/installer/)

# MySQL启动
services.msc

``net start mysql``
``net stop mysql``

**客户端连接**
① MySQL提供的客户端
② mysql *[-h 127.0.0.1] [-P 3306]* -u root -p(1234) <-()默认密码
(需要配置环境变量)([-h 127.0.0.1] [-P 3306]可省略)

- 关系型数据库RDBMS: 建立在关系模型基础上，有多张相互连接的**二维表**组成的数据库。

  

# SQL
## SQL的通用语法
以分号结尾
MySQL数据库的SQL雨具不区分大小写，关键字建议使用大写
注释: `--` 或 `#` 多行注释使用 `/* */`

## SQL分类
- [数据定义语言(DDL)](#DDL)
- [数据操作语言(DML)](#DML)
- [数据查询结构(DQL)](#DQL)
- [数据控制语言(DCL)](#DCL)

## DDL

###  查询数据库

> 关于表结构的查询操作，工作中一般都是直接基于**图形化界面操作**。 

**查询所有数据库：**

```sql
show databases;
```

**查询当前数据库：**

```sql
select database();
```

**查看指定表结构**

```sql
desc 表名 ;#可以查看指定表的字段、字段的类型、是否可以为NULL、是否存在默认值等信息
```

**查询指定表的建表语句**

```sql
show create table 表名 ;
```

Navicat中:
![](/images/MySQL/image-5.png)


###  创建数据库

**语法：**

```sql
create database [ if not exists ] 数据库名;
```

==注意：在同一个数据库服务器中，不能创建两个名称相同的数据库，否则将会报错。==

### 使用数据库

**语法：**

```sql
use 数据库名 ;
```

### 删除数据库

**语法：**

```sql
drop database [ if exists ] 数据库名 ;
```

### 表创建

#### 语法

```sql
create table  表名(
	字段1  字段1类型 [约束]  [comment  字段1注释 ],
	字段2  字段2类型 [约束]  [comment  字段2注释 ],
	......
	字段n  字段n类型 [约束]  [comment  字段n注释 ] 
) [ comment  表注释 ] ;
```

####  约束

| **约束** | **描述**                                         | **关键字**  |
| -------- | ------------------------------------------------ | ----------- |
| 非空约束 | 限制该字段值不能为null                           | not null    |
| 唯一约束 | 保证字段的所有数据都是唯一、不重复的             | unique      |
| 主键约束 | 主键是一行数据的唯一标识，要求非空且唯一         | primary key |
| 默认约束 | 保存数据时，如果未指定该字段值，则采用默认值     | default     |
| 外键约束 | 让两张表的数据建立连接，保证数据的一致性和完整性 | foreign key |



**关键字：auto_increment（自动增长）**

```sql
create table tb_user (
    id int primary key auto_increment comment 'ID,唯一标识', #主键自动增长
    username varchar(20) not null unique comment '用户名',
    name varchar(10) not null comment '姓名',
    age int comment '年龄',
    gender char(1) default '男' comment '性别'
) comment '用户表';
```

![alt text](/images/MySQL/image-4.png)

#### **数值类型**

| 类型        | 大小   | 有符号(SIGNED)范围                                    | 无符号(UNSIGNED)范围                                       | 描述               |
| ----------- | ------ | ----------------------------------------------------- | ---------------------------------------------------------- | ------------------ |
| TINYINT     | 1byte  | (-128，127)                                           | (0，255)                                                   | 小整数值           |
| SMALLINT    | 2bytes | (-32768，32767)                                       | (0，65535)                                                 | 大整数值           |
| MEDIUMINT   | 3bytes | (-8388608，8388607)                                   | (0，16777215)                                              | 大整数值           |
| INT/INTEGER | 4bytes | (-2147483648，2147483647)                             | (0，4294967295)                                            | 大整数值           |
| BIGINT      | 8bytes | (-2^63，2^63-1)                                       | (0，2^64-1)                                                | 极大整数值         |
| FLOAT       | 4bytes | (-3.402823466 E+38，3.402823466351 E+38)              | 0 和 (1.175494351  E-38，3.402823466 E+38)                 | 单精度浮点数值     |
| DOUBLE      | 8bytes | (-1.7976931348623157 E+308，1.7976931348623157 E+308) | 0 和  (2.2250738585072014 E-308，1.7976931348623157 E+308) | 双精度浮点数值     |
| DECIMAL     |        | 依赖于M(精度)和D(标度)的值                            | 依赖于M(精度)和D(标度)的值                                 | 小数值(精确定点数) |

```sql
示例: 
    年龄字段 ---不会出现负数, 而且人的年龄不会太大
	age tinyint unsigned
	
	分数 ---总分100分, 最多出现一位小数
	score double(4,1)
```

**字符串类型**

| 类型       | 大小                  | 描述                         |
| ---------- | --------------------- | ---------------------------- |
| CHAR       | 0-255 bytes           | 定长字符串(需要指定长度)     |
| VARCHAR    | 0-65535 bytes         | 变长字符串(需要指定长度)     |
| TINYBLOB   | 0-255 bytes           | 不超过255个字符的二进制数据  |
| TINYTEXT   | 0-255 bytes           | 短文本字符串                 |
| BLOB       | 0-65 535 bytes        | 二进制形式的长文本数据       |
| TEXT       | 0-65 535 bytes        | 长文本数据                   |
| MEDIUMBLOB | 0-16 777 215 bytes    | 二进制形式的中等长度文本数据 |
| MEDIUMTEXT | 0-16 777 215 bytes    | 中等长度文本数据             |
| LONGBLOB   | 0-4 294 967 295 bytes | 二进制形式的极大文本数据     |
| LONGTEXT   | 0-4 294 967 295 bytes | 极大文本数据                 |

char 与 varchar 都可以描述字符串，char是定长字符串，指定长度多长，就占用多少个字符，和字段值的长度无关 。而varchar是变长字符串，指定的长度为最大占用长度 。相对来说，char的性能会更高些。

```sql
示例： 
    用户名 username ---长度不定, 最长不会超过50
	username varchar(50)
	
	手机号 phone ---固定长度为11
	phone char(11)
```

**日期时间类型**

| 类型      | 大小 | 范围                                       | 格式                | 描述                     |
| --------- | ---- | ------------------------------------------ | ------------------- | ------------------------ |
| DATE      | 3    | 1000-01-01 至  9999-12-31                  | YYYY-MM-DD          | 日期值                   |
| TIME      | 3    | -838:59:59 至  838:59:59                   | HH:MM:SS            | 时间值或持续时间         |
| YEAR      | 1    | 1901 至 2155                               | YYYY                | 年份值                   |
| DATETIME  | 8    | 1000-01-01 00:00:00 至 9999-12-31 23:59:59 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值         |
| TIMESTAMP | 4    | 1970-01-01 00:00:01 至 2038-01-19 03:14:07 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值，时间戳 |

```sql
示例: 
	生日字段  birthday ---生日只需要年月日  
	birthday date
	
	创建时间 createtime --- 需要精确到时分秒
	createtime  datetime
```

### 修改

> 关于表结构的修改操作，工作中一般都是直接基于**图形化界面操作**。 

**添加字段**

```sql
alter table 表名 add  字段名  类型(长度)  [comment 注释]  [约束];
```

**修改数据类型**

```sql
alter table 表名 modify  字段名  新数据类型(长度);
```

```sql
alter table 表名 change  旧字段名  新字段名  类型(长度)  [comment 注释]  [约束];
```

**删除字段**

```sql
alter table 表名 drop 字段名;
```

**修改表名**

```sql
rename table 表名 to  新表名;
```

### 删除

删除表语法：

```sql
drop  table [ if exists ]  表名;
```

---



## DML

### 添加数据（INSERT）

insert语法：

- 向指定字段添加数据

  ~~~mysql
  insert into 表名 (字段名1, 字段名2) values (值1, 值2);
  ~~~

- 全部字段添加数据

  ~~~mysql
  insert into 表名 values (值1, 值2, ...);
  ~~~

- 批量添加数据（指定字段）

  ~~~mysql
  insert into 表名 (字段名1, 字段名2) values (值1, 值2), (值1, 值2);
  ~~~

- 批量添加数据（全部字段）

  ~~~mysql
  insert into 表名 values (值1, 值2, ...), (值1, 值2, ...);
  ~~~

e.g.

~~~mysql
-- 因为设计表时create_time, update_time两个字段不能为NULL，所以也做为要插入的字段
insert into tb_emp(username, name, gender, create_time, update_time)
values ('wuji', '张无忌', 1, now(), now());
~~~

### 修改数据（UPDATE）

update语法：

```sql
update 表名 set 字段名1 = 值1 , 字段名2 = 值2 , .... [where 条件] ;
```

>案例1：将tb_emp表中id为1的员工，姓名name字段更新为'张三'
>```sql
 update tb_emp set name='张三',update_time=now() where id=1;
>```
>
>案例2：将tb_emp表的所有员工入职日期更新为'2010-01-01'
>```sql
 update tb_emp set entrydate='2010-01-01',update_time=now();
>```



<br>

### 删除数据（DELETE） 

delete语法：

```sql
delete from 表名  [where  条件] ;
```

>案例1：删除tb_emp表中id为1的员工
>
>```sql
>delete from tb_emp where id = 1;
>```
>
>案例2：删除tb_emp表中所有员工
>
>```sql
>delete from tb_emp;
>```
>



---



## DQL 

查询关键字：SELECT

查询操作是所有SQL语句当中最为常见，也是最为重要的操作。在一个正常的业务系统中，查询操作的使用频次是要远高于增删改操作的。

### 语法

DQL查询语句，语法结构如下：

```sql
SELECT
	字段列表
FROM
	表名列表
WHERE
	条件列表
GROUP  BY
	分组字段列表
HAVING
	分组后条件列表
ORDER BY
	排序字段列表
LIMIT
	分页参数
```

<br>

### 基本查询

在基本查询的DQL语句中，不带任何的查询条件，语法如下：

- 查询多个字段

  ~~~mysql
  select 字段1, 字段2, 字段3 from  表名;
  ~~~

- 查询所有字段（通配符）

  ~~~mysql
  select *  from  表名;
  ~~~

  > `*`号代表查询所有字段，在实际开发中尽量少用（不直观、影响效率）

- 设置别名

  ~~~mysql
  select 字段1 [ as 别名1 ] , 字段2 [ as 别名2 ]  from  表名;
  ~~~
  > ![alt text](/images/MySQL/image.png)
  >
  > 别名中有特殊字符时，使用''或""包含
  >
  > 

- 去除重复记录

  ~~~mysql
  select distinct 字段列表 from  表名;
  ~~~

<br>

### 条件查询

**语法：**

```sql
select  字段列表  from   表名   where   条件列表 ; -- 条件列表：意味着可以有多个条件
```

常用的比较运算符如下: 

| **比较运算符**       | **功能**                                 |
| -------------------- | ---------------------------------------- |
| >                    | 大于                                     |
| >=                   | 大于等于                                 |
| <                    | 小于                                     |
| <=                   | 小于等于                                 |
| =                    | 等于                                     |
| <> 或 !=             | 不等于                                   |
| between ...  and ... | 在某个范围之内(含最小、最大值)           |
| in(...)              | 在in之后的列表中的值，多选一             |
| like 占位符          | 模糊匹配(_匹配单个字符, %匹配任意个字符) |
| is null              | 是null                                   |

常用的逻辑运算符如下:

| **逻辑运算符**         | **功能**                    |
| ---------------------- | --------------------------- |
| and 或 &&              | 并且 (多个条件同时成立)     |
| or 或 &brvbar;&brvbar; | 或者 (多个条件任意一个成立) |
| not 或 !               | 非 , 不是                   |

***是`||`，但是这个hexo太小杯了一直显示`|/   |/  |`,受不了了***

> ⚠️注意：查询为NULL的数据时，不能使用 `= null`
>
> ```sql
> select id, username, password, name, gender, image, job, entrydate, create_time, update_time
> from tb_emp
> where job is not null ; -- where job is null ;
> ```
> `where entrydate>='2000-01-01' and entrydate<='2010-01-01';`
> <=> `where entrydate between '2000-01-01' and '2010-01-01';`
>
> ```sql
> select id, username, password, name, gender, image, job, entrydate, create_time, update_time
> from tb_emp
> where name like '__';  # 通配符 "_" 代表任意1个字符
> # 这里表示名字有两个字的
> ...
> where name like '张%'; # 通配符 "%" 代表任意个字符（0个 ~ 多个）
> ```

<br>

### 聚合函数

语法：

~~~mysql
select  聚合函数(字段列表)  from  表名 ;
~~~

> 注意 : 聚合函数会忽略空值，对NULL值不作为统计。







常用聚合函数：

| **函数** | **功能**                                                                  |
| -------- | ------------------------------------------------------------------------- |
| count    | 按照列去统计有多少行数据 (如果这一列中有null的行，该行不会被统计在其中。) |
| max      | 计算指定列的最大值                                                        |
| min      | 计算指定列的最小值                                                        |
| avg      | 计算指定列的平均值                                                        |
| sum      | 计算指定列的数值和，如果不是数值类型，那么计算结果为0                     |

> 案例1：统计该企业员工数量
>
> ~~~mysql
> # count(字段)
> select count(id) from tb_emp;-- 结果：29
> select count(job) from tb_emp;-- 结果：28 （聚合函数对NULL值不做计算）
> 
> # count(常量)
> select count(0) from tb_emp;
> select count('A') from tb_emp;
> 
> # count(*)  推荐此写法（MySQL底层进行了优化）
> select count(*) from tb_emp;
> ~~~
>



<br>

### 分组查询

语法：

~~~mysql
select  字段列表  from  表名  [where 条件]  group by 分组字段名  [having 分组后过滤条件];
~~~

案例：查询入职时间在 '2015-01-01' (包含) 以前的员工 , 并对结果根据职位分组 , 获取员工数量大于等于2的职位

~~~mysql
select job, count(*)
from tb_emp
where entrydate <= '2015-01-01'   -- 分组前条件
group by job                      -- 按照job字段分组
having count(*) >= 2;             -- 分组后条件
~~~

> 注意事项:
>
> ​	• 分组之后，查询的字段一般为聚合函数和分组字段，查询其他字段无任何意义
>
> ​	• 执行顺序：where > 聚合函数 > having 

**where与having区别**

- 执行时机不同：where是分组之前进行过滤，不满足where条件，不参与分组；而having是分组之后对结果进行过滤。
- 判断条件不同：**where不能对聚合函数进行判断，而having可以。**

<br>

### 排序查询

语法：

```sql
select  字段列表  
from   表名   
[where  条件列表] 
[group by  分组字段 ] 
order  by  字段1  排序方式1 , 字段2  排序方式2 … ;
```

- 排序方式：

  - ASC ：升序（默认值）
- DESC：降序

> ```sql
> select id, username, password, name, gender, image, job, entrydate, create_time, update_time
> from tb_emp
> order by  entrydate; -- 默认就是ASC（升序）
> -- = order by entrydate ASC;
> ```
>
> ~~~mysql
> select id, username, password, name, gender, image, job, entrydate, create_time, update_time
> from tb_emp
> order by entrydate ASC , update_time DESC;
> ~~~
>
> **注意事项：如果是多字段排序，当第一个字段值相同时，才会根据第二个字段进行排序 **

<br>

### 分页查询

分页查询语法：

```sql
select  字段列表  from   表名  limit  起始索引, 查询记录数 ;
```

> e.g.
>
> ~~~mysql
> select id, username, password, name, gender, image, job, entrydate, create_time, update_time
> from tb_emp
> limit 5; -- 如果查询的是第1页数据，起始索引可以省略，直接简写为：limit 条数
> 
> -- 查询 第3页 员工数据, 每页展示5条记录
> limit 10 , 5; -- 从索引10开始，向后取5条记录
> ~~~
>
> 计算公式 ：   起始索引 = （查询页码 - 1）* 每页显示记录数
>
> 分页查询不同的数据库有不同的实现，MySQL中是LIMIT



### 案例

员工性别统计：

~~~mysql
-- if(条件表达式, true取值 , false取值)
select if(gender=1,'男性员工','女性员工') AS 性别, count(*) AS 人数
from tb_emp
group by gender;
~~~

>  if(表达式, tvalue, fvalue) ：当表达式为true时，取值tvalue；当表达式为false时，取值fvalue

员工职位统计：

~~~mysql
-- case 表达式 when 值1 then 结果1  when 值2  then  结果2 ...  else  result  end
select (case job
             when 1 then '班主任'
             when 2 then '讲师'
             when 3 then '学工主管'
             when 4 then '教研主管'
             else '未分配职位'
        end) AS 职位 ,
       count(*) AS 人数
from tb_emp
group by job;
~~~

> case   表达式    when   值1   then  结果1   [when 值2  then  结果2 ...]     [else result]     end



---



## DCL



---



## 多表设计

项目开发中，在进行数据库表结构设计时，会根据业务需求及业务模块之间的关系，分析并设计表结构，由于业务之间相互关联，所以各个表结构之间也存在着各种联系

### 一对多

>**一对多关系实现：在数据库表中多的一方，添加字段，来关联属于一这方的主键。**
>
>

#### 外键约束

> 外键约束：让两张表的数据建立连接，保证数据的一致性和完整性。  
>
> 对应的关键字：foreign key

外键约束的语法：

```sql
-- 创建表时指定
create table 表名(
	字段名    数据类型,
	...
	[constraint]   [外键名称]  foreign  key (外键字段名)   references   主表 (主表列名)	
);


-- 建完表后，添加外键
alter table  表名  add constraint  外键名称  foreign key(外键字段名) references 主表(主表列名);
```

> ```sql
> -- 修改表： 添加外键约束
> alter table tb_emp  
> add  constraint  fk_dept_id  foreign key (dept_id)  references  tb_dept(id);
> ```
>
> 外键约束（foreign key）：保证了数据的完整性和一致性。

#### **物理外键和逻辑外键**

- 物理外键
  - 概念：使用foreign key定义外键关联另外一张表。
  - 缺点：
    - 影响增、删、改的效率（需要检查外键关系）。
    - 仅用于单节点数据库，不适用与分布式、集群场景。
    - 容易引发数据库的死锁问题，消耗性能。

- 逻辑外键
  - 概念：在业务层逻辑中，解决外键关联。
  - 通过逻辑外键，就可以很方便的解决上述问题。

> **在现在的企业开发中，很少会使用物理外键，都是使用逻辑外键。 甚至在一些数据库开发规范中，会明确指出禁止使用物理外键 foreign key **

### 一对一

一对一关系表在实际开发中应用起来比较简单，通常是用来做单表的拆分，也就是将一张大表拆分成两张小表，将大表中的一些基础字段放在一张表当中，将其他的字段放在另外一张表当中，以此来提高数据的操作效率。

> 一对一 ：在任意一方加入外键，关联另外一方的主键，并且设置外键为唯一的(UNIQUE)

e.g.

> ```sql
> -- 用户基本信息表
> create table tb_user(
>     id int unsigned  primary key auto_increment comment 'ID',
>     name varchar(10) not null comment '姓名',
>     gender tinyint unsigned not null comment '性别, 1 男  2 女',
>     phone char(11) comment '手机号',
>     degree varchar(10) comment '学历'
> ) comment '用户基本信息表';
> 
> 
> -- 用户身份信息表
> create table tb_user_card(
>     id int unsigned  primary key auto_increment comment 'ID',
>     nationality varchar(10) not null comment '民族',
>     birthday date not null comment '生日',
>     idcard char(18) not null comment '身份证号',
>     issued varchar(20) not null comment '签发机关',
>     expire_begin date not null comment '有效期限-开始',
>     expire_end date comment '有效期限-结束',
>     user_id int unsigned not null unique comment '用户ID',
>     constraint fk_user_id foreign key (user_id) references tb_user(id)
> ) comment '用户身份信息表';
> ```



<br>

### 多对多

- 关系：一个学生可以选修多门课程，一门课程也可以供多个学生选择

- 实现关系：建立第三张中间表，中间表至少包含两个外键，分别关联两方主键

>  e.g.
>
> ```sql
> -- 学生表
> create table tb_student(
>     id int auto_increment primary key comment '主键ID',
>     name varchar(10) comment '姓名',
>     no varchar(10) comment '学号'
> ) comment '学生表';
> 
> 
> -- 课程表
> create table tb_course(
>    id int auto_increment primary key comment '主键ID',
>    name varchar(10) comment '课程名称'
> ) comment '课程表';
> 
> 
> -- 学生课程表（中间表）
> create table tb_student_course(
>    id int auto_increment comment '主键' primary key,
>    student_id int not null comment '学生ID',
>    course_id  int not null comment '课程ID',
>    constraint fk_courseid foreign key (course_id) references tb_course (id),
>    constraint fk_studentid foreign key (student_id) references tb_student (id)
> )comment '学生课程中间表';
> 
> ```

## 多表查询

### 介绍

查询用户表和部门表中的数据：

~~~mysql
select * from  tb_emp , tb_dept;
~~~

此时查询结果中包含了总共85条记录，为员工表所有的记录(17行)与部门表所有记录(5行)的所有组合情况，这种现象称之为笛卡尔积。

笛卡尔积：笛卡尔乘积是指在数学中，两个集合(A集合和B集合)的所有组合情况。

> 在多表查询时，需要消除无效的笛卡尔积，只保留表关联部分的数据

```sql
select * from tb_emp , tb_dept where tb_emp.dept_id = tb_dept.id ;
```


### 分类

多表查询可以分为：

1. 连接查询

   - [内连接](#内连接)：相当于查询A、B交集部分数据 

2. [外连接](#外连接)
   - 左外连接：查询左表所有数据(包括两张表交集部分数据)

   - 右外连接：查询右表所有数据(包括两张表交集部分数据)

3. [子查询](#子查询)

### 内连接

隐式内连接语法：

```sql
select  字段列表   from   表1 , 表2   where  条件 ... ;
```

显式内连接语法：

```sql
select  字段列表   from   表1  [ inner ]  join 表2  on  连接条件 ... ;
```

> e.g.
>
> ```sql
> -- 隐式内连接
> select tb_emp.name , tb_dept.name -- 分别查询两张表中的数据
> from tb_emp , tb_dept -- 关联两张表
> where tb_emp.dept_id = tb_dept.id; -- 消除笛卡尔积
> 
> -- 显式内连接
> select tb_emp.name , tb_dept.name 
> from tb_emp emp inner join tb_dept dept
> on emp.dept_id = dept.id; -- 这里是别名
> /*	tableA  as  别名1  ,  tableB  as  别名2 ;
> 	tableA  别名1  ,  tableB  别名2 ; */
> 	
> ```
>
> 注意事项:
>
> 一旦为表起了别名，就不能再使用表名来指定对应的字段了，此时只能够使用别名来指定字段。
> 

#### 隐式 vs 显式

隐式执行逻辑：

1. **先做笛卡尔积**：dish × category（所有行交叉组合）
2. 然后 `WHERE d.category_id = c.id` 再过滤

> 表大时非常浪费：假如 dish 有 1 万条，category 有 100 条，笛卡尔积会生成 **100 万行** 再过滤。

显式执行逻辑：

1. 数据库根据 `ON d.category_id = c.id` **先对两个表做连接匹配**
2. 只产生符合条件的数据

→ **不会产生多余笛卡尔积数据，性能好得多**


### 外连接

**左外连接语法结构：**

```sql
select  字段列表   from   表1  left  [ outer ]  join 表2  on  连接条件 ... ;
```

左外连接相当于查询表1(左表)的所有数据，当然也包含表1和表2交集部分的数据。

**右外连接语法结构：**

```sql
select  字段列表   from   表1  right  [ outer ]  join 表2  on  连接条件 ... ;
```

右外连接相当于查询表2(右表)的所有数据，当然也包含表1和表2交集部分的数据。



> e.g.
>
> ```sql
> -- 左外连接：以left join关键字左边的表为主表，查询主表中所有数据，以及和主表匹配的右边表中的数据
> select emp.name , dept.name
> from tb_emp AS emp left join tb_dept AS dept 
>      on emp.dept_id = dept.id;
> 
> ```
>
> 注意事项：
>
> 左外连接和右外连接是可以相互替换的，只需要调整连接查询时SQL语句中表的先后顺序就可以了。而我们在日常开发使用时，更偏向于左外连接。



### 子查询

SQL语句中嵌套select语句，称为嵌套查询，又称子查询。

```sql
SELECT  *  FROM   t1   WHERE  column1 =  ( SELECT  column1  FROM  t2 ... );
```

>  子查询外部的语句可以是insert / update / delete / select 的任何一个，最常见的是 select。

根据子查询结果的不同分为：

1. [标量子查询](#标量子查询)（子查询结果为单个值[一行一列]）

2. [列子查询](#列子查询)（子查询结果为一列，但可以是多行）

3. [行子查询](#行子查询)（子查询结果为一行，但可以是多列）

4. [表子查询](#表子查询)（子查询结果为多行多列[相当于子查询结果是一张表]）

子查询可以书写的位置：

1. where之后
2. from之后
3. select之后



####  标量子查询

子查询返回的结果是单个值(数字、字符串、日期等)，最简单的形式，这种子查询称为标量子查询。

常用的操作符： =   <>   >    >=    <   <=   

> e.g.
>
> ```sql
> -- 1.查询"教研部"部门ID
> select id from tb_dept where name = '教研部';    #查询结果：2
> -- 2.根据"教研部"部门ID, 查询员工信息
> select * from tb_emp where dept_id = 2;
> 
> -- 合并出上两条SQL语句
> select * from tb_emp where dept_id = (select id from tb_dept where name = '教研部');
> ```



#### 列子查询

子查询返回的结果是一列(可以是多行)，这种子查询称为列子查询。

常用的操作符：

| **操作符** | **描述**                     |
| ---------- | ---------------------------- |
| IN         | 在指定的集合范围之内，多选一 |
| NOT IN     | 不在指定的集合范围之内       |



> e.g.
>
> ```sql
> -- 1.查询"销售部"和"市场部"的部门ID
> select id from tb_dept where name = '教研部' or name = '咨询部';    #查询结果：3,2
> -- 2.根据部门ID, 查询员工信息
> select * from tb_emp where dept_id in (3,2);
> 
> -- 合并以上两条SQL语句
> select * from tb_emp where dept_id in (select id from tb_dept where name = '教研部' or name = '咨询部');
> ```



#### 行子查询

子查询返回的结果是一行(可以是多列)，这种子查询称为行子查询。

常用的操作符：= 、<> 、IN 、NOT IN

> e.g.
>
> ```sql
> -- 查询"韦一笑"的入职日期 及 职位
> select entrydate , job from tb_emp where name = '韦一笑';  #查询结果： 2007-01-01 , 2
> -- 查询与"韦一笑"的入职日期及职位相同的员工信息
> select * from tb_emp where (entrydate,job) = ('2007-01-01',2);
> 
> -- 合并以上两条SQL语句
> select * from tb_emp where (entrydate,job) = (select entrydate , job from tb_emp where name = '韦一笑');
> ```



#### 表子查询

子查询返回的结果是多行多列，常作为临时表，这种子查询称为表子查询。



> e.g.
>
> 1. 查询入职日期是 "2006-01-01" 之后的员工信息
> 2. 基于查询到的员工信息，在查询对应的部门信息
>
> ```sql
> select * from emp where entrydate > '2006-01-01';
> 
> select e.*, d.* from (select * from emp where entrydate > '2006-01-01') e left join dept d on e.dept_id = d.id ;
> ```



##  表结尾语句



```sql
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `type` int DEFAULT NULL COMMENT '类型   1 菜品分类 2 套餐分类',
  `name` varchar(32) COLLATE utf8_bin NOT NULL COMMENT '分类名称',
  `sort` int NOT NULL DEFAULT '0' COMMENT '顺序',
  `status` int DEFAULT NULL COMMENT '分类状态 0:禁用，1:启用',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `create_user` bigint DEFAULT NULL COMMENT '创建人',
  `update_user` bigint DEFAULT NULL COMMENT '修改人',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_category_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin COMMENT='菜品及套餐分类';
```

### **ENGINE=InnoDB**

👉 指定表使用的**存储引擎**（storage engine）。

**简单理解：**
 数据库的“表”就像是“文件夹”，而存储引擎决定了**文件夹底层用什么机制来保存数据**。
 现代项目几乎都用 `InnoDB`。

###  **AUTO_INCREMENT=2**3

👉 表示这张表的「自增主键」下一个可用值是 `23`。

###  **DEFAULT CHARSET=utf8mb3**

👉 指定这张表的**默认字符集（Character Set）**。

字符集决定了数据库如何存储文字，比如中文、表情符号等。

| 常见字符集  | 支持范围                          | 说明                         |
| ----------- | --------------------------------- | ---------------------------- |
| **utf8mb3** | 旧版 UTF-8（每个字符最多 3 字节） | 不支持 emoji                 |
| **utf8mb4** | 真正的 UTF-8（最多 4 字节）       | ✅ 支持 emoji 和全Unicode字符 |
| **latin1**  | 只支持西欧字符                    | 🚫 不支持中文                 |

###  **COLLATE=utf8_bin**

👉 指定字符串的**排序规则（collation）**。

排序规则决定了字符串比较时的**大小写敏感**、**排序方式**。

| 排序规则               | 说明                                        |
| ---------------------- | ------------------------------------------- |
| **utf8_general_ci**    | 不区分大小写比较（`ci` = case insensitive） |
| **utf8_bin**           | 按二进制比较（区分大小写）                  |
| **utf8mb4_unicode_ci** | 按 Unicode 标准比较（不区分大小写）         |





# 事务

事务是一组操作的集合，它是一个不可分割的工作单位。事务会把所有的操作作为一个整体一起向系统提交或撤销操作请求，即这些操作要么同时成功，要么同时失败。

事务作用：保证在一个事务中多次操作数据库表中数据时，**要么全都成功,要么全都失败。**

MYSQL中有两种方式进行事务的操作：

1. 自动提交事务：即执行一条sql语句提交一次事务。（默认MySQL的事务是自动提交）
2. 手动提交事务：先开启，再提交 

事务操作有关的SQL语句：

| SQL语句                        | 描述             |
| ------------------------------ | ---------------- |
| start transaction;  /  begin ; | 开启手动控制事务 |
| commit;                        | 提交事务         |
| rollback;                      | 回滚事务         |

> 手动提交事务使用步骤：
>
> - 第1种情况：开启事务  =>  执行SQL语句   =>  成功  =>  提交事务
> - 第2种情况：开启事务  =>  执行SQL语句   =>  失败  =>  回滚事务



## 四大特性

**ACID:**

- 原子性（Atomicity）：事务是不可分割的最小单元，要么全部成功，要么全部失败。
- 一致性（Consistency）：事务完成时，必须使所有的数据都保持一致状态。
- 隔离性（Isolation）：数据库系统提供的隔离机制，保证事务在不受外部并发操作影响的独立环境下运行。*多个用户并发的访问数据库时，一个用户的事务不能被其他用户的事务干扰，多个并发的事务之间要相互隔离。*
- 持久性（Durability）：事务一旦提交或回滚，它对数据库中的数据的改变就是永久的。

## 隔离级别

## MVCC



# 索引

索引(index)：是帮助数据库高效获取数据的数据结构 。

优点：

1. 提高数据查询的效率，降低数据库的IO成本。
2. 通过索引列对数据进行排序，降低数据排序的成本，降低CPU消耗。

缺点：

1. 索引会占用存储空间。
2. 索引大大提高了查询效率，同时却也降低了insert、update、delete的效率。

## 语法

**创建索引**

~~~mysql
create  [ unique ]  index 索引名 on  表名 (字段名,... ) ;
~~~


> e.g.
> ~~~mysql
> create index idx_emp_name on tb_emp(name);
> ~~~
>
> 在创建表时，如果添加了主键和唯一约束，就会默认创建：主键索引、唯一约束
>
> PRIMARY KEY 是一种特殊的唯一索引（Unique Index）。
>
> | 索引类型                       | 存储结构   | 说明                                   |
> | ------------------------------ | ---------- | -------------------------------------- |
> | **聚簇索引 (Clustered Index)** | 主键索引   | 数据行实际存储在这个索引的叶子节点上   |
> | **辅助索引 (Secondary Index)** | 非主键索引 | 叶子节点保存的是“主键值”而不是数据本身 |
>

**查看索引**

~~~mysql
show  index  from  表名;
~~~

**删除索引**

~~~mysql
drop  index  索引名  on  表名;
~~~

## B+Tree

> 说明：如果数据结构是红黑树，那么查询1000万条数据，根据计算树的高度大概是23左右，这样确实比之前的方式快了很多，但是如果高并发访问，那么一个用户有可能需要23次磁盘IO，那么100万用户，那么会造成效率极其低下。所以为了减少红黑树的高度，那么就得增加树的宽度，就是不再像红黑树一样每个节点只能保存一个数据，可以引入另外一种数据结构，一个节点可以保存多个数据，这样宽度就会增加从而降低树的高度。这种数据结构例如BTree就满足。

![](/images/MySQL/image-2.png)

**B+Tree结构：**

- 每一个节点，可以存储多个key（有n个key，就有n个指针）
- 节点分为：叶子节点、非叶子节点
  - 叶子节点，就是最后一层子节点，所有的数据都存储在叶子节点上
  - 非叶子节点，不是树结构最下面的节点，用于索引数据，存储的的是：key+指针
- 为了提高范围查询效率，叶子节点形成了一个双向链表，便于数据的排序及区间范围查询

> 非叶子节点都是由key+指针域组成的，一个key占8字节，一个指针占6字节，而一个节点总共容量是16KB，那么可以计算出一个节点可以存储的元素个数：16*1024字节 / (8+6)=1170个元素。
>
> 当根节点中可以存储1170个元素，那么根据每个元素的地址值又会找到下面的子节点，每个子节点也会存储1170个元素，那么第二层即第二次IO的时候就会找到数据大概是：1170*1170=135W。也就是说B+Tree数据结构中只需要经历两次磁盘IO就可以找到135W条数据。

## Hash



## 聚集



## 非聚集



## 联合



# 锁







# 底层log











# temp

## 1. 基础连接与 NULL 处理

- **175. 组合两个表 (Combine Two Tables)**
  - **核心考点**：`LEFT JOIN` 的使用。
  - **重点**：理解为什么不能用 `INNER JOIN`，以及如何保留主表记录并处理缺失值。

## 2. 过滤与位运算

- **627. 变更性别 (Swap Salary)**
  - **核心考点**：`UPDATE` 语句、`CASE WHEN` 逻辑或 `IF` 函数。
  - **重点**：练习在不使用临时表的情况下，如何通过单条 SQL 语句进行条件更新。

## 3. 排名与窗口函数

- **178. 分数排名 (Rank Scores)**
  - **核心考点**：`DENSE_RANK()`、`RANK()`、`ROW_NUMBER()` 的区别。
  - **重点**：处理并列排名且要求排名连续的场景。

## 4. 聚合函数与分组过滤

- **182. 查找重复的电子邮箱 (Duplicate Emails)**
  - **核心考点**：`GROUP BY` 与 `HAVING`。
  - **重点**：区分 `WHERE`（聚合前过滤）与 `HAVING`（聚合后过滤）的执行顺序。

## 5. 复杂条件逻辑

- **626. 换座位 (Exchange Seats)**
  - **核心考点**：`CASE WHEN`、取模运算 `%`。
  - **重点**：如何处理相邻行的数据交换逻辑，以及对最后一行单数的处理。

## 6. 日期处理与自连接

- **197. 上升的温度 (Rising Temperature)**
  - **核心考点**：`DATEDIFF()` 函数、自连接 (Self-Join)。
  - **重点**：如何将同一张表的不同行进行对比。





| **锁类型** | **意向共享锁 (IS)** | **意向排他锁 (IX)** | **共享锁 (S - 表锁)** | **排他锁 (X - 表锁)** |
| ---------- | ------------------- | ------------------- | --------------------- | --------------------- |
| **IS**     | 兼容                | 兼容                | 兼容                  | 冲突                  |
| **IX**     | 兼容                | 兼容                | 冲突                  | 冲突                  |
| **S**      | 兼容                | 冲突                | 兼容                  | 冲突                  |
| **X**      | 冲突                | 冲突                | 冲突                  | 冲突                  |



| **隔离级别**              | **脏读** | **不可重复读** | **幻读** | **安全性** | **性能** |
| ------------------------- | -------- | -------------- | -------- | ---------- | -------- |
| **读未提交 (RU)**         | ❌ 有     | ❌ 有           | ❌ 有     | 最差       | 最高     |
| **读已提交 (RC)**         | ✅ 无     | ❌ 有           | ❌ 有     | 一般       | 较高     |
| **可重复读 (RR)**         | ✅ 无     | ✅ 无           | ⚠️ 较少   | 优秀       | 均衡     |
| **串行化 (Serializable)** | ✅ 无     | ✅ 无           | ✅ 无     | 最高       | 最低     |

- **读未提交**：通过行级共享锁确保更新时不冲突，但不阻止其他事务读取未提交数据。
- **读已提交**：写操作加行级排他锁。**每次读取数据前都生成一个新的 ReadView**，导致不可重复读。
- **可重复读**：**只在第一次读操作时生成 ReadView**，后续复用。对于当前读，通过**临键锁**锁住记录及间隙，防止插入，从而解决幻读。
- **串行化**：读加表级共享锁，写加表级排他锁，事务结束才释放。
