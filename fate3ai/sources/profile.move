module fate3ai::profile{
    use std::string::String;

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
    public fun dailypoints(profile: &Profile): u64 {
        profile.dailypoints
    }

    // Check time is_same_day
    public fun is_same_day(timestamp1: u64, timestamp2: u64): bool {
        let millis_per_day: u64 = 24 * 60 * 60 * 1000;
        let day1 = timestamp1 / millis_per_day;
        let day2 = timestamp2 / millis_per_day;
        day1 == day2
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