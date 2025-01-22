module fate3ai::taro {
    use std::string::String;
    use sui::table::{Self, Table};

    public struct Taroinfo has copy, drop, store {
        taro: vector<u64>,
        desc: String,
    }

    public fun add_taro_info(
        table: &mut Table<u64, Taroinfo>,
        taro: vector<u64>,
        desc: String,
        _: &mut TxContext,
    ) {
        let taro_info = Taroinfo { taro, desc };
        let length = table.length() + 1;
        table::add(table, length, taro_info);
    }

    public fun del_taro_info(table: &mut Table<u64, Taroinfo>, k: u64, _: &mut TxContext) {
        table::remove(table, k);
    }

    public fun get_taro_info(
        table: &mut Table<u64, Taroinfo>,
        k: u64,
        _: &mut TxContext,
    ): vector<u64> {
        let taroinfo = table::borrow(table, k);
        taroinfo.taro
    }
}
