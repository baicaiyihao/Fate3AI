# 模块文档：`fate3ai::fate`

## 模块简介

`fate3ai::fate` 模块提供了 FATE3AI 项目的核心功能，包括代币管理、每日签到奖励、商品购买、代币兑换、价格管理等功能。

---

## 常量

### `DECIMALS`
定义 FATE 代币的小数位数。

### `SYMBOLS`
定义 FATE 代币的符号。

### `NAME`
定义 FATE 代币的名称。

### `DESCRIPTION`
定义 FATE 代币的描述信息。

### `ICON_URL`
定义 FATE 代币的图标 URL。

### `EWrongAmount`
错误码，表示金额错误。

---

## 结构体

### `FATE`
代币标识符。

### `AdminCap`
提供管理员权限。

```
public struct AdminCap has key, store {
    id: UID,
}
```



### `AppTokenCap`
用于管理 FATE 代币的操作权限。

```
public struct AppTokenCap has key {
    id: UID,
    cap: TreasuryCap<FATE>,
}
```



### `Suipool`
管理 SUI 代币的池。

```
public struct Suipool has key{
    id: UID,
    coin: Balance<SUI>,
}
```



### `PriceRecord`
存储 AI 代理的价格信息。

```
public struct PriceRecord has key {
    id: UID,
    prices: Table<String, u64>,
}
```



### `TokenRecord`
存储代币的价格信息。

```
public struct TokenRecord has key {
    id: UID,
    prices: Table<String, u64>,
}
```



### `BuyEvent`
记录购买事件。

```
public struct BuyEvent has copy, drop {
    buyer: address,
    item: String,
    price: u64,
}
```



---

## 函数

### `init`
初始化 FATE 代币系统。

#### 参数：
- `otw`: FATE 代币对象。
- `ctx`: 事务上下文。

```
fun init(otw: FATE, ctx: &mut TxContext) { ... }
```



---

### `signin2earn`
每日签到领取 FATE 代币奖励。

#### 参数：
- `profile`: 用户档案。
- `name`: 用户名。
- `raffle_nft`: 抽奖 NFT。
- `token_cap`: 管理代币的权限。
- `ctx`: 事务上下文。

```
public fun signin2earn(
    profile: &mut Profile,
    name: String,
    raffle_nft: &mut RaffleNFT,
    token_cap: &mut AppTokenCap,
    ctx: &mut TxContext
) { ... }
```



---

### `buyItem`
购买 AI 代理服务。

#### 参数：
- `payment`: 支付的 FATE 代币。
- `price_record`: 价格记录。
- `item`: 商品名称。
- `token_prolicy`: 代币策略。
- `ctx`: 事务上下文。

```
public fun buyItem(
    payment:&mut Token<FATE>,
    price_record: &PriceRecord,
    item: String,
    token_prolicy: &mut TokenPolicy<FATE>,
    ctx: &mut TxContext
) { ... }
```



---

### `mint_token`
铸造 FATE 代币。

#### 参数：
- `token_cap`: 管理代币的权限。
- `amount`: 铸造数量。
- `user`: 接收者地址。
- `ctx`: 事务上下文。

```
public(package) fun mint_token(
    token_cap: &mut AppTokenCap,
    amount: u64,
    user: address,
    ctx: &mut TxContext
) { ... }
```



---

### `swap_token`
进行代币兑换。

#### 参数：
- `suicoin`: SUI 代币。
- `suipool`: SUI 代币池。
- `payamount`: 支付的金额。
- `token_cap`: 管理代币的权限。
- `item`: 商品名称。
- `token_record`: 代币价格记录。
- `clock`: 时钟。
- `price_info_object`: 价格信息对象。
- `ctx`: 事务上下文。

```
public fun swap_token(
    suicoin: &mut Coin<SUI>,
    suipool: &mut Suipool,
    payamount: u64,
    token_cap: &mut AppTokenCap,
    item: String,
    token_record: &mut TokenRecord,
    clock: &Clock,
    price_info_object: &PriceInfoObject,
    ctx: &mut TxContext,
) { ... }
```



---

### `mint_admincap`
为管理员铸造权限。

