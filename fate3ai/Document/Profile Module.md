- # 模块文档：`fate3ai::profile`
  
  ## 模块简介
  `fate3ai::profile` 模块提供用户档案的核心管理功能，包括用户档案的创建、更新、关联塔罗牌和抽奖NFT，以及签到逻辑的实现。
  
  ---
  
  ## 数据结构
  
  ### `Profile`
  
  描述用户档案的结构体。
  
  结构定义：
  
  ```
  public struct Profile has key {
      id: UID, // 用户的唯一标识
      handle: String, // 用户昵称
      daily_points: u64, // 用户每日可领取的积分
      points: u64, // 用户当前累计积分
      last_time: u64, // 用户上次签到时间
  }
  ```
  
  
  
  ---
  
  ### `RaffleNFT`
  
  描述抽奖生成的NFT信息。
  
  结构定义：
  
  ```
  public struct RaffleNFT has key, store {
      id: UID, // NFT的唯一标识
      active_time: u64, // 有效期（天）
      factor: u64, // 奖励倍数因子
      checkin_time: u64, // 当前NFT已使用的签到次数
  }
  ```
  
  
  
  ---
  
  ## 函数
  
  ### `mint`
  
  创建一个新的用户档案并转移到用户地址。
  
  函数定义：
  
  ```
  public fun mint(handle: String, ctx: &mut TxContext)
  ```
  
  **参数说明：**
  
  - `handle`: 用户昵称
  - `ctx`: 交易上下文
  
  ---
  
  ### `add_taro_dynamic`
  
  为用户档案动态添加塔罗牌信息。
  
  函数定义：
  
  ```
  public fun add_taro_dynamic(
      name: String,
      profile: &mut Profile,
      ctx: &mut TxContext
  )
  ```
  
  **参数说明：**
  - `name`: 动态字段名称
  - `profile`: 用户档案
  - `ctx`: 交易上下文
  
  ---
  
  ### `del_taro_dynamic`
  
  从用户档案中移除塔罗牌信息。
  
  函数定义：
  
  ```
  public fun del_taro_dynamic(
      name: String,
      profile: &mut Profile,
      table: Table<u64,Taroinfo>,
      _: &mut TxContext
  )
  ```
  
  **参数说明：**
  - `name`: 动态字段名称
  - `profile`: 用户档案
  - `table`: 塔罗牌表
  - `_`: 交易上下文
  
  ---
  
  ### `add_raffle_nft_to_profile`
  
  将抽奖NFT绑定到用户档案中，并更新每日积分倍数。
  
  函数定义：
  
  ```
  public fun add_raffle_nft_to_profile(
      profile: &mut Profile,
      raffle_nft: &mut RaffleNFT,
      name: String,
      nft: address,
      _: &mut TxContext
  )
  ```
  
  **参数说明：**
  - `profile`: 用户档案
  - `raffle_nft`: 抽奖NFT
  - `name`: 动态字段名称
  - `nft`: NFT地址
  - `_`: 交易上下文
  
  ---
  
  ### `del_raffle_nft_to_profile`
  
  从用户档案中移除绑定的抽奖NFT，并恢复每日积分倍数。
  
  函数定义：
  
  ```
  public fun del_raffle_nft_to_profile(
      profile: &mut Profile,
      raffle_nft: &mut RaffleNFT,
      name: String
  )
  ```
  
  **参数说明：**
  - `profile`: 用户档案
  - `raffle_nft`: 抽奖NFT
  - `name`: 动态字段名称
  
  ---
  
  ### `checkin`
  
  实现每日签到功能。
  
  函数定义：
  
  ```
  public fun checkin(
      profile: &mut Profile, 
      name: String,
      raffle_nft: &mut RaffleNFT,
      ctx: &TxContext
  )
  ```
  
  **参数说明：**
  - `profile`: 用户档案
  - `name`: 动态字段名称
  - `raffle_nft`: 抽奖NFT
  - `ctx`: 交易上下文
  
  ---
  
  ### `burn`
  
  销毁用户档案。
  
  函数定义：
  
  ```
  public fun burn(profile: Profile, ctx: &TxContext)
  ```
  
  **参数说明：**
  - `profile`: 用户档案
  - `ctx`: 交易上下文
  
  ---
  
  ### `points`
  
  获取用户累计积分。
  
  函数定义：
  
  ```
  public fun points(profile: &Profile): u64
  ```
  
  **参数说明：**
  - `profile`: 用户档案
  
  **返回值：**
  - 用户当前累计积分
  
  ---
  
  ### `daily_points`
  
  获取用户每日可领取积分。
  
  函数定义：
  
  ```
  public fun daily_points(profile: &Profile): u64
  ```
  
  **参数说明：**
  - `profile`: 用户档案
  
  **返回值：**
  - 用户每日可领取积分
  
  ---
  
  ### `is_same_day`
  
  判断两个时间戳是否为同一天。
  
  函数定义：
  
  ```
  public fun is_same_day(timestamp1: u64, timestamp2: u64): bool
  ```
  
  **参数说明：**
  - `timestamp1`: 第一个时间戳
  - `timestamp2`: 第二个时间戳
  
  **返回值：**
  - 是否为同一天
  
  ---
  
  ### `mint_raffle_nft`
  
  铸造一个新的抽奖NFT。
  
  函数定义：
  
  ```
  public(package) fun mint_raffle_nft(
      active_time: u64,
      user: address,
      ctx: &mut TxContext
  )
  ```
  
  **参数说明：**
  - `active_time`: NFT的有效期（天）
  - `user`: 用户地址
  - `ctx`: 交易上下文
  
  ---
  
  ### `burn_raffle_nft`
  
  销毁抽奖NFT。
  
  函数定义：
  
  ```
  public(package) fun burn_raffle_nft(
      raffle_nft: RaffleNFT,
      _ctx: &mut TxContext
  )
  ```
  
  **参数说明：**
  - `raffle_nft`: 抽奖NFT
  - `_ctx`: 交易上下文
  
  ---
  
  ### `remove_table`
  
  销毁塔罗牌表。
  
  函数定义：
  
  ```
  fun remove_table(
      table: Table<u64,Taroinfo>
  )
  ```
  
  **参数说明：**
  - `table`: 塔罗牌表
  
  ---
  
  ### `new`
  
  创建一个新的用户档案。
  
  函数定义：
  
  ```
  fun new(handle: String, ctx: &mut TxContext): Profile
  ```
  
  **参数说明：**
  - `handle`: 用户昵称
  - `ctx`: 交易上下文
  
  **返回值：**
  - 新的用户档案
