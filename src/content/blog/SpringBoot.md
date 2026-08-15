---
title: Spring Boot
tags: learn
abbrlink: a541262a
date: 2024-11-10 14:03:39
description: ""
sticky: 0
draft: false
---


# Spring Framwork系统架构
![](/images/SSM/1.png)









# MAVEN

## 下载
添加环境配置
创建仓库
配置IntelliJ IDEA中maven配置
module选择maven
## 依赖管理
### 依赖配置
maven仓库依赖:https://mvnrepository.com
找到dependency(坐标) 加入pom.xml
### 依赖传递
间接依赖也可以传递到
![](/images/SSM/2.png)
排除依赖
```xml
  <dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
    <!--排除依赖-->
    <exclusions>
      <exclusion>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
      </exclusion>
    </exclusions>
  </dependency>
```
### 依赖范围
通过 `<scope>...</scope>` 设置作用范围
### 生命周期
- clean：清理工作
- default：核心工作（编译、测试、打包、安装、部署等）
  - `COMPILE` `TEST` `PACKAGE` `INSTALL`···
- site：生成报告、发布站点等。

在**同一套声明周期中**，当运行后面阶段时，前面的阶段也会被运行
执行：直接双击或在终端中`mvn command`

# [HTTP请求响应](https://zennnj.github.io/posts/28758.html)
## 创建springboot
新建项目选择springboot，勾选spring web这个依赖
创建请求处理类HelloController，添加请求处理方法hello，运行启动类
```java
//请求处理类
@RestController
public class HelloController {
    @RequestMapping("/hello")
    public String hello(){
        System.out.println("hello?");
        return "hello!";
    }
}
```
浏览器：

- 输入网址：`http://192.168.100.11:8080/hello`
  - 通过IP地址192.168.100.11定位到网络上的一台计算机
  - 通过端口号8080找到计算机上运行的程序
    > `localhost:8080`  , 意思是在本地计算机中找到正在运行的8080端口的程序
  - /hello是请求资源位置
    - 资源：对计算机而言资源就是数据
      - web资源：通过网络可以访问到的资源（通常是指存放在服务器上的数据）
    > `localhost:8080/hello` ，意思是向本地计算机中的8080端口程序，获取资源位置是/hello的数据
    > - 8080端口程序，在服务器找/hello位置的资源数据，发给浏览器

服务器：（可以理解为ServerSocket）
- 接收到浏览器发送的信息（如：/hello）
- 在服务器上找到/hello的资源
- 把资源发送给浏览器

# Tomcat
=servlet容器
![](/images/SSM/3.png)

# Postman
- Postman是一款功能强大的网页调试与发送网页HTTP请求的Chrome插件。
  > Postman原是Chrome浏览器的插件，可以模拟浏览器向后端服务器发起任何形式(如:get、post)的HTTP请求
  > 使用Postman还可以在发起请求时，携带一些请求参数、请求头等信息

- 作用：常用于进行接口测试

# 请求响应

## 请求
**原始方式**
```java
@RestController
public class RequestController {
  //原始方式
    @RequestMapping("/simpleParam")
    public String simpleParam(HttpServletRequest request){
      // http://localhost:8080/simpleParam?name=Tom&age=10  
        // 请求参数： name=Tom&age=10   （有2个请求参数）
        // 第1个请求参数： name=Tom   参数名:name，参数值:Tom
        // 第2个请求参数： age=10     参数名:age , 参数值:10

        String name = request.getParameter("name");//name就是请求参数名
        String ageStr = request.getParameter("age");//age就是请求参数名

        int age = Integer.parseInt(ageStr);//需要手动进行类型转换
        System.out.println(name+"  :  "+age);
        return "OK";
    }
}
```
**SpringBoot方式**
在Springboot的环境中，对原始的API进行了封装，接收参数的形式更加简单。 如果是简单参数，参数名与形参变量名相同，定义同名的形参即可接收参数。

~~~java
@RestController
public class RequestController {
    //springboot方式
    @RequestMapping("/simpleParam")
    public String simpleParam(String name , Integer age ){//形参名和请求参数名保持一致
        System.out.println(name+"  :  "+age);
        return "OK";
    }
}
~~~
### 参数名不一致
~~~java
@RequestMapping("/simpleParam")
public String simpleParam(@RequestParam(name = "name", required = false) String username, Integer age){
  System.out.println(username+ ":" + age);
return "OK";
}
~~~
> **注意事项：**
>
> @RequestParam中的required属性默认为true（默认值也是true），代表该请求参数必须传递，如果不传递将报错

### 为什么在controll里推荐使用包装类型(Integer、Long...)？

这是 **Spring 框架设计的推荐模式**，因为：

- Web 请求的参数不是强类型的（字符串传输、可能为空）；
- 请求参数缺失、空值、类型不匹配等情况很常见；
- 使用包装类型可以安全地判空；
- 可以搭配 `@RequestParam(required = false)` 让参数成为可选项。

**⚠️ 如果你写的是 `int status`**

- Java 基本类型 `int` **不允许为 null**；
- Spring 在数据绑定阶段会尝试把请求参数转换为 `int`；
  - 若成功：传值；
  - 若失败（比如参数缺失或无法转换）：Spring 会直接抛出异常（`HttpMessageNotReadableException` 或 `TypeMismatchException`）；
- 整个接口直接报 400 Bad Request，没法做*优雅*处理。

### 实体参数
要想完成数据封装，需要遵守如下规则：**请求参数名与实体类的属性名相同**
```java
    @RequestMapping("/simplePojo")
    public String simplePojo(User user){
        System.out.println(user);
        return "OK";
    }
    //数组集合参数
    @RequestMapping("/arrayParam")
    public String arrayParam(String[] hobby){
        System.out.println(Arrays.toString(hobby));
        return "OK";
    }
    //默认情况下，请求中参数名相同的多个值，是封装到数组。如果要封装到集合，要使用@RequestParam绑定参数关系
    @RequestMapping("/listParam")
    public String listParam(@RequestParam List<String> hobby){
        System.out.println(hobby);
        return "OK";
    }
    //日期时间参数
    @RequestMapping("/dateParam")
    public String dateParam(@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime updateTime){
        System.out.println(updateTime);
        return "OK";
    }

```
```java
package org.example.springbootquickstart.pojo;

public class User {
    private String name;
    private int age;

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```
**get和set方法必须设置**，如果不设置拿不到对应参数输出结果为：

```
User{name='null', age=0}
```
**数组集合Postman测试：**
在前端请求时，有两种传递形式：
方式一： xxxxxxxxxx?hobby=game&hobby=java
方式二：xxxxxxxxxxxxx?hobby=game,java

> 默认情况下，请求中参数名相同的多个值，是封装到数组。如果要封装到集合，要使用@RequestParam绑定参数关系!!!!!



### 复杂实体

复杂实体对象的封装，需要遵守如下规则：

- **请求参数名与形参对象属性名相同，按照对象层次结构关系即可接收嵌套实体类属性参数。**
![](/images/SSM/4.png)

### JSON参数
- @RequestBody注解：将JSON数据映射到形参的实体类对象中**（JSON中的key和实体类中的属性名保持一致）**

实体类：Address

```java
public class Address {
    private String province;
    private String city;
    
	//省略GET , SET 方法
}
```

实体类：User

```java
public class User {
    private String name;
    private Integer age;
    private Address address;
    
    //省略GET , SET 方法
}    
```

Controller方法：

```java
@RestController
public class RequestController {
    //JSON参数
    @RequestMapping("/jsonParam")
    public String jsonParam(@RequestBody User user){
        System.out.println(user);
        return "OK";
    }
}
```
postman接口测试：
![](/images/SSM/5.png)



#### 封装

当前端提交的数据和实体类中对应的属性差别比较大时，建议使用DTO来封装数据

#### 拷贝属性

```java
BeanUtils.copyProperties(employeeDTO, employee);
```

前提是属性名一致



### 路径参数

