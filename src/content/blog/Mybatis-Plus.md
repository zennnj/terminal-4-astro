---
title: Mybatis-Plus
abbrlink: 5d2bcff8
date: 2025-12-11 17:49:50
tags: learn
---

[Mybatis · Terminal 4](https://zennnj.github.io/posts/da3e1361.html)



# 开始

1. 引入依赖

2. 使用 @MapperScan 注解扫描 mapper 文件。

   > 和在所有类上加@Mapper相比比较方便！

3. application.yml 文件中增加MyBatis-Plus 的统一配置。

	```yml
	# mybatis 相关统一配置
	mybatis-plus:
	  configuration:
	    #开启下划线转驼峰
	    map-underscore-to-camel-case: true
	```





# 基本使用

MyBatis-Plus 在 MyBatis 的基础上提供了**通用 CRUD** 能力。
 在实体类上使用注解（如 @TableName、@TableId），
 在 Mapper 接口上继承 BaseMapper，即可获得大量内置方法：

- selectById
- selectList
- insert
- updateById
- deleteById

在 Service 层通常注入 Mapper，通过这些方法快速完成常见 CRUD 操作。

## Service CRUD

ServiceImpl<TagMapper, TagDO>：

ServiceImpl 是 MyBatis-Plus 提供的一个抽象类，提供了通用的 CRUD 方法。泛型参数 <TagMapper, TagDO> 意味着 TagDao 类主要用于处理 TagDO 数据对象的数据库操作，并使用 TagMapper 接口定义的方法进行操作。



```java
/**
 * IService 实现类（ 泛型：M 是 mapper 对象，T 是实体 ）
 *
 * @author hubin
 * @since 2018-06-23
 */
@SuppressWarnings("unchecked")
public class ServiceImpl<M extends BaseMapper<T>, T> implements IService<T> {
}
```

> 放进去的mapper需要extends BaseMapper

------



#  条件查询方法

MP 提供两类条件构造器：

## QueryWrapper

传统 QueryWrapper 写字段名是**字符串**：

```java
QueryWrapper<User> qw = new QueryWrapper<>();
qw.eq("status", 1).like("username", "jack");
```

 **缺点：**

- 字段名写错不会报错（编译期无法校验）
- 字段名变更时不会更新

## LambdaQueryWrapper

```java
LambdaQueryWrapper<User> qw = new LambdaQueryWrapper<>();
qw.eq(User::getStatus, 1).like(User::getUsername, "jack");
```

> “::” 是 Java 8 引入的功能，叫做**方法引用**（method reference）。
>
> 比如：
> ```java
> User::getUsername
> ```
> 它的含义是：
> 把 User 对象里的 getUsername 方法引用传递给框架，而不是让你调用它。
> MP 根据 "User::getUsername" **自动推断数据库字段名**（user_name）。
>
> 所以你写：
>
> ```java
> lambdaWrapper.eq(User::getUsername, "jack");
> ```
>
> MP 会自动解析为：
>
> ```java
> where user_name = 'jack'
> ```
>
>  MP 会：
>
> 1. 根据 getter 方法名字 → 找到 Java 字段名
> 2. Java 字段名 → 根据驼峰规则转成下划线字段名（unless @TableField 定制）
> 3. 最终得到数据库字段名
>
> 所以 LambdaQueryWrapper 是：
>
> - 类型安全
> - 字段名自动推断
> - 字段重构安全
> - IDE 自动提示字段名



## 示例

```java
/**
 * 获取已上线 Tags 列表（分页）
 *
 * @return
 */
public List<TagDTO> listOnlineTag(String key, PageParam pageParam) {
    LambdaQueryWrapper<TagDO> query = Wrappers.lambdaQuery();
    query.eq(TagDO::getStatus, PushStatusEnum.ONLINE.getCode())
            .eq(TagDO::getDeleted, YesOrNoEnum.NO.getCode())
            .and(StringUtils.isNotBlank(key), v -> v.like(TagDO::getTagName, key))
            .orderByDesc(TagDO::getId);
    if (pageParam != null) {
        query.last(PageParam.getLimitSql(pageParam));
    }
    List<TagDO> list = baseMapper.selectList(query);
    return ArticleConverter.toDtoList(list);
}
```

子表达式 lambda：

```java
.and(StringUtils.isNotBlank(key), v -> v.like(TagDO::getTagName, key))：
```

 

a. **`StringUtils.isNotBlank(key)` 是条件开关**

如果 key 为空，不执行 .and() 内部任何内容
 如果 key 不为空，则加入：

```sql
AND (tag_name LIKE '%xxx%')
```

 

b. **v -> v.like(...) 是一个“子表达式 lambda”**

`.and(boolean condition, Consumer<Wrapper>)` 的逻辑：

- condition 为真 → 执行 lambda（构造 AND (...)）
- condition 为假 → 跳过，不加入 AND

`v -> v.like(TagDO::getTagName, key)` 表示：

- v 是一个临时包装器（一个新的 wrapper）
- 在这个 wrapper 里加条件：`like TagDO.tagName '%key%'`
- 整个表达式会被加上括号

------




#  自定义 SQL

如果通用方法无法满足需求，可以使用自定义 SQL。

## 方式 1：注解写 SQL

```java
@Select("select * from user where third_account_id = #{id}")
User getByThirdAccountId(@Param("id") String id);
```

## 方式 2：XML 文件写 SQL

在与 Mapper 名称相同的 XML 中编写复杂查询。

------



# 更新与逻辑删除

## 更新

- updateById
- update(entity, wrapper)
- 根据条件批量更新

## 逻辑删除

实体类加 @TableLogic，数据库保留 deleted 字段
 MP 会自动将删除操作转化为更新 deleted 字段，而不是物理删除。

------



# 主键策略

通过 @TableId 配置主键策略：

- AUTO：数据库自增
- INPUT：用户手动输入
- ASSIGN_ID：雪花算法（MP 自带）
- ASSIGN_UUID：UUID

在无需改动数据库字段的前提下，可以随时更换主键生成方式。

简单总结一下，这篇文章我们主要讲了技术派中整合 MyBatis-Plus 的基本使用：