#### 参数：
- `_`: 管理员权限。
- `admin`: 管理员地址。
- `ctx`: 事务上下文。

```
public fun mint_admincap(
    _: &AdminCap,
    admin: address,
    ctx: &mut TxContext
) { ... }
```



---

### `set_item_price`
设置商品价格。

#### 参数：
- `_admin`: 管理员权限。
- `price_record`: 价格记录。
- `item`: 商品名称。
- `price`: 商品价格。

```
public fun set_item_price(
    _admin: &AdminCap,
    price_record: &mut PriceRecord,
    item: String,
    price: u64,
) { ... }
```



---

### `remove_item_price`
移除商品价格。

#### 参数：
- `_admin`: 管理员权限。
- `price_record`: 价格记录。
- `item`: 商品名称。

```
public fun remove_item_price(
    _admin: &AdminCap,
    price_record: &mut PriceRecord,
    item: String,
) { ... }
```



---

### `withdraw_commision`
管理员提取池内资金。

#### 参数：
- `_`: 管理员权限。
- `suipool`: SUI 代币池。
- `amount`: 提取金额。
- `to`: 接收地址。
- `ctx`: 事务上下文。

```
public fun withdraw_commision(
    _: &AdminCap,
    suipool: &mut Suipool,
    amount: u64,
    to: address,
    ctx: &mut TxContext,
) { ... }
```



---

### `set_token_price`
设置代币价格。

#### 参数：
- `_admin`: 管理员权限。
- `token_record`: 代币价格记录。
- `item`: 代币名称。
- `price`: 代币价格。

```
public fun set_token_price(
    _admin: &AdminCap,
    token_record: &mut TokenRecord,
    item: String,
    price: u64,
) { 
    if (table::contains<String, u64>(&token_record.prices, item)) {
        let item_price = table::borrow_mut(&mut token_record.prices, item);
        *item_price = price;
    } else {
        table::add<String, u64>(&mut token_record.prices, item, price);
    };
}
```



---

### `remove_token_price`
移除代币价格。

#### 参数：
- `_admin`: 管理员权限。
- `token_record`: 代币价格记录。
- `item`: 代币名称。

```
public fun remove_token_price(
    _admin: &AdminCap,
    token_record: &mut TokenRecord,
    item: String,
) { 
    table::remove<String, u64>(&mut token_record.prices, item);
}
```



---

### `treasury_borrow_mut`
获取 `TreasuryCap` 的可变引用，用于高级操作如刷新代币余额。

#### 参数：
- `_admin`: 管理员权限。
- `app_token_cap`: 管理代币的权限。

#### 返回值：
- `&mut TreasuryCap<FATE>`: 可变引用。

```
public fun treasury_borrow_mut(
    _admin: &AdminCap,
    app_token_cap: &mut AppTokenCap,
): &mut TreasuryCap<FATE> { 
    &mut app_token_cap.cap 
}
```



---

### `burn_raffle_nft`
销毁一个 `RaffleNFT`。

#### 参数：
- `raffle_nft`: 要销毁的 `RaffleNFT` 对象。
- `_ctx`: 事务上下文。

```
public(package) fun burn_raffle_nft(
    raffle_nft: RaffleNFT,
    _ctx: &mut TxContext
) { 
    let RaffleNFT { id, active_time: _, factor: _, checkin_time: _ } = raffle_nft;
    object::delete(id);
}
```



---

### `mint_raffle_nft`
创建一个 `RaffleNFT`。

#### 参数：
- `active_time`: 活跃时间。
- `user`: 接收地址。
- `ctx`: 事务上下文。

```
public(package) fun mint_raffle_nft(
    active_time: u64,
    user: address,
    ctx: &mut TxContext
) { 
    let raffle_nft = RaffleNFT {
        id: object::new(ctx),
        active_time: active_time,
        factor: 2,
        checkin_time: 0,
    };
    transfer::public_transfer(raffle_nft, user);
}
```



---

### `init_for_testing_in_tests`
用于测试环境的初始化函数。

#### 参数：
- `ctx`: 事务上下文。

```
public fun init_for_testing_in_tests(ctx: &mut TxContext) {
    let otw = FATE {};
    init(otw, ctx);
}
```