```java
@RestController
public class RequestController {
    //路径参数
    @RequestMapping("/path/{id}")
    public String pathParam(@PathVariable Integer id){
        System.out.println(id);
        return "OK";
    //传递多个路径参数：
    @RequestMapping("/path/{id}/{name}")
    public String pathParam2(@PathVariable Integer id, @PathVariable String name){
        System.out.println(id+ " : " +name);
        return "OK";
    }
}
```

## 响应
### 统一响应结果
```java
@RestController
public class ResponseController {
    @RequestMapping("/hello")
    public Result hello(){
        System.out.println("Hello World ~");
        //return new Result(1,"success","Hello World ~");
        return Result.success("Hello World ~");
    }

    @RequestMapping("/getAddr")
    public Result getAddr(){
        Address addr = new Address();
        addr.setProvince("广东");
        addr.setCity("深圳");
        return Result.success(addr);
    }

    @RequestMapping("/listAddr")
    public Result listAddr(){
        List<Address> list = new ArrayList<>();

        Address addr = new Address();
        addr.setProvince("广东");
        addr.setCity("深圳");

        Address addr2 = new Address();
        addr2.setProvince("陕西");
        addr2.setCity("西安");

        list.add(addr);
        list.add(addr2);
        return Result.success(list);
    }
}
```
```java
package org.example.springbootquickstart.pojo;

/**
 * 统一响应结果封装类
 */
public class Result {
    private Integer code ;//1 成功 , 0 失败
    private String msg; //提示信息
    private Object data; //数据 date

    public Result() {
    }
    public Result(Integer code, String msg, Object data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
    public Integer getCode() {
        return code;
    }
    public void setCode(Integer code) {
        this.code = code;
    }
    public String getMsg() {
        return msg;
    }
    public void setMsg(String msg) {
        this.msg = msg;
    }
    public Object getData() {
        return data;
    }
    public void setData(Object data) {
        this.data = data;
    }

    public static Result success(Object data){
        return new Result(1, "success", data);
    }
    public static Result success(){
        return new Result(1, "success", null);
    }
    public static Result error(String msg){
        return new Result(0, msg, null);
    }

    @Override
    public String toString() {
        return "Result{" +
                "code=" + code +
                ", msg='" + msg + '\'' +
                ", data=" + data +
                '}';
    }
}

```

## @RequestMapping



在Spring当中为了简化请求路径的定义，可以把公共的请求路径，直接抽取到类上，在类上加一个注解@RequestMapping，并指定请求路径"/depts"。

> 注意事项：一个完整的请求路径，应该是类上@RequestMapping的value属性 + 方法上的 @RequestMapping的value属性





# 分层解耦

之前讲过的[**MVC**](https://zennnj.github.io/posts/40121.html#MVC设计模式)在springboot里就是View(前端) - Controller - Model(Service & Dao)

MVC和三层架构的目的都是高内聚、低耦合



## 三层架构
- Controller：控制层。接收前端发送的请求，对请求进行处理，并响应数据。
- Service：业务逻辑层。处理具体的业务逻辑。
- Dao：数据访问层(Data Access Object)，也称为持久层。负责数据访问操作，包括数据的增、删、改、查。

## 充分解耦
使用对象时，在程序中不要主动使用new产生对象，转换为中外部提供对象
- **IoC(Inversion of Control)控制反转**
  - **对象的创建控制权由程序转移到外部** (比如JButton)
  - Spring提供了一个**IoC容器**，用来充当IoC思想中的“外部”
  - IoC容器负责对象的创建、初始化等一系列工作，被创建或被管理的对象在IoC容器中统称为**Bean**
- **DI(Dependency Injection)依赖注入**
  - 容器为应用程序提供运行时，所依赖的资源，称之为依赖注入。
- 效果：使用对象时不仅能直接从IoC容器中获取，并且获取到的bean已经绑定了所有的依赖关系
- **Controller层：**

~~~java
@RestController
public class EmpController {

    @Autowired //运行时,从IOC容器中获取该类型对象,赋值给该变量
    private EmpService empService ;

    @RequestMapping("/listEmp")
    public Result list(){
        //1. 调用service, 获取数据
        List<Emp> empList = empService.listEmp();

        //3. 响应数据
        return Result.success(empList);
    }
}
~~~

- **Service层：**

~~~java
@Component //将当前对象交给IOC容器管理,成为IOC容器的bean
public class EmpServiceA implements EmpService {

    @Autowired //运行时,从IOC容器中获取该类型对象,赋值给该变量
    private EmpDao empDao ;

    @Override
    public List<Emp> listEmp() {
        //1. 调用dao, 获取数据
        List<Emp> empList = empDao.listEmp();

        //2. 对数据进行转换处理 - gender, job
        empList.stream().forEach(emp -> {
            //处理 gender 1: 男, 2: 女
            String gender = emp.getGender();
            if("1".equals(gender)){
                emp.setGender("男");
            }else if("2".equals(gender)){
                emp.setGender("女");
            }

            //处理job - 1: 讲师, 2: 班主任 , 3: 就业指导
            String job = emp.getJob();
            if("1".equals(job)){
                emp.setJob("讲师");
            }else if("2".equals(job)){
                emp.setJob("班主任");
            }else if("3".equals(job)){
                emp.setJob("就业指导");
            }
        });
        return empList;
    }
}
~~~

**Dao层：**

~~~java
@Component //将当前对象交给IOC容器管理,成为IOC容器的bean
public class EmpDaoA implements EmpDao {
    @Override
    public List<Emp> listEmp() {
        //1. 加载并解析emp.xml
        String file = this.getClass().getClassLoader().getResource("emp.xml").getFile();
        System.out.println(file);
        List<Emp> empList = XmlParserUtils.parse(file, Emp.class);
        return empList;
    }
}
~~~

### IoC案例

#### @Component的衍生注解

| 注解        | 位置                                          |
| :---------- | :-------------------------------------------- |
| @Controller | 标注在控制器类上(RestController已包含)        |
| @Service    | 标注在业务类上                                |
| @Repository | 标注在数据访问类上(由于与mybatis整合，用得少) |



`@Repository(value = "daoA")` 指定bean的名字

此四个注解想要生效，需要被扫描注解`@ComponentScan`扫描，虽然没有显式配置，但是实际上已经包含在了启动类声明注解`@SpringBootApplicatiion`中，默认扫描范围是启动类所在包及其子包。

手动设置: `@ComponentScan(("dao","com.arg"))` ←包名

*设置这个注解之后会把原来的覆盖掉，很麻烦，所以一般按照项目规范放在启动类那个包下面。

### DI案例

如果bean有多个：

| 注解                                  | 作用                       |
| :------------------------------------ | :------------------------- |
| @Primary                              | 使得注解下面的bean优先注入 |
| @Aurowired + @Qualifier("bean value") | 注入指定名称的bean         |
| @Resource(name ="bean value")         | 注入指定名称的bean         |

@q和@a是spring提供的 @r是jdk提供的
@a默认按照类型注入 @r默认按照名称注入



## @Bean

- 用在方法上
- **告诉 Spring：执行这个方法，把方法返回值作为一个 Bean 存入 IOC 容器。**
- 用来“定义对象”。
- **同时，这个方法的参数也会被自动注入**

### `@ConditionalOnMissingBean` 

Spring Boot 的条件注解，意思是：

> **只有当容器中不存在某个 Bean 时，才执行当前方法创建 Bean。**

### `@Configuration` + `@Bean` 

Spring Boot 推荐：

```
@Configuration
public class OssConfiguration {

    @Bean
    public AliOssUtil aliOssUtil(AliOssProperties aliOssProperties) {
        return new AliOssUtil(...);
    }
}
```

作用：

- `@Configuration` 告诉 Spring：“这是配置类，请处理其中的 @Bean 方法”
- `@Bean` 把“方法返回值”注册到容器

### vs `@Component` 

简单说：`@Component` **不能创建带参数的对象**。

更详细说：
 当你用 `@Component` 标注一个类时，Spring：

- 会实例化这个类（调用默认构造函数）
- 如果你的类必须要依赖配置参数（如 OSS 配置），默认构造器根本不够用
- 所以你没办法通过 `@Component` 创建一个配置完善的 AliOssUtil

| 注解             | 相当于                                                       |
| ---------------- | ------------------------------------------------------------ |
| `@Component`     | 直接把整个类扔进 IoC 容器                                    |
| `@Bean`          | 用一个工厂方法生产 Bean，然后把“生产出来的对象”放入 IoC 容器 |
| `@Configuration` | 声明：这是一个“Bean 工厂集合”                                |





# 开发规范

## REST

- REST（Representational State Transfer），表述性状态转换，它是一种软件架构风格。

**传统URL风格如下：**

```text
http://localhost:8080/user/getById?id=1     GET：查询id为1的用户
http://localhost:8080/user/saveUser         POST：新增用户
http://localhost:8080/user/updateUser       POST：修改用户
http://localhost:8080/user/deleteUser?id=1  GET：删除id为1的用户
```

我们看到，原始的传统URL呢，定义比较复杂，而且将资源的访问行为对外暴露出来了。



**基于REST风格URL如下：**

```
http://localhost:8080/users/1  GET：查询id为1的用户
http://localhost:8080/users    POST：新增用户
http://localhost:8080/users    PUT：修改用户
http://localhost:8080/users/1  DELETE：删除id为1的用户
```

其中总结起来，就一句话：通过URL定位要操作的资源，通过HTTP动词(请求方式)来描述具体的操作。

## 统一响应结果

前后端工程在进行交互时，使用统一响应结果 Result。

~~~java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    private Integer code;//响应码，1 代表成功; 0 代表失败
    private String msg;  //响应信息 描述字符串
    private Object data; //返回的数据

    //增删改 成功响应
    public static Result success(){
        return new Result(1,"success",null);
    }
    //查询 成功响应
    public static Result success(Object data){
        return new Result(1,"success",data);
    }
    //失败响应
    public static Result error(String msg){
        return new Result(0,msg,null);
    }
}
~~~

