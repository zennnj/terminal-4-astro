---
title: Cache
tags: learn
categoties: 后端
abbrlink: '808644e3'
date: 2025-12-28 16:47:13
---

cache，cash





# Spring Cache

Springboot里写过一点：[Spring Boot · Terminal 4](https://zennnj.github.io/posts/a541262a.html#Spring-Cache)

```less
@Cacheable / @CachePut / @CacheEvict
            ↓
        CacheInterceptor   （AOP 拦截）
            ↓
        CacheManager       （缓存管理器）
            ↓
           Cache           （具体缓存）
            ↓
    Redis / Caffeine / Ehcache

```





cacheNames可以理解为缓存key的前缀，可以为组件缓存的key变量；

当key不设置时，使用方法参数来初始化，注意key为SpEL表达式，因此如果要写字符串时，用单引号括起来

一个简单的使用姿势

```java
/**
 * 首先从缓存中查，查到之后，直接返回缓存数据；否则执行方法，并将结果缓存
 * <p>
 * redisKey: cacheNames + key 组合而成 --> 支持SpEL
 * redisValue: 返回结果
 *
 * @param name
 * @return
 */
@Cacheable(cacheNames = "say", key = "'p_'+ #name")
public String sayHello(String name) {
    return "hello+" + name + "-->" + UUID.randomUUID().toString();
}
```



还有condition设置，这个表示当它设置的条件达成时，才写入缓存

```java
/**
 * 满足condition条件的才写入缓存
 *
 * @param age
 * @return
 */
@Cacheable(cacheNames = "condition", key = "#age", condition = "#age % 2 == 0")
public String setByCondition(int age) {
    return "condition:" + age + "-->" + UUID.randomUUID().toString();
}
```

unless参数，从名字上可以看出它表示不满足条件时才写入缓存



## @Caching

在实际的工作中，经常会遇到一个数据变动，更新多个缓存的场景，对于这个场景，可以通过@Caching来实现

```java
/**
 * caching实现组合，添加缓存，并失效其他的缓存
 *
 * @param age
 * @return
 */
@Caching(cacheable = @Cacheable(cacheNames = "caching", key = "#age"), evict = @CacheEvict(cacheNames = "t4", key = "#age"))
public String caching(int age) {
    return "caching: " + age + "-->" + UUID.randomUUID().toString();
}
```



## @CacheConfig

当一个Service内的所有缓存方法的cacheNames都是同一个时，或者cacheManager都相同时，可以考虑在类上添加注解

```java
@Service
@CacheConfig(cacheNames = "customCache", cacheManager = "customCacheManager")
public class AnoCacheService {
  // ...
}
```



# Gauva

Guava 是 Google 开源的一款 Java 工具库，提供了一些 JDK 没有或者增强 JDK 的个功能，Cache只是其中的一部分功能而已。



## Cache Builder

```java
// 创建一个 CacheBuilder 对象
CacheBuilder<Object, Object> cacheBuilder = CacheBuilder.newBuilder()
        .maximumSize(100)  // 最大缓存条目数
        .expireAfterAccess(30, TimeUnit.MINUTES) // 缓存项在指定时间内没有被访问就过期
        .recordStats();  // 开启统计功能

// 构建一个 LoadingCache 对象
LoadingCache<String, String> cache = cacheBuilder.build(new CacheLoader<String, String>() {
    @Override
    public String load(String key) throws Exception {
        return "技术派 value：" + key; // 当缓存中没有值时，加载对应的值并返回
    }
});

// 存入缓存
cache.put("itwanger", "沉默王二");

// 从缓存中获取值
// put 过
System.out.println(cache.get("itwanger"));
// 没 put 过
System.out.println(cache.get("paicoding"));

// 打印缓存的命中率等统计信息
System.out.println(cache.stats());
```

LoadingCache 是一种特殊的 Cache，在缓存中不存在某个 key 的值时，可以通过 CacheLoader 来加载该 key 对应的值，并将其加入到缓存中。

CacheLoader 是 Guava 缓存库中的一个接口，用于在缓存未命中时加载缓存值。它定义了一个方法 load(K key)，当缓存中没有 key 对应的值时，会调用该方法来获取该 key 对应的值并将其存入缓存中。



**常用方法：**

1. `newBuilder()`

   该方法返回一个 CacheBuilder 实例，用于创建一个新的缓存实例。

2. `maximumSize(long maximumSize)`

   该方法用于设置缓存的最大大小，以条目数为单位。如果缓存中的条目数超过了最大大小，则可能会触发缓存的回收策略，以释放一些缓存空间。

3. `expireAfterWrite(long duration, TimeUnit unit)`

   该方法用于设置缓存的过期时间。在缓存中存储的每个条目被创建或者更新后，经过指定的时间后，该条目将被自动删除。可以使用 TimeUnit 枚举类型中的常量来指定时间单位，比如 TimeUnit.SECONDS、TimeUnit.MINUTES 等。

4. `expireAfterAccess(long duration, TimeUnit unit)`

   该方法和 expireAfterWrite 方法类似，不同的是，该方法用于设置缓存中每个条目的最大闲置时间。如果一个条目在指定的时间内没有被访问，则该条目将被自动删除。

5. `stats()`

   该方法用于启用缓存统计功能，可以用于监控缓存的使用情况。

6. `build()`

   该方法用于创建和返回一个新的缓存实例。在调用该方法之前，需要进行一些其他的配置，比如设置缓存的最大大小、过期时间等。







这几个问题非常有深度，直指 Spring Cache 在生产环境中的细节坑点。我们一个一个来拆解。

------

## 1. @CacheEvict 异常时，缓存会被失效吗？

**结论：默认情况下，先执行方法，后删缓存。如果方法抛出异常，缓存不会被失效。**

- **执行顺序**：Spring 默认在方法**成功返回后**才触发清理逻辑。如果方法内部报错，清理逻辑就不会执行。

- **如何改变？**：如果你想在方法执行前就删掉缓存（无论成功失败），需要设置 `beforeInvocation = true`。

  > **应用场景**：比如你非常看重数据的实时性，宁可错杀（删了缓存让后面的人去查库）也不愿让用户看到旧数据，就用 `beforeInvocation = true`。

------

## 2. 一个方法放多个缓存注解可行吗？（多级缓存方案）

**结论：直接放两个 `@Cacheable` 是不行的，Java 语法不支持重复注解。但可以使用 `@Caching` 包装。**

- **可行性**：使用 `@Caching(cacheable = { @Cacheable(name="L1"), @Cacheable(name="L2") })`。
- **读取顺序**：Spring 会按照注解定义的顺序依次查找。
  - 先找 L1（Caffeine），找到了直接返回。
  - L1 没找到，找 L2（Redis），找到了就把结果存入 L1 并返回。
  - 都没找到，执行方法，然后把结果同时存入 L1 和 L2。

------

## 3. sync 属性是支持“异步写入”吗？

**结论：不是。`sync = true` 是为了解决“缓存击穿”问题的同步锁，它是同步的，不是异步的。**

- **它的作用**：当缓存失效的一瞬间，有 1000 个请求进来。
  - `sync = false`（默认）：1000 个请求发现没缓存，全都冲向数据库。
  - `sync = true`：这 1000 个请求会排队，只放 1 个去查库，剩下的等它查完直接拿结果。
- **验证方法**：
  1. 在方法内部写个 `Thread.sleep(2000)` 模拟慢查询。
  2. 用 JMeter 同时发 10 个并发请求。
  3. 看日志，如果方法只被调用了 1 次，说明 `sync` 生效了；如果调用了 10 次，说明没生效。

------

## 4. 不同类型缓存，过期时间不一致怎么处理？

**结论：不能共用一个配置。有两种主流处理方案：**

- **方案 A：声明多个 CacheManager**。

  在 `ForumCoreAutoConfig` 里定义 `manager5Min` 和 `manager1Hour`，然后在注解里手动指定 `cacheManager = "manager5Min"`。

- **方案 B：自定义缓存解析器**。

  在 `cacheNames` 里带上过期时间（如 `cacheNames = "article#3600"`），然后重写 `CacheManager`，让它解析这个 `#` 后面的数字来动态设置过期时间。

------

## 5. 如何直接使用 Caffeine 体现它的魅力？

**直接使用 Caffeine 的魅力在于“精细化控制”和“高性能响应”。**

相比于 Spring 注解的“全自动”，手动调用（如你看到的 `ProxyCenter` 里的做法）可以实现以下高级功能：

- **权重置换**：不是根据条数限制，而是根据对象占用的内存大小来踢出缓存。
- **监控统计**：调用 `.stats()` 可以看到缓存命中率、加载耗时、被踢出的次数。
- **软引用/弱引用**：当 JVM 内存不足时，自动回收缓存对象，防止 OOM。

**代码示例：**

Java

```
Cache<String, Object> manualCache = Caffeine.newBuilder()
    .expireAfterWrite(10, TimeUnit.MINUTES)
    .maximumSize(10_000)
    .recordStats() // 开启监控
    .build();

// 手动存取
Object value = manualCache.get(key, k -> "从数据库查出来的值");
System.out.println(manualCache.stats()); // 查看命中率
```

------

## 总结

Spring Cache 是为了**开发效率**，它牺牲了一些灵活性（如不同过期时间的配置比较麻烦）。而直接使用 Caffeine 是为了**运行效率和掌控力**。

**既然聊到了缓存失效和异常，你想看看如何通过 `@CacheEvict` 配合特定的参数（比如只根据文章 ID 删缓存，不看作者）来实现精准的缓存清理吗？**
