# Fate3AI Taro Module 功能文档

## 模块概述
`fate3ai::taro` 模块定义了塔罗信息（Taroinfo）的增删改查功能，通过使用 `Table` 来存储和管理塔罗信息。用户可以动态添加、删除塔罗记录，并检索相应的数据。

---

## 数据结构定义

### **1. Taroinfo**
塔罗信息的核心结构，存储了塔罗卡片的组合和描述信息。

```
public struct Taroinfo has copy, store, drop {
    taro: vector<u64>,  // 塔罗卡片的数字组合
    desc: String,       // 塔罗卡片的描述
}
```



---

## 函数功能说明

### **1. add_taro_info**
**功能：**  
向塔罗信息表中添加新的塔罗记录。

#### 参数：
- **`table: &mut Table<u64, Taroinfo>`**  
  塔罗信息的存储表。
- **`taro: vector<u64>`**  
  塔罗卡片的数字组合。
- **`desc: String`**  
  塔罗卡片的描述。
- **`ctx: &mut TxContext`**  
  交易上下文。

#### 实现代码：
```
public fun add_taro_info(
    table: &mut Table<u64, Taroinfo>,
    taro: vector<u64>,
    desc: String,
    _: &mut TxContext
) {
    let taro_info = Taroinfo { taro, desc };
    let length = table.length() + 1;
    table::add(table, length, taro_info);
}
```



---

### **2. del_taro_info**
**功能：**  
从塔罗信息表中删除指定的塔罗记录。

#### 参数：
- **`table: &mut Table<u64, Taroinfo>`**  
  塔罗信息的存储表。
- **`k: u64`**  
  要删除的塔罗记录的键值。
- **`ctx: &mut TxContext`**  
  交易上下文。

#### 实现代码：
```
public fun del_taro_info(
    table: &mut Table<u64, Taroinfo>,
    k: u64,
    _: &mut TxContext
) {
    table::remove(table, k);
}
```



---

### **3. get_taro_info**
**功能：**  
从塔罗信息表中获取指定塔罗记录的塔罗卡片组合。

#### 参数：
- **`table: &mut Table<u64, Taroinfo>`**  
  塔罗信息的存储表。
- **`k: u64`**  
  要查询的塔罗记录的键值。
- **`ctx: &mut TxContext`**  
  交易上下文。

#### 返回值：
- **`vector<u64>`**  
  返回指定记录的塔罗卡片组合。

#### 实现代码：
```
public fun get_taro_info(
    table: &mut Table<u64, Taroinfo>,
    k: u64,
    _: &mut TxContext
): vector<u64> {
    let taroinfo = table::borrow(table, k);
    taroinfo.taro
}
```