## 开发流程

1. 查看页面原型明确需求
   - 根据页面原型和需求，进行表结构设计、编写接口文档(已提供)

2. 阅读接口文档
3. 思路分析
4. 功能接口开发
   - 就是开发后台的业务功能，一个业务功能，我们称为一个接口
5. 功能接口测试
   - 功能开发完毕后，先通过Postman进行功能接口测试，测试通过后，再和前端进行联调测试
6. 前后端联调测试
   - 和前端开发人员开发好的前端工程一起测试

## 开发文档

除了使用postman之外，还可以用swagger依赖生成本地接口测试页面。
apifox之类也可以。

### Swagger

1.导入 knife4j 的maven坐标

2.在配置类中加入 knife4j 相关配置

3.设置静态资源映射，否则接口文档页面无法访问

| **注解**          | **说明**                                               |
| ----------------- | ------------------------------------------------------ |
| @Api              | 用在类上，例如Controller，表示对类的说明               |
| @ApiModel         | 用在类上，例如entity、DTO、VO                          |
| @ApiModelProperty | 用在属性上，描述属性信息                               |
| @ApiOperation     | 用在方法上，例如Controller的方法，说明方法的用途、作用 |

可以直接通过一个配置类进行配置

基于Swagger2的旧版本：

```java
/**
 * 配置类，注册web层相关组件
 */
@Configuration
@Slf4j
public class WebMvcConfiguration extends WebMvcConfigurationSupport {


    /**
     * 通过knife4j生成接口文档
     * @return
     */
    @Bean
    public Docket docket1() {
        log.info("准备接口文档");
        ApiInfo apiInfo = new ApiInfoBuilder()
                .title("苍穹外卖项目接口文档")
                .version("2.0")
                .description("苍穹外卖项目接口文档")
                .build();
        Docket docket = new Docket(DocumentationType.SWAGGER_2)
                .groupName("管理端接口")
                .apiInfo(apiInfo)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.sky.controller.admin"))
                .paths(PathSelectors.any())
                .build();
        return docket;
    }

    @Bean
    public Docket docket2() {
        log.info("准备接口文档");
        ApiInfo apiInfo = new ApiInfoBuilder()
                .title("苍穹外卖项目接口文档")
                .version("2.0")
                .description("苍穹外卖项目接口文档")
                .build();
        Docket docket = new Docket(DocumentationType.SWAGGER_2)
                .groupName("用户端接口")
                .apiInfo(apiInfo)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.sky.controller.user"))
                .paths(PathSelectors.any())
                .build();
        return docket;
    }

    /**
     * 设置静态资源映射
     * @param registry
     */
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        log.info("准备静态资源映射");
        registry.addResourceHandler("/doc.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    }

}
```

> 此处需要静态资源映射是因为继承了 `WebMvcConfigurationSupport`，会导致 SpringBoot 默认静态资源配置失效，所以必须**手动映射**。


基于OpenApi3的新版本：

```java
@Configuration
@EnableOpenApi
public class SwaggerConfig {
    @Bean
    public Docket docket() {
        Docket docket = new Docket(DocumentationType.OAS_30)
                .apiInfo(apiInfo()).enable(true)
                .select()
                //apis： 添加swagger接口提取范围
                .apis(RequestHandlerSelectors.basePackage("www.paicoding.controller"))
                .paths(PathSelectors.any())
                .build();

        return docket;
    }
    
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("技术派")
                .description("一个基于 Spring Boot、MyBatis-Plus、MySQL、Redis、ElasticSearch、MongoDB、Docker、RabbitMQ 等技术栈实现的社区系统，采用主流的互联网技术架构、全新的UI设计、支持一键源码部署，拥有完整的文章&教程发布/搜索/评论/统计流程等，代码完全开源，没有任何二次封装，是一个非常适合二次开发/实战的现代化社区项目👍 。")
                .contact(new Contact("沉默王二", "https://paicoding.com","www.qing_gee@163.com"))
                .version("v1.0")
                .build();
    }
}
```




也可以在yml里设置属性来达到需求

```yml
knife4j:
  enable: true
  setting:
    language: zh-CN
  openapi:
    title: 技术派
    description: 一个基于 Spring Boot、MyBatis-Plus、MySQL、Redis、ElasticSearch、MongoDB、Docker、RabbitMQ 等技术栈实现的社区系统，采用主流的互联网技术架构、全新的UI设计、支持一键源码部署，拥有完整的文章&教程发布/搜索/评论/统计流程等，代码完全开源，没有任何二次封装，是一个非常适合二次开发/实战的现代化社区项目👍 。
    version: 1.0.0
    concat:
      - 一灰灰 | 楼仔 | 沉默王二
      - https://paicoding.com
      - https://github.com/itwanger/paicoding
    license: Apache License 2.0
    license-url: https://github.com/itwanger/paicoding/blob/main/License
    email: bangzewu@126.com
    group:
      admin:
        group-name: 后台接口分组
        api-rule: package
        api-rule-resources:
          - com.github.paicoding.forum.web.admin
      front:
        group-name: 前台接口分组
        api-rule: package
        api-rule-resources:
          - com.github.paicoding.forum.web.front
```











## 配置文件

主配置文件引用dev文件的配置，即开发环境的配置，投入生产时可以更换配置。



# PageHelper

原始方式的分页查询，存在着"步骤固定"、"代码频繁"的问题

解决方案：可以使用一些现成的分页插件完成。对于Mybatis来讲现在最主流的就是PageHelper。

EmpMapper

```java
@Mapper
public interface EmpMapper {
    //获取当前页的结果列表
    @Select("select * from emp")
    public List<Emp> list();
}
```



EmpServiceImpl

