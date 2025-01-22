# 模块文档：`fate3ai::raffle`

## 模块简介
`fate3ai::raffle` 模块提供了抽奖系统的核心功能，包括抽奖创建、参数设置、执行抽奖以及奖品分发。

---

## 数据结构

### `RaffleInfo`

抽奖信息的核心结构体，包含了抽奖的基本信息。

结构定义：

```
public struct RaffleInfo has key {
    id: UID,
    name: String, // 抽奖的名称
    description: String, // 抽奖的描述
    ticket_cost: u64, // 每张抽奖票的成本
    prize: PrizeValidity, // 奖品的有效期信息
    prize_prob: PrizeProb, // 奖品的中奖概率信息
    refund_rate: u64 // 未中奖的退款比例
}
```



---

### `PrizeValidity`

描述不同奖品的有效期。

结构定义：

```
public struct PrizeValidity has key, store {
    id: UID,
    grand_prize_duration: u64, // 大奖有效期（天）
    second_prize_duration: u64, // 二等奖有效期（天）
    third_prize_duration: u64 // 三等奖有效期（天）
}
```



---

### `PrizeProb`

描述不同奖品的中奖概率。

结构定义：

```
public struct PrizeProb has key, store {
    id: UID,
    grand_prize_weight: u64, // 大奖权重
    second_prize_weight: u64, // 二等奖权重
    third_prize_weight: u64 // 三等奖权重
}
```



---

### `RaffleNFT`

用于存储抽奖生成的奖励信息。

结构定义：

```
public struct RaffleNFT has key, store {
    id: UID,
    activetime: u64, // 奖励的有效期（天）
    factor: u64 // 奖励的倍数因子
}
```



---

## 函数

### `create_raffle`

创建抽奖。

函数定义：

```
public fun create_raffle(
    _: &AdminCap,
    name: String,
    description: String,
    ticket_cost: u64,
    refund_rate: u64,
    grand_prize_duration: u64,
    second_prize_duration: u64,
    third_prize_duration: u64,
    grand_prize_weight: u64,
    second_prize_weight: u64,
    third_prize_weight: u64,
    ctx: &mut TxContext
)
```

**参数说明：**
- `_`: 管理员权限对象
- `name`: 抽奖名称
- `description`: 抽奖描述
- `ticket_cost`: 每张抽奖票的成本
- `refund_rate`: 未中奖的退款比例
- `grand_prize_duration`: 大奖有效期
- `second_prize_duration`: 二等奖有效期
- `third_prize_duration`: 三等奖有效期
- `grand_prize_weight`: 大奖中奖权重
- `second_prize_weight`: 二等奖中奖权重
- `third_prize_weight`: 三等奖中奖权重
- `ctx`: 交易上下文

---

### `set_raffle`

修改现有的抽奖信息。

函数定义：

```
public fun set_raffle(
    _: &AdminCap,
    name: String,
    description: String,
    ticket_cost: u64,
    refund_rate: u64,
    grand_prize_duration: u64,
    second_prize_duration: u64,
    third_prize_duration: u64,
    grand_prize_weight: u64,
    second_prize_weight: u64,
    third_prize_weight: u64,
    raffle_info: &mut RaffleInfo,
    _: &mut TxContext
)
```

**参数说明：**
- `_`: 管理员权限对象
- `name`: 新的抽奖名称
- `description`: 新的抽奖描述
- `ticket_cost`: 新的每张抽奖票成本
- `refund_rate`: 新的未中奖退款比例
- `grand_prize_duration`: 新的大奖有效期
- `second_prize_duration`: 新的二等奖有效期
- `third_prize_duration`: 新的三等奖有效期
- `grand_prize_weight`: 新的大奖权重
- `second_prize_weight`: 新的二等奖权重
- `third_prize_weight`: 新的三等奖权重
- `raffle_info`: 被修改的抽奖信息
- `ctx`: 交易上下文

---

### `lottery`

执行抽奖逻辑并分发奖励。

函数定义：

```
public fun lottery(
    time: &Clock,
    taro: vector<u64>,
    raffleinfo: &RaffleInfo,
    token_cap: &mut AppTokenCap,
    ctx: &mut TxContext
)
```

**参数说明：**
- `time`: 当前时间对象
- `taro`: 用户的塔罗牌信息，用作种子
- `raffleinfo`: 抽奖信息
- `token_cap`: 管理奖励的代币权限
- `ctx`: 交易上下文

---

### `get_activetime`

获取奖励的有效期和倍数因子。

函数定义：

```
public fun get_activetime(
    rafflenft: &RaffleNFT
): (u64, u64)
```

**参数说明：**
- `rafflenft`: 奖励信息对象

**返回值：**
- 奖励的有效期和倍数因子

---

### `sum`

计算输入向量的总和。

函数定义：

```
public fun sum(v: &vector<u64>): u64
```

**参数说明：**
- `v`: 输入的向量

**返回值：**
- 向量的总和
