---
title: ElasticSearch
abbrlink: d48132d3
date: 2026-04-13 16:02:23
tags:
---

# ElasticSearch面试题

## 一、ES基础概念与原理
### 基础概念

- 什么是Elasticsearch?请介绍一下Elasticsearch

  ​	Elasticsearch 是一个**分布式、RESTful 风格的搜索和数据分析引擎**。它基于 Apache Lucene 构建，能够近乎实时地存储、检索和分析海量数据。

  **特点**：分布式架构、高可用、多租户、全文检索、强大的聚合分析能力。

- Elasticsearch的基本概念有哪些？

  ​	集群 (Cluster)、节点 (Node)、索引 (Index)、类型 (Type, 7.x后废弃)、文档 (Document)、分片 (Shard) 和副本 (Replica)。

- Elasticsearch中的集群、节点、索引、文档、类型是什么？

  - **集群 (Cluster)**：由一个或多个节点组成，共同保存整个数据并提供索引和搜索能力。
  - **节点 (Node)**：集群中的一台服务器。
  - **索引 (Index)**：逻辑容器，类似于关系型数据库中的 **Database**。
  - **文档 (Document)**：ES 中最小的数据单元，JSON 格式，类似于数据库中的 **Row**。
  - **类型 (Type)**：索引内部的逻辑分类。在 6.x 版本只允许一个，7.x 彻底废弃，8.x 已完全移除。

- 说一下text和keyword类型的区别

  - **text**：用于全文检索。数据在写入时会被**分词器 (Analyzer)** 处理，拆分成单个词项（Term），不支持聚合和排序
  - **keyword**：用于精确匹配。数据不会被分词，而是作为整体存储，支持聚合、排序和过滤。

- DocValues的作用是什么？

  - 由于倒排索引适合搜索，但不适合排序和聚合（因为需要反向扫描），**DocValues** 采用**列式存储**结构，将文档 ID 到值的映射持久化到磁盘，专门用于提高聚合、排序和脚本执行的效率。

- 什么是停顿词过滤？

  - 在分词阶段，剔除掉那些频率极高但对搜索意义不大的词（如：“的”、“了”、“a”、“the”），以减小索引体积并提高检索效率。

- query和filter的区别是什么？

  - **query**：不仅判断文档是否匹配，还会计算 **相关性得分 (_score)**，且结果**不缓存**。
  - **filter**：只回答“是/否”，不计算得分，且结果会**被缓存**，执行速度更快。

- Elasticsearch有哪些数据类型？你在项目中用了哪些?

  - **基本类型**：Long, Integer, Double, Boolean, Date。

    **字符串**：text, keyword。

    **复杂类型**：Object, Nested（处理嵌套对象）。

    **特殊类型**：Geo_point (地理位置), IP, Completion (自动补全)。

    **项目中**：常用 `keyword` 存储状态码，`text` 存储商品描述，`date` 存储日志时间，`nested` 处理订单关联项。

- Elasticsearch支持事务吗？

  - **不支持。** ES 不提供像关系型数据库那样的 ACID 事务。虽然它有版本控制（Optimistic Concurrency Control）和 Translog 保证数据不丢失，但无法做到跨文档的原子性提交和回滚。
### 核心原理
- 什么是倒排索引？

  - 倒排索引（Inverted Index）是搜索引擎的核心。它不是记录文档包含哪些词，而是记录**每个词出现在哪些文档中**，以及出现的位置和频率。
- 你了解倒排索引的实现原理吗？

  - **分词**：将文档内容拆分为 Term。

    **字典 (Term Dictionary)**：存储所有不重复的 Term，通常在内存中通过 **FST (Finite State Transducer)** 压缩存储。

    **倒排列表 (Posting List)**：存储包含该 Term 的文档 ID 列表及偏移量。 **查找过程**：通过 FST 在 Term Dictionary 中快速定位词项，获取其对应的 Posting List，最后根据文档 ID 取回数据。
- 在Elasticsearch中，是怎么根据一个词找到对应的倒排索引的？

  - 同上？
- 如何在保留不变性的前提下实现倒排索引的更新？

  - Lucene 的 Segment（段）是不可变的。
    - **增加**：写入新的 Segment。
    - **删除**：在 `.del` 文件中标记该文档已删除，检索时过滤，物理删除发生在 Segment Merge 时。
    - **修改**：先标记旧文档删除，再写入一个新版本的文档到新 Segment。
- lucence内部结构是什么？

  - 一个 Lucene 索引由多个 **Segment** 组成。每个 Segment 都是一个完整的倒排索引。当搜索发生时，Lucene 会查询所有 Segment 并合并结果。
- 是否了解字典树？

  - Trie 树是一种用于快速检索的多叉树结构。ES 的 FST 实际上是一种更高级的、内存高效的变体，它不仅能复用前缀，还能复用后缀。
- 讲一下elasticsearch和mysql的区别

  - | **特性**     | **MySQL**          | **Elasticsearch**      |
    | ------------ | ------------------ | ---------------------- |
    | **存储模型** | 关系型 (Row-based) | 文档型 (JSON/Columnar) |
    | **事务支持** | 强事务 (ACID)      | 弱事务 (无跨文档事务)  |
    | **查询性能** | 复杂关联查询快     | 全文搜索、聚合分析极快 |
    | **扩展性**   | 纵向为主 (主备)    | 横向分布式扩展极易     |