```java
@Override
public PageBean page(Integer page, Integer pageSize) {
    // 设置分页参数
    PageHelper.startPage(page, pageSize); 
    // 执行分页查询
    List<Emp> empList = empMapper.list(); 
    // 获取分页结果
    Page<Emp> p = (Page<Emp>) empList;   
    //封装PageBean
    PageBean pageBean = new PageBean(p.getTotal(), p.getResult()); 
    return pageBean;
}
```

# 文件上传

保证每次上传文件时文件名都唯一的（使用UUID获取随机文件名）

```java
@Slf4j
@RestController
public class UploadController {

    @PostMapping("/upload")
    public Result upload(String username, Integer age, MultipartFile image) throws IOException {
        log.info("文件上传：{},{},{}",username,age,image);

        //获取原始文件名
        String originalFilename = image.getOriginalFilename();

        //构建新的文件名
        String extname = originalFilename.substring(originalFilename.lastIndexOf("."));//文件扩展名
        String newFileName = UUID.randomUUID().toString()+extname;//随机名+文件扩展名

        //将文件存储在服务器的磁盘目录
        image.transferTo(new File("E:/images/"+newFileName));

        return Result.success();
    }

}
```

那么如果需要上传大文件，可以在application.properties进行如下配置：

~~~properties
#配置单个文件最大上传大小
spring.servlet.multipart.max-file-size=10MB

#配置单个请求最大上传大小(一次请求可以上传多个文件)
spring.servlet.multipart.max-request-size=100MB
~~~

如果直接存储在服务器的磁盘目录中，存在以下缺点：

- 不安全：磁盘如果损坏，所有的文件就会丢失
- 容量有限：如果存储大量的图片，磁盘空间有限(磁盘不可能无限制扩容)
- 无法直接访问

为了解决上述问题呢，通常有两种解决方案：

- 自己搭建存储服务器，如：fastDFS 、MinIO
- 使用现成的云服务，如：阿里云，腾讯云，华为云

