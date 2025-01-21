module fate3ai::profile{
    use fate3ai::taro::{Taroinfo};
    use std::string::String;
    use sui::table::{Self, Table};
    use sui::dynamic_field;

    // User profile
    public struct Profile has key {
        id: UID,
        handle: String,
        dailypoints: u64,
        points: u64,
        last_time: u64,
    }

    // Mint a profile to user
    public fun mint(handle: String, ctx: &mut TxContext) {
        let sender = ctx.sender();
        let profile = new(handle, ctx);
        transfer::transfer(profile, sender);
    }

    #[allow(lint(self_transfer))]
    public fun add_taro_dynamic(
        name: String,
        profile: &mut Profile,
        ctx: &mut TxContext
    ){
        let taro_table = table::new<u64,Taroinfo>(ctx);
        dynamic_field::add(&mut profile.id, name, object::id(&taro_table));
        transfer::public_transfer(taro_table,ctx.sender());
    }

    public fun del_taro_dynamic(
        name: String,
        profile: &mut Profile,
        table: Table<u64,Taroinfo>,
        _: &mut TxContext
    ){
        dynamic_field::remove<String, ID>(&mut profile.id,name);
        remove_table(table);
    }

    // Everyday checkin function
    public fun checkin(profile: &mut Profile, ctx: &TxContext) {
        let this_epoch_time = ctx.epoch_timestamp_ms();
        if (profile.last_time != 0){
            assert!(is_same_day(this_epoch_time, profile.last_time),0);
            profile.last_time = this_epoch_time;
            profile.points = profile.points + 1;
        }else{
            profile.last_time = this_epoch_time;
            profile.points = profile.points + 1;
        }
    }

    // Burn user profile
    public fun burn(profile: Profile, ctx: &TxContext) {
        let this_epoch_time = ctx.epoch_timestamp_ms();
        assert!(this_epoch_time > profile.last_time);
        let Profile {
            id,
            ..
        } = profile;
        object::delete(id);
    }

    // Get user profile points
    public fun points(profile: &Profile): u64 {
        profile.points
    }

    // Get user dailypoints
    public fun daily_points(profile: &Profile): u64 {
        profile.dailypoints
    }

    // Check time is_same_day
    public fun is_same_day(timestamp1: u64, timestamp2: u64): bool {
        let millis_per_day: u64 = 24 * 60 * 60 * 1000;
        let day1 = timestamp1 / millis_per_day;
        let day2 = timestamp2 / millis_per_day;
        day1 == day2
    }

    fun remove_table(
        table: Table<u64,Taroinfo>
    ){
        table::drop(table);
    }

    fun new(handle: String, ctx: &mut TxContext): Profile {
        Profile {
            id: object::new(ctx),
            handle,
            dailypoints: 150,
            points: 0,
            last_time: 0,
        }
    }
}