- Elasticsearch为什么适合搜索？

  - **倒排索引**：跳过了全表扫描，直接定位文档。

    **FST 内存压缩**：将词典常驻内存，减少磁盘 IO。

    **分片分布式计算**：将查询分发到多台机器并行处理。

    **OS Cache**：极度依赖文件系统缓存，大部分操作在内存层面完成。
- elasticsearch的原理和结构是怎样的？

  - 
- ES为什么这么快？
### 存储机制
- String类型在ES中是怎么存储的？

  - 如果是 `text`：经过 Analyzer（分词器）处理后，以倒排索引形式存储。

    如果是 `keyword`：不分词，直接以倒排索引存储，同时默认开启 `DocValues` 用于排序聚合。
- Elasticsearch**行式存储 (Stored Fields)** 与 **列式存储 (DocValues)**的区别是什么？行式存储的优势有哪些？

  - **行式存储**（如 `_source`）：整行读取，适合获取完整文档。
  - **列式存储**（如 `DocValues`）：按列读取。
  - **优势**：列式存储在聚合运算时只需读取目标字段，大大减少 IO，且相同类型数据在一起更易压缩。
- 你了解Elasticsearch的Segment吗？

  - Segment 是 Lucene 的底层存储单元。
    - 它是不可变的。
    - 过多的 Segment 会消耗文件句柄和内存。
    - ES 会在后台自动进行 **Merge**，将小 Segment 合并成大的。
- 说一下Elasticsearch的Refresh机制

  - ES 为了实现**近实时 (NRT)** 搜索，每隔 1 秒（默认）将 Buffer 中的数据写入文件系统缓存（Filesystem Cache），并生成一个新的 Segment。

    此时数据还没落盘，但已经可以被搜索到了。
- 你知道Elasticsearch的Flush操作吗？

  - Flush 是为了确保持久化：
    1. 将 Buffer 写入新的 Segment 并清空。
    2. 执行 `fsync` 将缓存中的 Segment 真正写入磁盘。
    3. 清空 **Translog**（预写日志）。
- 什么是Merge操作？

  - 随着 Refresh 持续产生小 Segment，ES 会后台启动线程将它们合并成更大的 Segment，并在此过程中**真正物理删除**被标记为已删除的文档。这能提高搜索效率并节省空间。
## 二、ES架构与集群管理
### 集群架构
- Elasticsearch的架构是怎样的？
- 说说你们公司es的集群架构，索引数据大小，分片有多少？
- 分片机制是如何实现分布式集群的？
- 分片和副本有什么区别？
- 你了解分段机制吗？
- ES是怎么样去运行的？跑了几个节点？
### Master选举与脑裂
- Elasticsearch的分布式原理是什么？
- Elasticsearch是如何实现Master选举的？
- Elasticsearch重要的节点（比如公共20个），其中的10个选了一个master，另外10个选了另一个master，怎么办？
- Elasticsearch是如何避免脑裂现象的？
- Elasticsearch集群脑裂问题如何解决？节点协调与负载
- 节点和分片是如何协调的？
- 客户端在和集群连接时，如何选择特定的节点执行请求的？
- 你遇到过数据倾斜问题吗？如何处理？
- 什么是长尾问题？
## 三、数据写入与更新
### 写入流程式指南
- 详细描述一下 Elasticsearch 索引文档的过程
- es写数据的过程是怎样的？
- 写数据的底层原理是什么？
- 文档索引步骤顺序是什么？
- 新增的文档怎么快速和旧文档一起被检索？
### 更新删除
- 详细描述一下Elasticsearch更新和删除文档的过程
- ES更新一个文档，它的操作步骤是什么样子的？高并发写入
- 写压力大时怎么处理？
- 海量数据如何写入es？
- 在并发情况下，Elasticsearch如何保证读写一致？
## 四、搜索与查询
- ES在高并发下如何保证读写一致性？
### 搜索流程
- 详细描述一下Elasticsearch搜索的过程
- Query阶段是如何工作的？
- Fetch阶段是如何工作的？
### 分词与查询
- 分词器的分词流程是怎样的？
- ES你是用过什么样的接口去搜索的？比如搜索一个关键字，你是怎么去搜索的?
- title的类型是什么类型（设置ES索引的时候）？
### 深度分页
- ES的深度分页与滚动搜索scroll是什么？
## 五、性能优化与调优
### 索引优化
- 建立索引阶段性能提升方法有哪些？
- 索引阶段性能提升方法有哪些?
- elasticsearch索引数据多了怎么办，如何调优？
- 说一下你了解的调优手段
### 聚合优化
- Elasticsearch对于大数据量（上亿量级）的聚合如何实现？
### 系统调优
- Elasticsearch在部署时，对Linux的设置有哪些优化方法？
- 对于GC方面，在使用Elasticsearch时要注意什么?
## 六、部署与运维
### 部署相关
- elasticsearch如何部署？
- ES应用你是怎么部署的？
- 如何监控Elasticsearch集群状态？
## 七、数据同步与一致性
### 数据同步
- 数据库修改信息如何同步ElasticSearch?
- 项目中你的数据是怎么灌入ES的？
- 怎样进行数据同步？
- 如何考虑es和MySQL-致性？
- 如果用消息队列异步写入的话，消息丢失怎么办？
## 八、应用场景与实战
### 使用场景
- ElasticSearch的主要功能及应用场景是什么？
- 实习中的ElasticSearch为什么要用？为啥不直接查Mysql?
### 特殊场景
- 针对文字，ES可以用倒排索引，你知道ES针对地图如何构建索引吗？