[流式上传与分片上传的原理与实现](https://blog.csdn.net/Larry_794204525/article/details/143966510)

[文件与文件流](https://www.cnblogs.com/qianjindelaowu/p/17691201.html)



## 阿里云OSS







# 参数配置化 Utils

因为application.properties是springboot项目默认的配置文件，所以springboot程序在启动时会默认读取application.properties配置文件，而我们可以使用一个现成的注解：@Value，获取配置文件中的数据。

@Value 注解通常用于外部配置的属性注入，具体用法为： @Value("${配置文件中的key}")

~~~java
@Component
public class AliOSSUtils {

    @Value("${aliyun.oss.endpoint}")
    private String endpoint;
    
    @Value("${aliyun.oss.accessKeyId}")
    private String accessKeyId;
    
    @Value("${aliyun.oss.accessKeySecret}")
    private String accessKeySecret;
    
    @Value("${aliyun.oss.bucketName}")
    private String bucketName;
 	
 	//省略其他代码...
 }   
~~~

## yml配置文件

在springboot项目当中是支持多种配置方式的，除了支持properties配置文件以外，还支持yml格式的配置文件。

基本语法：

- 大小写敏感
- 数值前边必须有空格，作为分隔符
- 使用缩进表示层级关系，缩进时，不允许使用Tab键，只能用空格（idea中会自动将Tab转换为空格）
- 缩进的空格数目不重要，只要相同层级的元素左侧对齐即可
- `#`表示注释，从这个字符一直到行尾，都会被解析器忽略

常见的数据格式:

对象/Map集合

```yml
user:
  name: zhangsan
  age: 18
  password: 123456
```

数组/List/Set集合

```yml
hobby: 
  - java
  - game
  - sport
```

## @ConfigurationProperties

`@ConfigurationProperties(prefix = "sky.alioss")` 是 **Spring Boot 的配置绑定注解**，作用非常关键：
 👉 **它可以把 application.yml / application.properties 里的配置自动注入到一个 Java 类里。**

假设你的 `application.yml` 里有这样一段：

```yaml
sky:
  alioss:
    endpoint: xxx
    access-key-id: xxx
    access-key-secret: xxx
    bucket-name: xxx
```

然后你有一个配置类：

```java
@Component
@ConfigurationProperties(prefix = "sky.alioss")
@Data
public class AliOssProperties {
    private String endpoint;
    private String accessKeyId;
    private String accessKeySecret;
    private String bucketName;
}
```

那么 Spring Boot 会自动注入。**属性名自动匹配，不用你手写 @Value 注入！**

`@ConfigurationProperties`相比 `@Value` 有 3 个明显好处：

1. 支持批量绑定，大量配置时更简洁
2. 支持类型安全（可绑定到 List、Map、自定义类等）

    ```java
    private Map<String, String> headers;
    private List<String> whitelist;
    ```

    这些 `@Value` 无法优雅处理。


3. IDE 自动提示、校验更容易

Spring Boot 会自动根据前缀给你在 yml 里补全提示。

###  prefix 

prefix = "sky.alioss"代表：

**只绑定 yml 中 sky.alioss 下面的字段**， 避免绑定到不相关的配置


> 注意要加 @Component &  @EnableConfigurationProperties
>
> `@ConfigurationProperties` **只是配置绑定规则**，
>  必须让这个类成为 Spring Bean 才能使用。
>
> 最常见的做法：
> ```java
> @Component
> @ConfigurationProperties(prefix = "sky.alioss")
> ```
> 或者用配置类统一启用：
> ```java
> @EnableConfigurationProperties(AliOssProperties.class)
> ```









# 登录校验

怎么来实现登录校验的操作呢？具体的实现思路可以分为两部分：

1. 在员工登录成功后，需要将用户登录成功的信息存起来，记录用户已经登录成功的标记。
2. 在浏览器发起请求时，需要在服务端进行统一拦截，拦截后进行登录校验。

## 加密存储密码

```java
password = DigestUtils.md5DigestAsHex(password.getBytes());
```

md5加密


## 统一拦截技术会话跟踪技术

**会话技术**

web开发当中，会话指的就是浏览器与服务器之间的一次连接，我们就称为一次会话

会话跟踪：一种维护浏览器状态的方法，服务器需要识别多次请求是否来自于同一浏览器，以便在同一次会话的多次请求间共享数据。

统一拦截技术会话跟踪技术:

1. Cookie（客户端会话跟踪技术）
   - 数据存储在客户端浏览器当中
2. Session（服务端会话跟踪技术）
   - 数据存储在储在服务端
3. 令牌技术

### JWT令牌
JWT全称：JSON Web Token  （官网：https://jwt.io/）

- 定义了一种简洁的、自包含的格式，用于在通信双方以json数据格式安全的传输信息。由于数字签名的存在，这些信息是可靠的。
JWT的组成： （JWT令牌由三个部分组成，三个部分之间使用英文的点来分割）

- 第一部分：Header(头）， 记录令牌类型、签名算法等。 例如：{"alg":"HS256","type":"JWT"}

- 第二部分：Payload(有效载荷），携带一些自定义信息、默认信息等。 例如：{"id":"1","username":"Tom"}

- 第三部分：Signature(签名），防止Token被篡改、确保安全性。将header、payload，并加入指定秘钥，通过指定签名算法计算而来。

要想使用JWT令牌，需要先引入JWT的依赖：

~~~xml
<!-- JWT依赖-->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>
~~~

生成：

~~~java
@Test
public void genJwt(){
    Map<String,Object> claims = new HashMap<>();
    claims.put("id",1);
    claims.put("username","Tom");
    
    String jwt = Jwts.builder()
        .setClaims(claims) //自定义内容(载荷)          
        .signWith(SignatureAlgorithm.HS256, "shining") //签名算法        
        .setExpiration(new Date(System.currentTimeMillis() + 24*3600*1000)) //有效期   
        .compact();
    
    System.out.println(jwt);
}
~~~

> 打开JWT的官网，将生成的令牌直接放在Encoded位置，此时就会自动的将令牌解析出来。

校验：

~~~java
@Test
public void parseJwt(){
    Claims claims = Jwts.parser()
        .setSigningKey("shining")//指定签名密钥（必须保证和生成令牌时使用相同的签名密钥）  
	    .parseClaimsJws("eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNjcyNzI5NzMwfQ.fHi0Ub8npbyt71UqLXDdLyipptLgxBUg_mSuGJtXtBk")
        .getBody();

    System.out.println(claims);
}
~~~



> **@Builder注释**
>
> 可以通过.builder.属性名(参数).属性名(参数).···.build();  来传入数据

### JWT + session  vs session + cookie

#### Cookie + Session

1. 用户第一次登录（POST /login）
2. 服务器校验账号密码，成功后创建一个 **Session（保存在服务器内存/Redis）**
3. 服务器生成一个 **SessionID**，写入 **Cookie** 返回给浏览器
4. 之后用户再访问接口时，浏览器自动携带 Cookie：`JSESSIONID=xxxxxx`
5. 服务器根据 `SessionID` 查 Session，判断用户登录状态 → 如果存在即允许访问

**📌 流程图**

客户端  ←→ Cookie(SessionID) ←→ 服务器Session存储登录信息

**💡 示例代码（Spring Boot）**

```java
@PostMapping("/login")
public String login(String username, String password, HttpServletRequest request) {
    if ("admin".equals(username) && "123".equals(password)) {
        HttpSession session = request.getSession();
        session.setAttribute("user", username);
        return "登录成功";
    }
    return "登录失败";
}

@GetMapping("/userInfo")
public String userInfo(HttpServletRequest request) {
    Object user = request.getSession().getAttribute("user");
    return user == null ? "未登录" : "当前用户：" + user;
}
```

#### Session + JWT（无状态身份认证）

1. 用户登录
2. 服务器生成一个 **JWT Token**（内容包含用户信息 + 过期时间 + 签名）
3. Token 返回给浏览器（通常保存在 localStorage / Authorization header）
4. 后续请求浏览器主动携带：`Authorization: Bearer xxxx`
5. 服务器 **不需要 Session**，只需验证 Token 签名 → 正确即允许访问

**📌 流程图**

客户端  ←→ Authorization(JWT Token) → 服务器验证签名，无状态

**💡 示例代码（Spring Boot + jjwt）**

```java
@PostMapping("/login")
public String login(String username, String password) {
    if ("admin".equals(username) && "123".equals(password)) {
        String token = Jwts.builder()
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SignatureAlgorithm.HS512, "mySecretKey")
                .compact();
        return token;
    }
    return "登录失败";
}

@GetMapping("/userInfo")
public String userInfo(@RequestHeader("Authorization") String token) {
    Claims claims = Jwts.parser()
            .setSigningKey("mySecretKey")
            .parseClaimsJws(token.replace("Bearer ", ""))
            .getBody();
    return "当前用户：" + claims.getSubject();
}
```

| 项目         | Cookie + Session                 | Session + JWT                       |
| ------------ | -------------------------------- | ----------------------------------- |
| 会话状态     | **有状态**（服务器维护 Session） | **无状态**（服务器不保存登录信息）  |
| 服务器压力   | 大，用户多 Session 多            | 小，可水平扩展                      |
| 登录持久化   | 依赖 Cookie                      | Token可保存在 localStorage / Cookie |
| 跨域支持     | 比较麻烦（Cookie要配置）         | 天生适合前后端分离                  |
| 安全性       | SessionID被窃取可盗用            | Token失效前可盗用，不可撤销         |
| 退出登录实现 | 删除服务器Session即可            | 需要黑名单 / 缩短过期时间           |
| 推荐场景     | 内网系统、后台管理               | 移动端、前后端分离、微服务          |

------






## Servlet规范中的Filter过滤器

![](D:\blog\source\images\SSM\6.png)

```java
@Slf4j
@WebFilter(urlPatterns = "/*") //拦截所有请求
public class LoginCheckFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain) throws IOException, ServletException {
        //前置：强制转换为http协议的请求对象、响应对象 （转换原因：要使用子类中特有方法）
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        //1.获取请求url
        String url = request.getRequestURL().toString();
        log.info("请求路径：{}", url); //请求路径：http://localhost:8080/login


        //2.判断请求url中是否包含login，如果包含，说明是登录操作，放行
        if(url.contains("/login")){
            chain.doFilter(request, response);//放行请求
            return;//结束当前方法的执行
        }


        //3.获取请求头中的令牌（token）
        String token = request.getHeader("token");
        log.info("从请求头中获取的令牌：{}",token);


        //4.判断令牌是否存在，如果不存在，返回错误结果（未登录）
        if(!StringUtils.hasLength(token)){
            log.info("Token不存在");

            Result responseResult = Result.error("NOT_LOGIN");
            //把Result对象转换为JSON格式字符串 (fastjson是阿里巴巴提供的用于实现对象和json的转换工具类)
            String json = JSONObject.toJSONString(responseResult);
            response.setContentType("application/json;charset=utf-8");
            //响应
            response.getWriter().write(json);

            return;
        }

        //5.解析token，如果解析失败，返回错误结果（未登录）
        try {
            JwtUtils.parseJWT(token);
        }catch (Exception e){
            log.info("令牌解析失败!");

            Result responseResult = Result.error("NOT_LOGIN");
            //把Result对象转换为JSON格式字符串 (fastjson是阿里巴巴提供的用于实现对象和json的转换工具类)
            String json = JSONObject.toJSONString(responseResult);
            response.setContentType("application/json;charset=utf-8");
            //响应
            response.getWriter().write(json);

            return;
        }


        //6.放行
        chain.doFilter(request, response);

    }
}
```

*需导入fastjson依赖



## Spring提供的interceptor拦截器



拦截器：

- 是一种动态拦截方法调用的机制，类似于过滤器。
- 拦截器是Spring框架中提供的，用来动态拦截控制器方法的执行。

拦截器的作用：

- 拦截请求，在指定方法调用前后，根据业务需要执行预先设定的代码。

```java
//自定义拦截器
@Component
public class LoginCheckInterceptor implements HandlerInterceptor {
    //目标资源方法执行前执行。 返回true：放行    返回false：不放行
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("preHandle .... ");
        
        return true; //true表示放行
    }

    //目标资源方法执行后执行
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("postHandle ... ");
    }

    //视图渲染完毕后执行，最后执行
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("afterCompletion .... ");
    }
}
```



```java
@Configuration  
public class WebConfig implements WebMvcConfigurer {

    //自定义的拦截器对象
    @Autowired
    private LoginCheckInterceptor loginCheckInterceptor;

    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
       //注册自定义拦截器对象
        registry.addInterceptor(loginCheckInterceptor).addPathPatterns("/**");//设置拦截器拦截的请求路径（ /** 表示拦截所有请求）
    }
}

```

**拦截路径**

`addPathPatterns("要拦截路径")`方法，指定要拦截哪些资源。

`excludePathPatterns("不拦截路径")`方法，指定哪些资源不需要拦截。

```java
@Override
    public void addInterceptors(InterceptorRegistry registry) {
        //注册自定义拦截器对象
        registry.addInterceptor(loginCheckInterceptor)
                .addPathPatterns("/**")//设置拦截器拦截的请求路径（ /** 表示拦截所有请求）
                .excludePathPatterns("/login");//设置不拦截的请求路径
    }
```

![](D:\blog\source\images\SSM\7.png)

过滤器和拦截器之间的区别：

- 接口规范不同：过滤器需要实现Filter接口，而拦截器需要实现HandlerInterceptor接口。
- 拦截范围不同：过滤器Filter会拦截所有的资源，而Interceptor只会拦截Spring环境中的资源。

## Filter & Interceptor & AOP

```css
浏览器请求
    ↓
[Filter] （过滤器）      ← Servlet 层，最外层，最先执行
    ↓
[DispatcherServlet]
    ↓
[Interceptor.preHandle()] （拦截器前置）
    ↓
[Controller] （真正的业务逻辑）
    ↓
[Interceptor.postHandle()] （拦截器后置）
    ↓
[Interceptor.afterCompletion()] （请求完成后）
    ↓
Filter 返回响应

```

| 对比项               | Filter              | Interceptor                | AOP                        |
| -------------------- | ------------------- | -------------------------- | -------------------------- |
| 运行层级             | Servlet 最外层      | Spring MVC 层              | Spring 方法层              |
| 能拦截？             | 所有 HTTP 请求      | Controller 请求            | 任何 Spring Bean 方法      |
| 是否与 HTTP 强绑定   | ✔ 强关联            | ✔ 关联                     | ❌ 无关联                   |
| 能否拦截内部方法调用 | ❌                   | ❌                          | ✔ 有能力                   |
| 通常使用场景         | CORS、XSS、登录过滤 | 权限、登录校验、API 级拦截 | 日志、事务、性能、审计     |
| 是否知道被调用的方法 | ❌                   | ✔（Controller 方法）       | ✔（所有 Spring Bean 方法） |
| 是否需要 Spring      | ❌（Servlet 规范）   | ✔                          | ✔                          |
| 是否能拦截静态资源   | ✔                   | ❌                          | ❌                          |



# 异常处理

当我们没有做任何的异常处理时，我们三层架构处理异常的方案：

- Mapper接口在操作数据库的时候出错了，此时异常会往上抛(谁调用Mapper就抛给谁)，会抛给service。 
- service 中也存在异常了，会抛给controller。
- 而在controller当中，我们也没有做任何的异常处理，所以最终异常会再往上抛。最终抛给框架之后，框架就会返回一个JSON格式的数据，里面封装的就是错误的信息，但是框架返回的JSON格式的数据并不符合我们的开发规范。

## 全局异常处理器



- 在类上加上一个注解@RestControllerAdvice，加上这个注解就代表我们定义了一个全局异常处理器。
- 定义一个方法来捕获异常，加上注解@ExceptionHandler。通过@ExceptionHandler注解当中的value属性来指定我们要捕获的是哪一类型的异常。

~~~java
@RestControllerAdvice
public class GlobalExceptionHandler {

    //处理异常
    @ExceptionHandler(Exception.class) //指定能够处理的异常类型
    public Result ex(Exception e){
        e.printStackTrace();//打印堆栈中的异常信息

        //捕获到异常之后，响应一个标准的Result
        return Result.error("对不起,操作失败,请联系管理员");
    }
}
~~~

用例：防止重复用户名

```java
@ExceptionHandler
    public Result exceptionHandler(SQLIntegrityConstraintViolationException ex){
//        java.sql.SQLIntegrityConstraintViolationException: Duplicate entry 'zhangsan' for key 'employee.idx_username'
        String message = ex.getMessage();
        if(message.contains("Duplicate entry")){
            String[] split = message.split(" ");
            String username = split[2];
            String msg = username + MessageConstant.ALREADY_EXISTS;
            return Result.error(msg);
        }else{
            return Result.error(MessageConstant.UNKNOWN_ERROR);
        }
    }
```

> @RestControllerAdvice = @ControllerAdvice + @ResponseBody
>
> 处理异常的方法返回值会转换为json后再响应给前端



# 事务管理

在方法运行之前，开启事务，如果方法成功执行，就提交事务，如果方法执行的过程当中出现异常了，就回滚事务。

## Transactional注解

作用：开启事务，方法执行完毕之后提交事务。如果在这个方法执行的过程当中出现了异常，就会进行事务的回滚操作。

@Transactional注解书写位置：

- 方法 -> 当前方法交给spring进行事务管理
- 类 -> 当前类中所有的方法都交由spring进行事务管理
- 接口 -> 接口下所有的实现类当中所有的方法都交给spring 进行事务管理

> 般会在业务层当中来控制事务，因为在业务层当中，一个业务功能可能会包含多个数据访问的操作。在业务层来控制事务，我们就可以将多个数据访问操作控制在一个事务范围内。

## rollbackFor 

默认情况下，只有出现RuntimeException(运行时异常)才会回滚事务。

假如我们想让所有的异常都回滚，需要来配置@Transactional注解当中的rollbackFor属性，通过rollbackFor这个属性可以指定出现何种异常类型回滚事务。

```java
@Transactional(rollbackFor=Exception.class)
```

## propagation

事务的传播行为:

- 当一个事务方法被另一个事务方法调用时，这个事务方法应该如何进行事务控制。

常见的事务传播行为:

| **属性值**       | **含义**                                                           |
| ---------------- | ------------------------------------------------------------------ |
| **REQUIRED**     | 【默认值】需要事务，有则加入，无则创建新事务                       |
| **REQUIRES_NEW** | 需要新事务，无论有无，总是创建新事务                               |
| SUPPORTS         | 支持事务，有则加入，无则在无事务状态中运行                         |
| NOT_SUPPORTED    | 不支持事务，在无事务状态下运行,如果当前存在已有事务,则挂起当前事务 |
| MANDATORY        | 必须有事务，否则抛异常                                             |
| NEVER            | 必须没事务，否则抛异常                                             |
| …                |                                                                    |



#  AOP

`Aspect Oriented Programming`（面向切面编程、面向方面编程）

AOP的作用：在程序运行期间在不修改源代码的基础上对已有方法进行增强（无侵入性: 解耦）

[动态代理技术](https://blog.csdn.net/qq_16570607/article/details/118360338)

> AOP的优势：
>
> 1. 减少重复代码
> 2. 提高开发效率
> 3. 维护方便
>
> 常见的应用场景如下：
>
> - 记录系统的操作日志
> - 权限控制
> - 事务管理：我们前面所讲解的Spring事务管理，底层其实也是通过AOP来实现的，只要添加@Transactional注解之后，AOP程序自动会在原始方法运行前先来开启事务，在原始方法运行完毕之后提交或回滚事务

AOP依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```
AOP示例

```java
@Component
@Aspect //当前类为切面类
@Slf4j
public class TimeAspect {

    @Around("execution(* com.example.demo.service.*.*(..))") 
    public Object recordTime(ProceedingJoinPoint pjp) throws Throwable {
        //记录方法执行开始时间
        long begin = System.currentTimeMillis();

        //执行原始方法
        Object result = pjp.proceed();

        //记录方法执行结束时间
        long end = System.currentTimeMillis();

        //计算方法执行耗时
        log.info(pjp.getSignature()+"执行耗时: {}毫秒",end-begin);

        return result;
    }
}
```

AOP核心概念

| 概念               | 含义                 |
| ------------------ | -------------------- |
| Advice（通知）     | 你想添加的“共性逻辑” |
| PointCut（切入点） | 通知应用到哪些方法   |
| Aspect（切面）     | 通知 + 切入点        |
| Target（目标对象） | 被增强的原始对象方法 |

​                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         

```
                 Advice（通知）
                        ↑
        ┌──────── Aspect（切面类） ────────┐
        │  @Before @After @Around ...    │
        │  +                              │
        │  PointCut（切入点表达式）        │
        └────────────────────────────────┘
                     │作用于
                     ↓
              PointCut（挑选到的方法）
                     │来自
                     ↓
              JoinPoint（全部可能方法）
                     │增强
                     ↓
            Target ----> Proxy（最终执行器）
```



##  Advice

—— 使用通知注解

指哪些重复的逻辑，也就是共性功能（最终体现为一个方法）



| 注解            | 执行时机                     |
| --------------- | ---------------------------- |
| @Around         | 环绕（方法之前 + 方法之后）  |
| @Before         | 方法之前                     |
| @After          | 方法之后（不论是否异常）     |
| @AfterReturning | 方法返回之后（没异常才执行） |
| @AfterThrowing  | 方法抛异常后                 |

> 注意：**只有 @Around 需要调用 pjp.proceed() 来执行原始方法**。

------

## 





## PointCut

—— 决定“增强哪些方法”

匹配连接点的条件，通知仅会在切入点方法执行时被应用

在aop的开发当中，我们通常会通过一个**切入点表达式**来描述切入点

如`execution(* com.example.demo.service.*.*(..))`

### execution 切入表达式

语法为：

~~~
execution(访问修饰符?  返回值  包名.类名.?方法名(方法参数) throws 异常?)
~~~

`?`:可以省略的部分

事例：

~~~java
@Before("execution(void com.example.demo.impl.DeptServiceImpl.delete(java.lang.Integer))")
~~~

可以使用通配符描述切入点

- `*` ：单个独立的任意符号，可以通配任意返回值、包名、类名、方法名、任意类型的一个参数，也可以通配包、类、方法名的一部分

- `..` ：多个连续的任意符号，可以通配任意层级的包，或任意类型、任意个数的参数

使用`..`省略包名, 使用`*`代替类名

~~~java
execution(* com..*.delete(java.lang.Integer))   
~~~

根据业务需要，可以使用 且（&&）、或（||）、非（!） 来组合比较复杂的切入点表达式。

```java
execution(* com.example.demo.service.DeptService.list(..)) || execution(* com.example.demo.service.DeptService.delete(..))
```

```java
//匹配DeptServiceImpl类中以find开头的方法
execution(* com.itheima.service.impl.DeptServiceImpl.find*(..))
```

在满足业务需要的前提下，尽量缩小切入点的匹配范围。如：包名匹配尽量不使用 ..，使用 * 匹配单个包



**用 @Pointcut 抽取公共切入点表达式事例**

```java
@Aspect
@Component
@Slf4j
public class TimeAspect {

    @Pointcut("execution(* com.example.demo.service.*.*(..))")
    private void pt(){}

    @Around("pt()")
    public Object recordTime(ProceedingJoinPoint pjp) throws Throwable {
        long begin = System.currentTimeMillis();
        Object result = pjp.proceed();
        long end = System.currentTimeMillis();
        log.info("耗时: {} ms", end - begin);
        return result;
    }
}
```

##  













### @annotation 切入点（基于注解匹配）

实现步骤：

1. 编写自定义注解

2. 在业务类要做为连接点的方法上添加自定义注解



🔻 自定义注解

```
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AutoFill {
    OperationType value(); // INSERT or UPDATE
}
```

🔻 在目标方法上使用

```
@Override
@AutoFill(OperationType.UPDATE)
public void updateUser(User user) { ... }
```

🔻 切面类增强所有带 @AutoFill 的方法

```
@Aspect
@Component
@Slf4j
public class AutoFillAspect {

    @Pointcut("@annotation(com.example.demo.annotation.AutoFill)")
    public void autoFillPointCut(){}

    @Before("autoFillPointCut()")
    public void autoFill(JoinPoint joinPoint) {
        log.info("执行自动填充");
    }
}
```



------


- execution切入点表达式

  根据我们所指定的方法的描述信息来匹配切入点方法，这种方式也是最为常用的一种方式

  如果我们要匹配的切入点方法的方法名不规则，或者有一些比较特殊的需求，通过execution切入点表达式描述比较繁琐
- annotation 切入点表达式

  基于注解的方式来匹配切入点方法。这种方式虽然多一步操作，我们需要自定义一个注解，但是相对来比较灵活。我们需要匹配哪个方法，就在方法上加上对应的注解就可以了

## Aspect

当通知和切入点结合在一起，就形成了一个切面

切面所在的类，我们一般称为**切面类**（被@Aspect注解标识的类）



## JoinPoint

连接点指的是可以被aop控制的方法。

在Spring中用JoinPoint抽象了连接点，用它可以获得方法执行时的相关信息，如目标类名、方法名、方法参数等。

| 通知类型 | 连接点参数类型      |
| -------- | ------------------- |
| @Around  | ProceedingJoinPoint |
| 其他通知 | JoinPoint           |


```java
//环绕通知
    @Around("pt()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        //获取目标类名
        String name = pjp.getTarget().getClass().getName();
        log.info("目标类名：{}",name);

        //目标方法名
        String methodName = pjp.getSignature().getName();
        log.info("目标方法名：{}",methodName);

        //获取方法执行时需要的参数
        Object[] args = pjp.getArgs();
        log.info("目标方法参数：{}", Arrays.toString(args));

        //执行原始方法
        Object returnValue = pjp.proceed();

        return returnValue;
    }
```





## Target

目标对象指的就是通知所应用的对象，我们就称之为目标对象。

如com.example.demo.service中的所有方法



Spring的AOP底层是基于动态代理技术来实现的，也就是说在程序运行的时候，会自动的基于动态代理技术为目标对象生成一个对应的代理对象。在代理对象当中就会对目标对象当中的原始方法进行功能的增强。



### 通知类型

Spring中AOP的通知类型：

| **注解**        | **效果**                                                                 |
| --------------- | ------------------------------------------------------------------------ |
| @Around         | 环绕通知，此注解标注的通知方法在目标方法前、后都被执行                   |
| @Before         | 前置通知，此注解标注的通知方法在目标方法前被执行                         |
| @After          | 后置通知，此注解标注的通知方法在目标方法后被执行，无论是否有异常都会执行 |
| @AfterReturning | 返回后通知，此注解标注的通知方法在目标方法后被执行，有异常不会执行       |
| @AfterThrowing  | 异常后通知，此注解标注的通知方法发生异常后执行                           |

执行顺序: around before -> before -> afterReturning /afterthrowing(若有异常)-> after -> around after

在不同切面类中，默认按照切面类的类名字母排序：

- 方法前：字母排名靠前的先执行
- 方法后：字母排名靠前的后执行

※@Around环绕通知需要自己调用 ProceedingJoinPoint.proceed() 来让原始方法执行，其他通知不需要考虑目标方法执行

### @PointCut

Spring提供了@PointCut注解，该注解的作用是将公共的切入点表达式抽取出来，需要用到时引用该切入点表达式即可。

```java
@Slf4j
@Component
@Aspect
public class MyAspect1 {

    //切入点方法（公共的切入点表达式）
    @Pointcut("execution(* com.example.demo.service.*.*(..))")
    private void pt(){

    }

    //前置通知（引用切入点）
    @Before("pt()")
    public void before(JoinPoint joinPoint){
        log.info("before ...");

    }
}
```

※当外部其他切面类中也要引用当前类中的切入点表达式，就需要把private改为public



## @Order

使用@Order注解，控制通知的执行顺序：

```java
@Slf4j
@Component
@Aspect
@Order(2)  //切面类的执行顺序（前置通知：数字越小先执行; 后置通知：数字越小越后执行）
public class MyAspect2 {
    // 通知...
}

@Slf4j
@Component
@Aspect
@Order(3)  //切面类的执行顺序（前置通知：数字越小先执行; 后置通知：数字越小越后执行）
public class MyAspect3 {
    //通知...
}



```

- **前置通知：Order 数字小 → 先执行**
- **后置通知：Order 数字小 → 最后执行**



# 消息转换器

在 WebMvcConfiguration 中扩展Spring MVC的消息转换器，统一对日期类型进行格式化处理

```java

     /**
     * 拓展mvc框架消息转换器
     * @param converters
     */
    @Override
    protected void extendMessageConverters(List<HttpMessageConverter<?>> converters) {

        log.info("扩展消息转换器");
		//创建一个消息转化器对象
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
		//设置对象转换器，可以将Java对象转为json字符串
        converter.setObjectMapper(new JacksonObjectMapper());
		//将我们自己的转换器放入spring MVC框架的容器中
        converters.add(0,converter);


    }

```


# HttpClient

HttpClient是Apache的一个子项目，是高效的、功能丰富的支持HTTP协议的**客户端编程**工具包。

它允许 Java 程序去调用外部接口，例如：

- 访问第三方服务（例如支付宝、微信、短信平台）
- 调用别的项目 / 微服务
- 获取外部数据

```xml
<dependency>
    <groupId>org.apache.httpcomponents</groupId
        <artifactId>httpclient</artifactId
        <version>4.5.13</version>
</dependency>

```

阿里云oss的依赖里已经有这个工具包

核心API：

- HttpClient
- HttpClients
- CloseableHttpClient
- HttpGet
- HttpPost

发送请求步骤：

- 创建HttpClient对象
- 创建Http请求对象
- 调用HttpClient的execute方法发送请求



```java
/**
     * 用过httpclient发起get请求
     * @throws IOException
     */
    @Test
    public void getTest() throws IOException {
        //创建httpclient对象
        CloseableHttpClient httpClient = HttpClients.createDefault();
        //创建请求对象
        HttpGet httpGet = new HttpGet("http://localhost:8080/user/shop/status");
        //发送请求等待响应结果
        CloseableHttpResponse response = httpClient.execute(httpGet);
        //获取响应码
        int status = response.getStatusLine().getStatusCode();
        System.out.println("服务端响应的状态码是" + status);
        //获取响应数据
        HttpEntity entity = response.getEntity();
        String body = EntityUtils.toString(entity);
        System.out.println("服务端返回的数据是"+body);

        response.close();
        httpClient.close();
    }
```

```java
/**
     * 用过httpclient发起post请求
     * @throws IOException
     */
    @Test
    public void postTest() throws IOException, JSONException {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://localhost:8080/admin/employee/login");
        //fast json
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("username","admin");
        jsonObject.put("password","123456");

        StringEntity entity = new StringEntity(jsonObject.toString());
        //请求指定的编码方式
        entity.setContentEncoding("UTF-8");
        //数据格式
        entity.setContentType("application/json");
        httpPost.setEntity(entity);
        //发送请求
        CloseableHttpResponse response = httpClient.execute(httpPost);
        //解析响应结果
        int status = response.getStatusLine().getStatusCode();
        System.out.println("响应码为"+status);

        HttpEntity entity1 = response.getEntity();
        String body = EntityUtils.toString(entity1);
        System.out.println(body);

        response.close();
        httpClient.close();
    }
```



# Spring Cache

Spring Cache 是一个框架，实现了基于注解的缓存功能，只需要简单地加一个注解，就能实现缓存功能。



Spring Cache 提供了一层抽象，底层可以切换不同的缓存实现，例如：

- EHCache
- Caffeine
- Redis

```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-cache</artifactId>
   <version>2.7.3</version>
 </dependency>
```

| **注解**       | **说明**                                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| @EnableCaching | 开启缓存注解功能，通常加在启动类上                                                                                     |
| @Cacheable     | 在方法执行前先查询缓存中是否有数据，如果有数据，则直接返回缓存数据；如果没有缓存数据，调用方法并将方法返回值放到缓存中 |
| @CachePut      | 将方法的返回值放到缓存中                                                                                               |
| @CacheEvict    | 将一条或多条数据从缓存中删除                                                                                           |



具体的实现思路如下：

- 导入Spring Cache和Redis相关maven坐标

- 在启动类上加入@EnableCaching注解，开启缓存注解功能

- 在用户端接口SetmealController的 list 方法上加入@Cacheable注解

- 在管理端接口SetmealController的 save、delete、update、startOrStop等方法上加入CacheEvict注解



底层原理说是代理原理



操作很简单！



# Spring Task

Spring Task 是Spring框架提供的任务调度工具，可以按照约定的时间自动执行某个代码逻辑

## cron表达式

cron表达式其实就是一个字符串，通过cron表达式可以**定义任务触发的时间**

构成规则：分为6或7个域，由空格分隔开，每个域代表一个含义

每个域的含义分别为：秒、分钟、小时、日、月、周、年(可选)

## 入门案例

Spring Task使用步骤：

①导入maven坐标 spring-context（已存在）

②启动类添加注解 @EnableScheduling 开启任务调度

③自定义定时任务类

使用案例：

```java
	/**
     ** 支付超时订单处理
     ** 对于下单后超过15分钟仍未支付的订单自动修改状态为[已取消]
     */
    @Scheduled(cron = "0 * * * * ?")
    public void processTimeoutOrder(){
        log.info("处理支付超时订单：{}", new Date());

        LocalDateTime time = LocalDateTime.now().plusMinutes(-15);
        List<Orders> ordersList = orderMapper.getByStatusAndOrdertimeLT(Orders.PENDING_PAYMENT, time);


        if(ordersList != null && ordersList.size() > 0){
            ordersList.forEach(order -> {
                order.setStatus(Orders.CANCELLED);
                order.setCancelReason("支付超时，自动取消");
                order.setCancelTime(LocalDateTime.now());
                orderMapper.update(order);
            });
        }
    }
```



# Web Socket

WebSocket 是基于 TCP 的一种新的网络协议。它实现了浏览器与服务器全双工通信——浏览器和服务器只需要完成一次握手，两者之间就可以创建持久性的连接， 并进行双向数据传输。

HTTP协议和WebSocket协议对比：

- HTTP是短连接

- WebSocket是长连接
- HTTP通信是单向的，基于请求响应模式
- WebSocket支持双向通信
- HTTP和WebSocket底层都是TCP连接

应用场景：

- 视频弹幕
- 网页聊天
- 体育实况更新
- 股票基金报价实时更新

## 实现步骤：

1. 直接使用websocket.html页面作为WebSocket客户端
2. 导入WebSocket的maven坐标
3. 导入WebSocket服务端组件WebSocketServer，用于和客户端通信
4. 导入配置类WebSocketConfiguration，注册WebSocket的服务端组件
5. 导入定时任务类WebSocketTask，定时向客户端推送数据



通过nginx配置可以吧websocket连接转发到后端



# 其他组件

## Apache ECharts

Apache ECharts 是一款基于 Javascript 的数据可视化图表库，提供直观，生动，可交互，可个性化定制的数据可视化图表。

官网地址：https://echarts.apache.org/zh/index.html

List转string

```
StringUtils.join(dateList,",")
```

动态sql传入的数如果是集合最好是map吗？

```
orderCountList.stream().reduce(Integer::sum).get();
```



##  Apache POI

Apache POI 是一个处理Miscrosoft Office各种文件格式的开源项目。简单来说就是，我们可以使用 POI 在 Java 程序中对Miscrosoft Office各种文件进行读写操作。

一般情况下，POI 都是用于操作 Excel 文件。



依赖

```xml
<dependency>
   <groupId>org.apache.poi</groupId>
   <artifactId>poi-ooxml</artifactId>
   <version>3.16</version>
 </dependency>
```



案例

```java
//在内存中创建一个Excel文件对象
        XSSFWorkbook excel = new XSSFWorkbook();

        //创建Sheet页
        XSSFSheet sheet = excel.createSheet("itcast");

        //在Sheet页中创建行，0表示第1行
        XSSFRow row1 = sheet.createRow(0);
        //创建单元格并在单元格中设置值，单元格编号也是从0开始，1表示第2个单元格
        row1.createCell(1).setCellValue("姓名");
        row1.createCell(2).setCellValue("城市");

        XSSFRow row2 = sheet.createRow(1);
        row2.createCell(1).setCellValue("张三");
        row2.createCell(2).setCellValue("北京");

        XSSFRow row3 = sheet.createRow(2);
        row3.createCell(1).setCellValue("李四");
        row3.createCell(2).setCellValue("上海");

        FileOutputStream out = new FileOutputStream(new File("D:\\itcast.xlsx"));
        //通过输出流将内存中的Excel文件写入到磁盘上
        excel.write(out);

        //关闭资源
        out.flush();
        out.close();
        excel.close();
```

```
//通过输出流将文件下载到客户端浏览器中

ServletOutputStream out = response.getOutputStream();
excel.write(out);
```

## 内网穿透

局域网获得一个公网ip

cpolar

# 有感

2025/12/11

前端是选择tag的时候好像不用传id对应的name，不过要学前端才知道，蒽！

controller只是针对路径来说的，service可以对应好几个mapper

因此controller是每个路径请求都有一个，但是mapper要尽量做得有泛用性



自己做的时候%90的错误都是sql错误，苦学sql！
