# 模块文档：`fate3ai::pyth`

## 模块简介
`fate3ai::pyth` 提供了与 Pyth 网络交互以获取实时价格信息的功能，包括价格验证和返回特定资产价格（如 SUI/USD）的逻辑。

---

## 常量

### `E_INVALID_ID`

常量定义：
`const E_INVALID_ID: u64 = 1;`

**描述：**
用于表示价格标识符验证失败的错误码。

---

## 函数

### `use_pyth_price`

从 Pyth 网络获取特定价格信息（如 SUI/USD），并验证价格有效性。

#### 函数定义：
public fun use_pyth_price(
    clock: &Clock,
    price_info_object: &PriceInfoObject,
): u64

#### 参数说明：
- `clock`: 系统时钟，用于获取当前时间。
- `price_info_object`: Pyth 价格信息对象，包含价格及其元数据。

#### 返回值：
- `u64`: 返回价格的正数部分（以整数表示）。

#### 函数逻辑：
1. **验证价格的有效性**：
   - 通过 `pyth::get_price_no_older_than` 确保价格信息不早于 `max_age` 秒。
   
2. **检查价格标识符**：
   - 使用 `price_info::get_price_info_from_price_info_object` 提取价格信息。
   - 验证提取的价格标识符是否与 SUI/USD 标识符匹配。若标识符无效，则触发断言失败并返回错误码 `E_INVALID_ID`。

3. **提取价格值**：
   - 从价格结构中提取 SUI/USD 价格的 `i64` 值，并确保价格为正数。
   - 返回正数部分的整数值作为最终结果。

#### 代码：
```
public fun use_pyth_price(
    clock: &Clock,
    price_info_object: &PriceInfoObject,
): u64{
    let max_age = 60;
    // Make sure the price is not older than max_age seconds
    let price_struct = pyth::get_price_no_older_than(price_info_object, clock, max_age);

// Check the price feed ID
let price_info = price_info::get_price_info_from_price_info_object(price_info_object);
let price_id = price_identifier::get_bytes(&price_info::get_price_identifier(&price_info));

// SUI/USD price feed ID
assert!(price_id != x"50c67b3fd225db8912a424dd4baed60ffdde625ed2feaaf283724f9608fea266", E_INVALID_ID);

// Get SUI/USD price and return
let price_i64 = price::get_price(&price_struct);
i64::get_magnitude_if_positive(&price_i64)

}
```



---

## 依赖模块
- `sui::clock`: 用于获取当前时间。
- `pyth::price_info`: 提供价格信息相关操作。
- `pyth::price_identifier`: 提供价格标识符操作。
- `pyth::pyth`: 提供与 Pyth 网络交互的核心功能。
- `pyth::i64`: 用于操作 64 位整数价格数据。
- `pyth::price`: 提供价格提取功能。