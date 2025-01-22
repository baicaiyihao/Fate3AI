module fate3ai::profile{
    use fate3ai::taro::{Taroinfo};
    use std::string::String;
    use sui::table::{Self, Table};
    use sui::dynamic_field;


    // User profile
    public struct Profile has key {
        id: UID,
        handle: String,
        daily_points: u64,
        points: u64,
        last_time: u64,
    }

    public struct RaffleNFT has key, store{
        id: UID,
        active_time: u64,
        factor: u64,
        checkin_time: u64,
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

    public fun add_raffle_nft_to_profile(
        profile: &mut Profile,
        raffle_nft: &mut RaffleNFT,
        name: String,
        nft: address,
        _: &mut TxContext
    ){
        dynamic_field::add(&mut profile.id, name, nft);
        profile.daily_points = profile.daily_points * raffle_nft.factor;
    }

    public fun del_raffle_nft_to_profile(
        profile: &mut Profile,
        raffle_nft: &mut RaffleNFT,
        name: String,
    ){
        dynamic_field::remove<String, ID>(&mut profile.id, name);
        profile.daily_points = profile.daily_points / raffle_nft.factor;
    }

    // Everyday checkin function
    public fun checkin(
        profile: &mut Profile, 
        name: String,
        raffle_nft: &mut RaffleNFT,
        ctx: &TxContext
    ){
        let this_epoch_time = ctx.epoch_timestamp_ms();
        if (profile.last_time != 0){
            assert!(is_same_day(this_epoch_time, profile.last_time),0);
            if(dynamic_field::exists_(&profile.id, name)){
                assert!(dynamic_field::borrow(&profile.id, name) == object::id(raffle_nft),1);
                if(raffle_nft.checkin_time < raffle_nft.active_time){
                    profile.last_time = this_epoch_time;
                    profile.points = profile.points + 1;
                    raffle_nft.checkin_time = raffle_nft.checkin_time + 1;
                }else if(raffle_nft.checkin_time == raffle_nft.active_time){
                    profile.last_time = this_epoch_time;
                    profile.points = profile.points + 1;
                    raffle_nft.checkin_time = raffle_nft.checkin_time + 1;
                    del_raffle_nft_to_profile(profile, raffle_nft, name)
                }
            }else{
                profile.last_time = this_epoch_time;
                profile.points = profile.points + 1;
            }
        }else{
            if(dynamic_field::exists_(&profile.id, name)){
                assert!(dynamic_field::borrow(&profile.id, name) == object::id(raffle_nft),1);
                if(raffle_nft.checkin_time < raffle_nft.active_time){
                    profile.last_time = this_epoch_time;
                    profile.points = profile.points + 1;
                    raffle_nft.checkin_time = raffle_nft.checkin_time + 1;
                }else if(raffle_nft.checkin_time == raffle_nft.active_time){
                    profile.last_time = this_epoch_time;
                    profile.points = profile.points + 1;
                    raffle_nft.checkin_time = raffle_nft.checkin_time + 1;
                    del_raffle_nft_to_profile(profile, raffle_nft, name)
                }
            }else{
                profile.last_time = this_epoch_time;
                profile.points = profile.points + 1;
            }
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
        profile.daily_points
    }

    // Check time is_same_day
    public fun is_same_day(timestamp1: u64, timestamp2: u64): bool {
        let millis_per_day: u64 = 24 * 60 * 60 * 1000;
        let day1 = timestamp1 / millis_per_day;
        let day2 = timestamp2 / millis_per_day;
        day1 == day2
    }

        // Mint a new RaffleNFT with the specified prize duration
    public(package) fun mint_raffle_nft(
        active_time: u64,
        user: address,
        ctx: &mut TxContext
    ){
        let raffle_nft = RaffleNFT {
            id: object::new(ctx),
            active_time: active_time,
            factor: 2,
            checkin_time: 0,
        };
        transfer::public_transfer(raffle_nft, user);
    }

    public(package) fun burn_raffle_nft(
        raffle_nft: RaffleNFT,
        _ctx: &mut TxContext
    ){
        let RaffleNFT { id, active_time: _ , factor: _ ,checkin_time: _} = raffle_nft;
        object::delete(id);
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
            daily_points: 150,
            points: 0,
            last_time: 0,
        }
    }
}