---
title: C#
tags: learn
abbrlink: 59760
date: 2024-10-25 13:57:01
---

感觉和java区别没有很大

[C#语法随记——Event?.Invoke()](https://www.cnblogs.com/BreezeJDK/p/16739052.html)

# 控制台输入输出
`Console.WriteLine("");`
`Console.Write("");`
`Console.ReadLine();`直到回车
`Console.ReadKey();`吃一个按键的内容

---

# 常量和变量
关键字`const`
## 值和引用类型
### 引用类型
string，数组，类
### 值类型
其他，结构体

---

# 转义字符
`string str="ww\'"`
`\`
`\a`警报音 <-这个好玩

---

# 类型转换
## 括号
`(int)str`
## Parse
只能转字符串
`int.Parse("123")`
## Convert
`Convert.To目标类型(变量/常量)`
## 转String
`.toString();`

---

# 异常捕获
```csharp
try{
    ..
}catch(Exception e){
    ..
}finally{
    ..
}
```

---

# 枚举
```csharp
enum E_MonsterType{
    Normal,//0
    Boss,//1
}
```

---

# 数组
可以说和java一模一样
## 二维数组
`int[,] arr = new int[3,3]`
## 交错数组
`int[][] arr = new int[3][]{new int[]{1,2,3,4,5},new int[]{1},new int[]{2,2}}` 


---

# 函数
## ref和out
```csharp
void ChangValueRef(ref int value){
    value = 3;
}
```
```csharp
void ChangValueRef(out int value){
    value = 3;
}
```
函数参数的修饰符
当传入的值类型蚕食在内部修改时 或者引用类型参数在内部重新声明时
外部的值会发生变化
1. ref传入的变量必须初始化 out不用
2. out传入的变量必须在内部赋值 ref不用
## 变长参数
变长参数关键字`params`
```csharp
//static int sum(int a, int b,int c....)
static int sum(string name,params int[] arr){
    int sum=0;
    for(int i=0;i<arr.Length;i++){
        sum+=arr[i];
    }
    return sum;
}
static void Main(string[] args){
    Sum("lala",1,2,3,4,5,6,6,7,6);
}
```
1. params 关键字后必须是数组
2. 数组的类型可以是任意的类型
3. 函数参数中只能最多出现一个params关键字 并且一定是在最后一组参数，前面可以有n个其他参数
## 参数默认值
```csharp
void speak(string str = "你是弱智！"){
    Console.WriteLine(str);
}
```
**可选参数必须在普通参数后面**
## 函数重载
在同一语句块(class or struct)中
函数（方法）名相同，参数的数量/类型不同
作用:
1. 减少函数名的数量，避免命名空间的污染
2. 提升程序可读性

加ref/out修饰词算改变参数类型（不过不是可行的
加默认值不算改变参数

---

# 结构体
在结构体中可以构造方法
在方法中可以直接使用结构体内部的变量
## 访问修饰符
private public
**默认不写为private**
```csharp
struct student{
    int age;
    string name;
    public void speak(){
        Console.WriteLine(name,age);
    }
}
class Program
{
    static void Main(string[] args)
    {
        student s = new student();
        //不用struct student哦o.O
    }
}
```
## 结构体的构造函数
如果声明了构造函数 那么必须在其中对所有变量数据初始化
**结构体不允许无参构造函数**
```csharp
 struct Student
 {
     public int id;
     public string name;
     public int age;
     public Student(int id, string name)
     {

         this.id = id;
         this.name = name;

     }
 }
```
可以这样↓
```csharp
struct Student(int id, string name)
{
    public int id = id;
    public string name = name;
    public int age;
}
```
```csharp
Student student = new Student(11,"小明");
```
可以这样↓
```csharp
Student student = new(11,"小明");
```
感觉就像不能加修饰符，不能继承的class，c里struct的plus版（...

---

# 类-封装
在struct里不能声明同名struct
但是在class里可以有一个同名class
(java的class里也可以，好像可以通过这个手动构造链表，不过java有linkedlist了没必要)
**如果要在类中声明一个和自己相同类型的成员变量时，不能对他进行实例化**
## 成员变量
默认值：
数字类->0,bool->false
引用类型->null

public private protected

`default(变量类型)`查看默认值

## 构造函数
如果不自己实现无参构造函数而实现了有参构造函数
会失去默认的无参构造(java里也是！)
没有特殊需求(单例模式)时，一般是public的
```csharp
public Person(){

}
public Person(int age,string name):this(){
    //首先调用无参构造器
    //节约代码量
}
```

## 析构函数
*当引用类型的堆内存**被回收时**，会调用该函数*
对于需要手动管理内存的语言（比如c++），需要在析构函数中做一些内存回收处理
但是在c#中存在自动的垃圾回收机制，所以几乎不怎么使用析构函数
除非你想在某一个对象被垃圾回收时，做一些特殊处理
注意：
在unity开发中构析函数几乎不会使用
```csharp
~Person(){

}
```

## 成员属性
访问修饰符 属性类型 属性名{
    get{}
    set{}
}
```csharp
class Person{
    public string Name{
        get{
            //在返回之前添加一些逻辑规则
            //意味着这个属性可以获取的内容
            return name;
        }
        set{
            //在设置之前添加一下逻辑规则
            if(value<0){
                value = 0;
            }
            name = value;
        }
    }
}
```
```csharp
    Person p = new();
    p.Name = "米老鼠";
```
value关键字表示外部传入的值
提供一种设置getname方法以外改变成员变量值的方法
方便使用和修改的同时保持成员的private
可以实现加密
set和get也可以使用修饰符（要低于属性的访问权限） 不能让get和set的访问权限都低于属性的权限
set和get可以只有一个（一般是只有get）
### 自动属性
```csharp
public float Height{
    set;
    get;
    //在setget中没有特殊处理,节约代码量
}
```

## 索引器
让对象可以像数组一样通过索引器访问其中元素，让程序看起来更直观，更容易编写
以中括号的形式访问自定义类中的元素，规则自己定
比较适用于在类中有数组时实用
索引器可以重载
```csharp
class Person{
    private Person[] friends;
    public Person this[int index]{
        get{
            return friends[index];
        }
        set{
            friends[index] = value;
        }
    }

}
```
```csharp
Person p = new();
p[0] = new Person(); 
```
可以通过索引器来达成hashmap/dictionary的效果
```csharp
public string this[string str]{//参数填n个也是没问题的
    get{
        switch(str){
            case "name":
                return this.name;
            case "age":
                return this.age.ToString();
        }
        return "";
    }
    set{

    }
}
```

## 静态
为什么可以直接点出来使用：
类加载时就加载
直到程序结束才会被释放
### 静态成员
静态成员粽不能使用非静态成员
非静态成员可以使用静态成员
过多静态成员会造成频繁gc->程序卡顿
const(常量)可以理解为特殊的static
相同点：都可以通过类名点使用
不同点：
1. const必须初始化，不能被修改
2. const只能修饰变量
3. const一定写在访问修饰符后面

### 静态类
只能包含静态成员
不能被实例化（纯工具） console就是一个静态类
(java中没有静态类，但是有abstract)

### 静态构造函数
不能有访问修饰符 不能有参数 只会自动调用一次 
主要用来初始化静态成员变量
（java里不能）
如果同一个类实例化了两次，静态构造函数会只调用一次（第一次实例化的时候）

## 拓展方法
为现有的非静态变量类型添加新方法 
一定是写在静态类中，一定是个静态函数
第一个参数为拓展目标 第一个参数用this修饰
如果拓展方法和原方法重名了，则使用原方法
作用：
1. 提升程序拓展性
2. 不需要再对象中重写方法，为别人封装的类型写额外的方法
3. 不需要继承来添加方法

```csharp
static class Tools
{
    //为int拓展了一个成员方法
    //value代表使用该方法实例化对象
    public static void SpeakValue(this int value,strring str){
        //拓展方法的使用

    }
}
```
```csharp
int i=10;
i.SpeakValue("这是传进去的参数");//i就是value
```

实际上写一个函数把i传进去也一样吧(....)
只不过是可以写.方法()了

## 运算符重载
算数运算符，逻辑运算符（只有!可以），位运算符，条件运算符都可以被重载
```csharp
class Point{
    public int x;
    public int y;

    public static Point operator +(Point p1,Point p2){
        Point p = new Point();
        p.x = p1.x+p2.x;
        p.y = p1.y+p2.y;
        return p;
    }
}
```
```csharp
Point p = new();
p.x=1;
p.y=2;
Point p2 = new();
p2.x=6;
p2.y=4;

Point p3 = p + p2;
```

## 内部类
使用： class.内部class 变量名

## 分部类
把一个类分成几部分声明
类的访问修饰符要一致
```csharp
class student{
    int eye;
    int leg;
}
class student{
    int head;
    int hand;
}
```
```csharp
student s = new();
```
其实比较鸡肋
## 分部方法
将方法的声明和实现分离

---

# 类-继承 
## 继承
c# 不能多继承
```csharp
class teacher{

}
class teachingteacher : teacher{

}
```
## 里氏替换原则
任何父类出现的地方，子类都可以替代
语法表现：父类容器装子类对象，因为子类对象包含了父类的所有内容（向上造型）

### is&as
is:判断一个对象是否为指定类对象
as:讲一个对象转换为指定对象,失败则返回null
```csharp
if(player is Player){
    Player p = player as Player;
}
```
当用父类容器装载子类对象分不清里面是啥的时候使用
## 继承中的构造器
父类的父类的构造->父类的构造->子类构造
```csharp
class son:father{
    public son(int i):base(i){

    }
}
```
## 万物之父
object

### 拆箱装箱
**用object存值类型（装箱）**
->把值类型用引用类储存，占内存会迁移到堆内存中
**再把object转为值类型（拆箱）**
->把引用用类型存储的值类型取出来，堆内存会迁移到栈内存中
```csharp
object v =3;
int intvalue = (int)v;
```
好处：方便参数的存储传递
坏处：内存迁移，增加性能消耗
可以实现泛型？

## 密封类
用`sealed`修饰的类
让类无法被继承

---

# 类-多态
##  vob
v:virtual(虚函数)
o:override
b:base
```csharp
class game{
    public string name;
    public game(string name){
        this.name=name;
    }
    public virtual void Atk(){

    }//虚函数可以被子类重写
}
class player:game{
    public player(string name):base(name){

    }
    public override void Atk(){
        base.Atk();//可以通过base来保留父类的行为
    } 
}

```

## 抽象类
被abstract修饰的类
不能实例化、继承必须重写抽象方法
抽象方法没有方法体，不能是私有的

## 接口
接口命名规范I名字
规范：
**不包含成员变量**
成员不能实现，即可以写属性，但不能写setget具体方法，留给子类实现
接口不能继承类，但可以继承另一个接口，**继承后实现的方法必须是public的**
接口也符合里氏转换原则
```csharp
interface Ifly{

}
class person:animal,Ifly{

}
```

## 密封方法
`sealed`修饰
不能被重写

---

# 结构体和类的区别
最大区别在存储空间上，结构体是指，类是引用
也如之前的分析，strcut不能继承

对象是数据集合时，优先考虑结构体，比如坐标、位置...
经常被赋值，且改变赋值对象，原对象不想跟着变化时，用结构体

---

# 抽象类和接口的区别
抽象类可以有构造函数
抽象类只能被单一继承
抽象类可以声明成员方法、虚方法、静态方法...
抽象类可以使用访问修饰符
对象->类
行为->接口


---

# 垃圾回收机制
垃圾回收 `GC(Garbage Collactor)`
垃圾回收的过程是在遍历堆(Heap)上动态分配的所有对象
通过识别他们是否被引用来确定那些对象是垃圾，哪些对象仍要被使用
所谓的垃圾就是没有任何变量、对象引用的内容
垃圾就需要回收释放

垃圾回收有多种算法，比如：
引用计数(Reference Counting)
标记清除(Mark Sweep)
标记整理(Maek Compact)
复制集合(Copy Collection)[详见JVM原理！](./JVM.md)

注意：
GC只负责堆内存的垃圾回收
引用类型都是存在堆中的，所以他的分配和释放都通过垃圾回收机制来管理

栈(Stack)上的内存是由系统自动管理的
值类型在栈中分配内存的，让门有自己的声明周期，不用对他们进行管理，会自动的分配和释放

c#中内存回收机制的大概原理
0代内存     1代内存     2代内存
代是垃圾回收机制使用的一种算法(分代算法)
新分配的内存在0代内存中，每次分配都进行垃圾回收以释放内存（0代满时）

在一次内存回收过程开始时，垃圾回收器会认为堆中全是垃圾会进行一下两步
1. 标记对象 从root开始，标记后为可达对象
2. 搬迁对象压缩栈（挂起执行托管线程）释放未标记对象，搬迁可达对象，修改引用地址
大对象被认为是2代内存，不会对大内存进行搬迁压缩
（jvm垃圾回收，新生代，老生代，非常相似）

---

# 命名空间
包裹类
`using`引用命名空间
命名空间可以包裹命名空间

---

# StringBuilder
c#提供的处理字符串的公共类
`.Capacity()`
`.Length()`
`.Append()`
`.Insert()`
`.Remove()`
`.Replace()`
`.Clear()`
感觉是stringbuffer c#版

---

# 简单数据结构类
## Arraylist
## Stack
## Queue
## Hashtable

---

# 泛型
```csharp
class test<T> where T:strcut
{
    public T value;
}
```
## 泛型约束
`where`struct/class/new()/interface

## List
## Dictionary
## Linekerlist

---

# 委托和事件
## 委托 
关键字`delegate`
装载函数的容器
常用在：
1. 作为类的成员
2. 作为函数的参数

```csharp
delegate void MyFun();
```
```csharp
    MyFun f = new Myfun(Fun);
    MyFun f2 = Fun;//和上面其实是一样的
    f.Invoke();
    f2();
void Fun(){
    
}
class Test{
    public MyFun fun;
    public void testfun(MyFun fun){
        //先处理一些别的逻辑 处理完了再执行别的函数
        //延迟执行！
        fun();
        this.fun = fun;
    }
}
//如何用委托存储多个函数
Myfun ff = Fun;
ff += Fun;
//多减不会报错
```
### 系统定义好的委托
需要引用using System;
```csharp
// first type 无参无返回值
Action action = Fun;
action +=Fun;
//就不用自己写啦——
//second type 可以指定返回类型的
Func<string> funcString =fun2;
string fun2(){
    return "";
}
//third type 可以传n个参数的
Action<int,string> action2 = fun6;
```
## 事件
委托怎么用，事件就怎么用
`event`
事件是作为成员变量存在于类中
区别：
1. 事件不能在类外部赋值
2. 不能在类外部调用

```csharp
public event Action myEvent;
public void testFun(){

}
myEvent = testFun;
myEvent += testFun;

```

---

# 匿名函数
```csharp
Action a = delegate(){
    Console.WriteLine("");
};
```
lambad可以理解为简写

---

# 协变和逆变
协变：out
逆变：in
卧槽看晕了

---

# 多线程
Thread t = new Thread();
run逻辑不用实现接口
t.IsBackground = true;

---


# 预处理器指令
`#define`
`#undef`

`#if` `#endif`
```csharp
#if Unity4 //如果有unity这个符号，下面的代码就会被编译
    Console.WriteLine("版本为untity4");
#endif
```
`warning` `error`


---

# 反射
**程序集**:代码集合 `dll` `exe`
**元数据**:程序中的类、类中的函数、变量等等
**反射**:程序正在运行时查看自身的元数据或者其他程序的元数据的行为
人话：通过反射得到各种变量，执行、操作他们
## Type
**类的信息**（反射功能的基础）
访问元数据的主要方式
使用Type的成员获取有关类型声明的信息、有关类型的成员
### 获取type
1. object中的GetType()
2. typeof关键字 传入类名
3. 通过类的名字
（类名必须包含命名空间，不然找不到
### 得到类的程序集信息
.Assembly
### 获取类中的所有公共成员
```csharp
//首先得到type
Type t=typeod(Test);
//然后得到所有公共成员
//需要using.System.Reflection;
Memberinfo[] infos = t.GerMembers();
for(int i=0;i<infos.length;i++){
    console.writeline(infos[i]);
}
```
### 获取类的公共构造函数并调用
```csharp
ConstructorInfo[] ctors = t.GetConstructors();
for(int i =0;i<ctor.Length;i++){
    Console.WriteLine(ctors[i]);
}
ConstructorInfo info =t.GetConstructors(new Type[0]);//无参构造
Test obj = info.Invoke(null) as Test;//默认传出来是objection
ConstructorInfo info =t.GetConstructors(new Type[]{typeof(int)});//有参构造
Test obj = info.Invoke(new object[]{2}) as Test;
```
### 获取类的公共成员变量
```csharp
FireldInfo[] fieldInfos = t.GetFields();
for(int i=0;i<fieldInfos.Length;i++){
    Console.WriteLIne(fieldInfos[i]);
}
FireldInfo infoJ= t.GetFields("j");
//通过反射获取和设置某个对象的值
Test test = new Test();
test.j = 99;
infoJ.GetValue(test);
infoJ.SetValue(test,100);
```
### 获得类的公共成员方法
```csharp
MethodInfo[] methods = t.GetMethods();
for(int i=0;i<methods.Length;i++){
    Console.WriteLine(methods[i]);
}
MethodInfo method= t.GetMethods("substring",
    new Type[]{typeof(int),typeof(int)});
string str = "sb";
object result = method.Invoke(str,new object[]{7,5});

```
## Activator
快速实例化对象的类
```csharp
Type testType = typeof(Test);
Test testObj = Activator.CreateInstance(testType) as Test;//无参

Test testObj = Activator.CreateInstance(testType,99) as Test;//有参
```
## Assembly
程序集类`dll`
```csharp
Assembly asembly = Assembly.LoadFrom(@"url");
Type icon =asembly.GetType("xxxx.Icon");//xxxx文件中的Icon类
//实例化一个icon对象
object iconobj = Activator.CreateInstance(icon,10,5);
```
## 类库工程
什么内裤攻城

---

# 特性
`[特性]`

---

#

# 后话
一天速成！。。。其实反射后面还没学但是我学不动了先歇了
一天写800行笔记我也是神人了
和java还是有一些微妙的差别的
其实感觉c#里重复的东西有点多 比如静态类的存在感觉完全没有必要 abstract也能做到
但是interface和abstract的区别到是比java大 c#里的接口就是纯粹的接口 java里还是能写点东西的
不过我java还有一些东西还没学完....这个速成的倒是很快
