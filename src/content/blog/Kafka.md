---
category: 系统技术
title: Kafka & RabbitMQ
abbrlink: 9a7d5a13
date: 2025-10-16 12:48:44
tags: learn
categories: 系统技术
---

[如何在Linux下设置缩写命令命令-CSDN博客](https://blog.csdn.net/wt141643/article/details/107136038)



# Kafka

## 原理

生产者消费者模式



生产者Producer ----消息队列MQ(Kafka)---- 消费者Consumer

每个事件在kafka中有一个唯一的序号offset

消费者可以通过offset来跟踪已消费事件，确保不会重复消费或漏消费，而且这些事件会被持久化到kafka中，即使某个服务暂不可用也不会丢失数据

> 相当于你玩戴森球，上一个产线产出之后放到a物流塔里，其他b物流塔选择本地需求然后从a中获取，不够就等着什么时候够了给你运过来
>
> 假设有个产物要2个原料，第一个原料早就准备好了，那就等第二个原料的产线产出，能被“订阅”之后再开始处理新的配方产出



### 主题Topic

可以将消息按照主题来进行分类和组织（多级反馈队列？mqtt？

每个主题还可以被进一步划分成多个partition分区

每个分区可以被不同的消费者线程并行处理

kafka只会保证每个分区内的消息是有序地，但是不同分区之间的消息顺序是不保证的

所以设置主题和分区时需要根据业务需求合理划分

常用的作法是把用户id作为分区的key，kafka会根据key的哈希来决定消息应该放到哪个分区，相同的key也就会被分到一个分区中

### Broker

kafka集群通常由多个broker组成，每个broker都是一个独立的服务器，负责存储和转发消息。

每个broker可以存储多个主题的多个分区，并且每个分区可以有多个副本

副本是分区的备份，每个分区有一个Leader和多个Follower，Leader负责处理实际的对外读写请求，而Follower负责复制Leader的数据，保证即使某个Leader宕机也不会丢失数据

### 消费者组Consumer Group

多个消费者共享一个或多个主题的消息

每条消息只能被同一个消费者组中的一个消费者消费，但是可以被多个消费者组消费



## 安装配置

官方文档：

#### [Step 1: Get Kafka](https://kafka.apache.org/documentation/#quickstart_download)

[Download](https://www.apache.org/dyn/closer.cgi?path=/kafka/4.1.0/kafka_2.13-4.1.0.tgz) the latest Kafka release and extract it:

```bash
$ tar -xzf kafka_2.13-4.1.0.tgz
$ cd kafka_2.13-4.1.0
```

#### [Step 2: Start the Kafka environment](https://kafka.apache.org/documentation/#quickstart_startserver)

NOTE: Your local environment must have Java 17+ installed.

Kafka can be run using local scripts and downloaded files or the docker image.

##### Using downloaded files

Generate a Cluster UUID

```bash
$ KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"
```

Format Log Directories

```bash
$ bin/kafka-storage.sh format --standalone -t $KAFKA_CLUSTER_ID -c config/server.properties
```

Start the Kafka Server

```bash
$ bin/kafka-server-start.sh config/server.properties
```

Once the Kafka server has successfully launched, you will have a basic Kafka environment running and ready to use.



## 创建和管理主题

### 查看主题

```bash
bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
```

`--bootstrap-server` 连接到kafka服务的地址，`localhost:9092` 选择本地服务

`--list` 列出所有的主题 `--describe` 查看详细信息

### 创建主题

```bash
bin/kafka-topics.sh\
--bootstrap-server localhost:9092\
--create --topic my-topic
```

*加`\`可以多行输入

### 修改主题

```bash
bin/kafka-configs.sh --bootstrap-server localhost:9092 --entity-type topics --entity-name my-topic --alter --add-config retention.ms=10000
```



### 删除主题

```bash
bin/kafka-topics.sh\
--bootstrap-server localhost:9092\
--delete --topic my-topic
```



## 发送和接受消息

### 发送消息

```bash
bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic my-topic
>你是谁
>请支持奶龙
>^C

```

crrl+c 退出消息发送



### 接收消息

```bash
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --from-beginning --topic my-topic

```



## 程序中使用Kafka



# Kafka 面试题

Kafka最初是由Linkedin公司开发的，是一个分布式的、可扩展的、容错的、支持分区的（Partition）、多副本的（replica）、基于Zookeeper框架的发布-订阅消息系统，Kafka适合离线和在线消息消费。它是分布式应用系统中的重要组件之一，也被广泛应用于大数据处理。Kafka是用Scala语言开发，它的Java版本称为Jafka。Linkedin于2010年将该系统贡献给了Apache基金会并成为顶级开源项目之一。

## Kafka消息的消费模式
Kafka将消息以topic为单位进行归纳，发布消息的程序称为Producer，消费消息的程序称为Consumer。它是以集群的方式运行，可以由一个或多个服务组成，每个服务叫做一个Broker,Producer通过网络将消息发送到kafka集群，集群向消费者提供消息，broker在中间起到一个代理保存消息的中转站。

Kafka 中重要的组件

1. Producer：消息生产者，发布消息到Kafka集群的终端或服务
2. Broker:一个Kafka 节点就是一个 Broker，多个Broker可组成一个Kafka集群。
   如果某个Topic 下有n个Partition且集群有n个Broker，那么每个Broker会存储该Topic下的一个Partition如果某个Topic下有n个Partition 且集群中有m+n个Broker，那么只有n个Broker会存储该Topic下的一个 Partition如果某个Topic下有n个Partition且集群中的Broker
   数量小于n，那么一个Broker 会存储该Topic下的一个或多个Partition，这种情况尽量避免，会导致集群数据不均衡
3. Topic：消息主题，每条发布到Kafka集群的消息都会归集于此，Kafka是面向Topic的
4. Partition:Partition是Topic在物理上的分区，一个Topic可以分为多个Partition，每个Partition是一个有序的不可变的记录序列。单一主题中的分区有序，但无法保证主题中所有分区的消息有序。
5. Consumer:从Kafka集群中消费消息的终端或服务
6. Consumer Group:每个Consumer都属于一个Consumer Group，每条消息只能被Consumer Group中的一个Consumer消费，但可以被多个ConsumerGroup消费。
7. Replica:Partition的副本，用来保障Partition的高可用性。
8. Controller:Kafka集群中的其中一个服务器，用来进行Leader election以及各种Failover 操作。
9. Zookeeper: Kafka通过Zookeeper来存储集群中的meta消息

## Kafka性能高原因
1.利用了PageCache缓存
2.磁盘顺序写
3.零拷贝技术
4.pull拉模式


## Kafka文件高效存储设计原理

1.Kafka把Topic中一个Partition大文件分成多个小文件段，通过多个小文件段，就容易定期清除或删除已经消费完成的文件，减少磁盘占用
2.通过索引信息可以快速定位Message和确定response的最大大小
3.通过将索引元数据全部映射到memory，可以避免Segment文件的磁盘1/0操作
4.通过索引文件稀疏存储，可以大幅降低索引文件元数据占用空间大小


## Kafka的优缺点

**优点**
	高性能、高吞吐量、低延迟：Kafka生产和消费消	
**缺点**
	息的速度都达到每秒10万级
**高可用：**所有消息持久化存储到磁盘，并支持数据备份防止数据丢失
**高并发：**支持数千个客户端同时读写
**容错性：**允许集群中节点失败（若副本数量为n,则允许n-1个节点失败)
**高扩展性：**Kafka集群支持热伸缩，无须停机没有完整的监控工具集不支持通配符主题选择

## Kafka的应用场景
1. 日志聚合：可收集各种服务的日志写入kafka的消
   息队列进行存储
2. 消息系统：广泛用于消息中间件
3. 系统解耦：在重要操作完成后，发送消息，由别的服务系统来完成其他操作
4. 流量削峰：一般用于秒杀或抢购活动中，来缓冲网站短时间内高流量带来的压力
5. 异步处理：通过异步处理机制，可以把一个消息放入队列中，但不立即处理它，在需要的时候再进行处理

## Kafka中分区的概念
主题是一个逻辑上的概念，还可以细分为多个分区，一个分区只属于单个主题，很多时候也会把分区称为主题分区（Topic-Partition）。同一主题下的不同分区包含的消息是不同的，分区在存储层面可以看做一个可追加的日志文件，消息在被追加到分区日志文件的时候都会分配一个特定的偏移量（offset）。offset 是消息在分区中的唯一标识，kafka通过它来保证消息在分区内的顺序性，不过offset并不跨越分区，也就是说，kafka保证的是分区有序而不是主题有序。

在分区中又引入了多副本（replica）的概念，通过增加副本数量可以提高容灾能力。同一分区的不同副本中保存的是相同的消息。副本之间是一主多从的关系，其中主副本负责读写，从副本只负责消息同步。副本处于不同的broker 中，当主副本出现异常，便会在从副本中提升一个为主副本。

## Kafka中分区的原则
1. 指明Partition的情况下，直接将指明的值作为Partition值
2. 没有指明Partition值但有key的情况下，将 key的Hash 值与topic的Partition值进行取余得到Partition值
3. 既没有Partition值又没有key值的情况下，第一次调用时随机生成一个整数（后面每次调用在这个整数上自增），将这个值与Topic可用的Partition总数取余得到Parittion值，也就是常说的round-robin算法

## Kafka为什么要把消息分区
1. 方便在集群中扩展，每个Partition可用通过调整以适应它所在的机器，而一个Topic又可以有多个Partition组成，因此整个集群就可以适应任意大小的数据了
2. 可以提高并发，因为可以以Partition为单位进行读写

## Kafka中生产者运行流程

1. 一条消息发过来首先会被封装成一个ProducerRecord对象
2. 对该对象进行序列化处理（可以使用默认，也可以自定义序列化）
3. 对消息进行分区处理，分区的时候需要获取集群的元数据，决定这个消息会被发送到哪个主题的哪个分区
4. 分好区的消息不会直接发送到服务端，而是放入生产者的缓存区，多条消息会被封装成一个批次（Batch），默认一个批次的大小是 16KB
5. Sender 线程启动以后会从缓存里面去获取可以发送的批次

Sender 线程把一个消息封装ProducerRecordl序列化的组件Partition生产者一个批次发送到服务端RecordlAccumulator（缓存Sender线程获取集群元数据BatchBatch发送



## Kafka中的消息封装Broker

在Kafka中Producer可以Batch的方式推送数据达到提高效率的作用。Kafka Producer可以将消息在内存中累积到一定数量后作为一个Batch发送请求。
Batch的数量大小可以通过Producer的参数进行控制，可以从三个维度进行控制累计的消息的数量（如500条）累计的时间间隔（如100ms)累计的数据大小（如64KB)通过增加Batch的大小，可以减少网络请求和磁盘1/0的频次，具体参数配置需要在效率和时效性做一个权衡。

## Kafka消息的消费模式

Kafka采用大部分消息系统遵循的传统模式:Producer将消息推送到Broker,Consumer从Broker获取消息。如果采用Push模式，则Consumer难以处理不同速率的上游推送消息。采用Pull 模式的好处是Consumer可以自主决定是否批量的从Broker拉取数据。Pult模式有个缺点是，如果Broker没有可供消费的消息，将导致Consumer不断在循环中轮询，直到新消息到达。为了避免这点，Kafka有个参数可以让Consumer阻塞直到新消息到达。

## Kafka如何实现负载均衡与故障转移

负载均衡是指让系统的负载根据一定的规则均衡地分配在所有参与工作的服务器上，从而最大限度保证系统整体运行效率与稳定性
**负载均衡**
Kakfa的负载均衡就是每个Broker 都有均等的机会为Kafka的客户端（生产者与消费者）提供服务，可以负载分散到所有集群中的机器上。Kafka通过智能化的分区领导者选举来实现负载均衡，提供智能化的Leader选举算法，可在集群的所有机器上均匀分散各个Partition的Leader，从而整体上实现负载均衡。
**故障转移**
Kafka的故障转移是通过使用会话机制实现的，每台Kafka服务器启动后会以会话的形式把自己注册到Zookeeper 服务器上。一旦服务器运转出现问题，就会导致与Zookeeper的会话不能维持从而超时断连，此时Kafka集群会选举出另一台服务器来完全替代这台服务器继续提供服务。

## Kafka中Zookeeper的作用

Kafka 是一个使用Zookeeper 构建的分布式系统。Kafka的各Broker 在启动时都要在Zookeeper上注册，由Zookeeper统一协调管理。如果任何节点失败，可通过Zookeeper从先前提交的偏移量中恢复，因为它会做周期性提交偏移量工作。同一个Topic的消息会被分成多个分区并将其分布在多个Broker上，这些分区信息及与Broker的对应关系也是Zookeeper在维护。

## Kafka提供了哪些系统工具

**Kafka迁移工具**：它有助于将代理从一个版本迁移到另一个版本
**Mirror Maker**:Mirror Maker 工具有助于将一个Kafka 集群的镜像提供给另一个
**消费者检查**：对于指定的主题集和消费者组，可显示主题、分区、所有者

## Kafka中消费者与消费者组的关系与负载均衡实现


Consumer Group 是Kafka独有的可扩展且具有容错性的消费者机制。一个组内可以有多个Consumer，它们共享一个全局唯一的GroupID。组内的所有Consumer协调在一起来消费订阅主题（Topic）内的所有分区（Partition）。当然，每个Partition只能由同一个Consumer Group内的一个Consumer 来消费。消费组内的消费者可以使用多线程的方式实现，消费者的数量通常不超过分区的数量，且二者最好保持整数倍的关系，这样不会造成有空闲的消费者。
Consumer 订阅的是Topic的Partition，而不是Message。所以在同一时间点上，订阅到同一个分区的Consumer必然属于不同的Consumer GroupConsumer Group与Consumer的关系是动态维护的，当一个Consumer进程挂掉或者是卡住时，该Consumer所订阅的Partition会被重新分配到改组内的其他Consumer上，当一个Consumer加入到一个Consumer Group中时，同样会从其他的Consumer中分配出一个或者多个Partition到这个新加入的Consumer。

当启动一个Consumer时，会指定它要加入的Group,使用的配置项是：Group.id
为了维持Consumer与Consumer Group之间的关系，Consumer 会周期性地发送hearbeat到coodinator（协调者），如果有hearbeat超时或未收到hearbeat,coordinator 会认为该Consumer已经退出，那么它所订阅的Partition会分配到同一组内的其他Consumer上，这个过程称为rebalance（再平衡）

## Kafka中消息偏移的作用

生产过程中给分区中的消息提供一个顺序ID号，称之为偏移量，偏移量的主要作用为了唯一地区别分区中的每条消息。Kafka的存储文件都是按照offset.kafka来命名

## 生产过程中何时会发生QueueFullExpection以及如何处理何时发生


当生产者试图发送消息的速度快于Broker可以处理的速度时，通常会发生 QueueFullException
如何解决
首先先进行判断生产者是否能够降低生产速率，如果生产者不能阻止这种情况，为了处理增加的负载，用户需要添加足够的Broker。或者选择生产阻塞，设置Queue.enQueueTimeout.ms为-1，通过这样处理，如果队列已满的情况，生产者将组织而不是删除消息。或者容忍这种异常，进行消息丢弃。

## Consumer如何消费指定分区消息


Cosumer 消费消息时，想Broker 发出fetch去消费特定分区的消息，Consumer可以通过指定消息在日志中的偏移量offset，就可以从这个位置开始消息消息，Consumer 拥有了offset的控制权，也可以向后回滚去重新消费之前的消息。也可以使用定消费的位置。
三者的概念
seek(Long topicPartition)请求来指

## Replica、Leader 和Follower

Kafka中的Partition是有序消息日志，为了实现高可用性，需要采用备份机制，将相同的数据复制到多个Broker上，而这些备份日志就是Replica，目的是为了防止数据丢失。所有Partition的副本默认情况下都会均匀地分布到所有Broker 上，一旦领导者副本所在的Broker宕机，Kafka会从追随者副本中选举出新的领导者继续提供服务。
Leader：副本中的领导者。负责对外提供服务，与客户端进行交互。生产者总是向Leader副本些消息，消费者总是从Leader 读消息
Follower：副本中的追随者。被动地追随Leader，不能与外界进行交付。只是向Leader发送消息，请求Leader把最新生产的消息发给它，进而保持同步。

## Replica的重要性

Replica可以确保发布的消息不会丢失，保证了Kafka的高可用性。并且可以在发生任何机器错误、程序错误或软件升级、扩容时都能生产使用。

## Kafka 中的 Geo-Replication是什么


Kafka官方提供了MirrorMaker组件，作为跨集群的流数据同步方案。借助MirrorMaker，消息可以跨多个数据中心或云区域进行复制。您可以在主动/被动场景中将其用于备份和恢复，或者在主动/主动方案中将数据将其用于备份和恢复，或者在主动/主动:放置得更靠近用户，或支持数据本地化要求。它的实现原理比较简单，就是通过从源集群消费消息，然后将消息生产到目标集群，即普通的消息生产和消费。用户只要通过简单的Consumer配置和Producer配置，然后启动Mirror，就可以实现集群之间的准实时的数据同步.

## Kafka中AR、ISR、OSR三者的概念

AR：分区中所有副本称为AR
ISR：所有与主副本保持一定程度同步的副本（包括主副本）称为ISR
OSR：与主副本滞后过多的副本组成 OSR

## 分区副本什么情况下会从ISR中剔出


Leader 会维护一个与自己基本保持同步的Replica列表，该列表称为ISR，每个Partition都会有一个ISR，而且是由Leader动态维护。所谓动态维护，就是说如果一个Follower比一个Leader落后太多，或者超过一定时间未发起数据复制请求，则Leader将其从ISR中移除。当ISR中所有Replica都向Leader发送ACKReplica都向Lead(Acknowledgement确认）时，Leader才commit。

## 分区副本中的Leader 如果宕机

但ISR却为空该如何处理可以通过配置unclean.leader.electiontrue:允许OSR成为Leader，但是OSR的消息较为滞后，可能会出现消息不一致的问题

false：会一直等待旧leader恢复正常，降低了可用性

## 如何判断一个Broker 是否还有效

1.Broker必须可以维护和ZooKeeper的连接，Zookeeper通过心跳机制检查每个结点的连接。
2.如果Broker是个Follower，它必须能及时同步Leader的写操作，延时不能太久。

## Kafka可接收的消息最大默认多少字节，如何修改

Kafka可以接收的最大消息默认为1000000字节，如果想调整它的大小，可在Broker中修改配置参数：Message.max.bytes的值
但要注意的是，修改这个值，还要同时注意其他对应的参数值是正确的，否则就可能引发一些系统异常。

首先这个值要比消费端的fetch.Message.max.bytes（默认值1MB，表示消费者能读取的最大消息的字节数）参数值要小才是正确的设置，否则Broker就会因为消费端无法使用这个消息而挂起。

## Kafka的ACK机制

Kafka的Producer有三种ack机制，参数值有0、1和-1
0：相当于异步操作，Producer不需要Leader给予回复，发送完就认为成功，继续发送下一条（批）Message。此机制具有最低延迟，但是持久性可靠性也最差，当服务器发生故障时，很可能发生数据丢失。
1：Kafka 默认的设置。表示Producer 要Leader确认已成功接收数据才发送下一条（批）Message。不过Leader宕机，Follower尚未复制的情况下，数据就会丢失。此机制提供了较好的持久性和较低的延迟性。
-1：Leader接收到消息之后，还必须要求ISR列表里跟Leader保持同步的那些Follower都确认消息已同步，Producer才发送下一条（批）Message。此机制持久性可靠性最好，但延时性最差。

## Kafka的consumer如何消费数据

在Kafka中，Producers将消息推送给Broker端，在Consumer和Broker建立连接之后，会主动去Pull（或者说Fetch）消息。这种模式有些优点，首先Consumer端可以根据自己的消费能力适时的去fetch消息并处理，且可以控制消息消费的进度（offset）；此外，消费者可以控制每次消费的数，实现批量消费。

## Kafka 提供的API有哪些

Kafka 提供了两套Consumer API，分为High-levelAPI 和 Sample API
Sample API
这是一个底层API，它维持了一个与单一Broker 的连接


## Kafka 提供的API有哪些

Kafka 提供了两套Consumer API,分为 High-level API 和Sample API
Sample API
这是一个底层API，它维持了一个与单一Broker的连接，并且这个API是完全无状态的，每次请求都需要指定offset值，因此这套API也是最灵活的。
High-level API
该API封装了对集群中一系列Broker的访问，可以透明地消费下一个Topic，它自己维护了已消费消息的状态，即每次消费的都会下一个消息。High-level API还支持以组的形式消费Topic，如果Consumers有同一个组名，那么Kafka就相当于一个队列消息服务，而各个Consumer均衡地消费相应Partition中的数据。若Consumers有不同的组名，那么此时Kafka就相当于一个广播服务，会把Topic中的所有消息广播到每个Consumer

## Kafka的Topic中Partition数据是怎么存储到磁盘的


Topic 中的多个Partition以文件夹的形式保存到Broker，每个分区序号从0递增，且消息有序。Partition文件下有多个Segment（xxx.index,xxx.log），Segment文件里的大小和配置文件大小一致。默认为1GB，但可以根据实际需要修改。如果大小大于1GB时，会滚动一个新的Segment并且以上一个Segment最后一条消息的偏移量命名。

## Kafka 创建Topic后如何将分区放置到不同的Broker 中

Kafka创建Topic将分区放置到不同的Broker时遵循以下
规则:
1.副本因子不能大于Broker的个数。
2.第一个分区（编号为0）的第一个副本放置位置是随机从Broker List中选择的。
3.其他分区的第一个副本放置位置相对于第0个分区依次往后移。也就是如果有3个Broker，3个分区，假设第一个分区放在第二个Broker上，那么第二个分区将会放在第三个Broker上；第三个分区将会放在第一个Broker上，更多Broker与更多分区依此类推。剩余的副本相对于第一个副本放置位置其实是由nextReplicaShiftl也是随机产生的。决定的，而这个数

## Kafka的日志保留期与数据清理策略

概念
保留期内保留了Kafka群集中的所有已发布消息，超过保期的数据将被按清理策略进行清理。默认保留时间是7天，如果想修改时间，在
更改参数 1og.retention.hours/minutes/ms的值便可。
清理策略
删除:
server.properties log.cleanup.policy=delete为delete，文件无法被索引。只有过了里ment.delete.delay.ms间，才会真正被删除。
压缩:
个默认是关闭的。表示启用删除策略，这也是默认策略。一开始只是标记1og.Seg这个参数设置的时log.cleanup.policy=compact表示启用压缩策略，将数据压缩，只保留每个Key最后一个版本的数据。首先在Broker的配置中设置1og.cleaner.enable=true启用cleaner，这

## Kafka日志存储的Message是什么格式

Kafka一个Message由固定长度的header和一个变长的消息体body组成。将Message存储在日志时采用不同于Producer发送的消息格式。每个日志文件都是一个log entries（日志项）序列:
1.每一个log entry包含一个四字节整型数（Message长度，值为1+4+N）。

2.1个字节的magic，magic表示本次发布Kafka服务
间。程序协议版本号。

3.4个字节的CRC32值，CRC32用于校验Message。
4.最终是N个字节的消息数据。每条消息都有一个当前Partition下唯一的64位offset。
Kafka没有限定单个消息的大小，但一般推荐消息大小不要超过1MB，通常一般消息大小都在1~10KB之

## Kafka是否支持多租户隔离

多租户技术（multi-tenancy technology）是一种软隔离性。
解决方案
-tenancy technol件架构技术，它是实现如何在多用户的环境下共用相同的系统或程序组件，并且仍可确保各用户间数据的通过配置哪个主题可以生产或消费数据来启用多租户，也有对配额的操作支持。管理员可以对请求定义和强制配额，以控制客户端使用的Broker资源。

没问题。你发的那段文字显然是从 OCR（光学字符识别）识别出来的，里面有很多拼写错误（如 `1og`、`rol1`）、中英文混杂以及排版断行的问题。

结合 Kafka 的官方术语和常见的面试题格式，我为你还原了**原本应该是这样**的文字组织：

------

## Kafka 日志分段（Segment）与刷新（Flush）策略

日志分段（Segment）策略

Kafka 的日志（Log）不是一个大文件，而是由多个分段（Segment）组成的。其滚动生成新 Segment 的策略主要受以下参数控制：

1. **`log.segment.bytes`**：每个 Segment 的最大容量。当 Segment 文件大小达到指定容量时，将强制生成一个新的 Segment。
   - **默认值**：1 GB（-1 代表不限制）。
2. **`log.roll.hours` / `log.roll.ms`**：日志滚动的周期时间。即使文件大小未达到上限，只要到达指定时间，也会强制生成一个新的 Segment。
   - **默认值**：168h（即 7 天）。
3. **`log.retention.check.interval.ms`**：日志片段文件检查的周期时间。Kafka 会周期性地检查每个 Segment 是否符合删除或滚动的条件。
   - **默认值**：300000ms（5 分钟）。*(注：你原文写的是 60000ms，不同版本略有差异)*



日志刷新（Flush）策略

Kafka 为了提高吞吐量，消息写入时首先进入操作系统的**页缓存（Page Cache）**。为了保证持久化，Kafka 根据以下参数定期将缓存中的一批数据写入（Flush）到磁盘日志文件中。

1. **`log.flush.interval.messages`**：消息累积达到多少条时，将数据刷入磁盘。
   - **默认值**：Long.MAX_VALUE（即由系统决定，不建议手动改小，除非追求极致的一致性）。
2. **`log.flush.interval.ms`**：距离上一次刷盘达到该时间间隔时，强制执行一次 Flush。
   - **默认值**：null。
3. **`log.flush.scheduler.interval.ms`**：日志刷新调度器的检查周期。它会周期性地检查是否需要将内存中的信息 Flush 到磁盘。
   - **默认值**：Long.MAX_VALUE。


## Kafka中如何进行主从同步

Kafka动态维护了一个同步状态的副本的集合（a setof In-SyncReplicas），简称ISR，在这个集合中的结
点都是和Leader保持高度一致的，任何一条消息只有被这个集合中的每个结点读取并追加到日志中，才会向外部通知“这个消息已经被提交”。kafka通过配置是同步，默认是同步同步复制producer.type来确定是异步还
Producer会先通过Zookeeper识别到Leader，然后向Leader 发送消息，Leader 收到消息后写入到本地log文件。这个时候Follower 再向Leader Pull 消息，Pull回来的消息会写入的本地log中，写入完成后会向Leader 发送Ack回执，等到Leader 收到所有Follower的回执之后，才会向Producer回传Ack。
异步复制
Kafka中Producer 异步发送消息是基于同步发送消息的接口来实现的，异步发送消息的实现很简单，客户端消息发送过来以后，会先放入一个BlackingQueue队列中然后就返回了。Producer 再开启一个线程ProducerSendTread不断从队列中取出消息，然后调用同步发送消息的接口将消息发送给Broker。Producer的这种在内存缓存消息，当累计达到阀值时批量发送请求，小数据1/0太多，会拖慢整体的网络延迟，批量延迟发送事实上提升了网络效率。但是如果在达到阀值前，Producer不可用了，缓存的数据将会丢失。

## Kafka中什么情况下会出现消息丢失/不一致的问题


消息发送时。

消息发送有两种方式：同步syncc和异步。默认是同步的方式，可以通过producer.type
属性进行配置，kafka也可以通过配置acks属性来确认消息的生产
0：表示不进行消息接收是否成功的确认
1：表示当 leader 接收成功时的确认
-1：表示leader 和follower 都接收成功的确认
当acks=0时，不和Kafka进行消息接收确认，可能会因为网络异常，缓冲区满的问题，导致消息丢失
当acks=1时，只有leader同步成功而follower尚未完成同步，如果leader挂了，就会造成数据丢失消息

消费时Kafka有两个消息消费的consumer接口，分别是w-level和使用简单hign-level
1ow-level：消费者自己维护offset等值，可以实现对kafka的完全控制
high-level：封装了对partition和offset,如果使用高级接口，可能存在一个消费者提取了一个消息后便提交了offset，那么还没来得及消费就已经挂了，下次消费时的数据就是offset +1的位置，那么原先offset的数据就丢失了。

## Kafka作为流处理平台的特点

流处理就是连续、实时、并发和以逐条记录的方式处理数据的意思。Kafka 是一个分布式流处理平台，它的高吞吐量、低延时、高可靠性、容错性、高可扩展性都使得Kafka非常适合作为流式平台。
1.它是一个简单的、轻量级的Java类库，能够被集成到任何Java应用中
2.除了Kafka之外没有任何其他的依赖，利用Kafka的分区模型支持水平扩容和保证顺序性
3.支持本地状态容错，可以执行非常快速有效的有状态操作
4.支持eexactly-once语义
5.支持一次处理一条记录，实现ms级的延迟

## 消费者故障，出现活锁问题如何解决

活锁的概念：消费者持续的维持心跳，但没有进行消息处理。
为了预防消费者在这种情况一直持有分区，通常会利用max.poll.interval.ms活跃检测机制，如果调用Poll的频率大于最大间隔，那么消费者将会主动离开消费组，以便其他消费者接管该分区

## Kafa中如何保证顺序消费

Kafka的消费单元是Partition，同一个Partition使用offset 作为唯一标识保证顺序性，但这只是保证了在
Partition内部的顺序性而不是Topic中的顺序，因此我们需要将所有消息发往统一Partition才能保证消息顺序消费，那么可以在发送的候指定MessageKey,同一个key的消息会发到同一个Partition中。











# RabbitMQ

