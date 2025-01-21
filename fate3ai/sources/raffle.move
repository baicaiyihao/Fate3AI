module fate3ai::raffle {
    use fate3ai::fate::{Self, mint_token, AppTokenCap, AdminCap};
    use sui::random::{Self, Random};
    use std::string::String;

    public struct RaffleInfo has key{
        id: UID,
        name: String,
        description: String,
        ticket_cost: u64,
        prize: PrizeValidity,
        prize_prob: PrizeProb,
        refund_rate: u64,
    }

    public struct PrizeValidity has key, store{
        id: UID,
        grand_prize_duration: u64,
        second_prize_duration: u64,
        third_prize_duration: u64,
    }

    public struct PrizeProb has key, store{
        id: UID,
        grand_prize_weight: u64,
        second_prize_weight: u64,
        third_prize_weight: u64,
    }

    public struct RaffleNFT has key {
        id: UID,
        activetime: u64,  // Prize validity period (in days)
        factor: u64       // Prize multiplier factor
    }

    // Lottery function to determine the prize based on weighted probability
    public fun lottery(
        random: &Random,
        taro: vector<u64>,
        raffleinfo: &RaffleInfo,
        token_cap: &mut AppTokenCap,
        ctx: &mut TxContext
    ) {
        let taro_seed = 

    }

    // Function to get the prize details (validity period and factor)
    public fun get_activetime(
        rafflenft: &RaffleNFT
    ): (u64, u64) {
        (rafflenft.activetime, rafflenft.factor)
    }

    // Mint a new RaffleNFT with the specified prize duration
    fun mint(
        activetime: u64,
        ctx: &mut TxContext
    ): RaffleNFT {
        RaffleNFT {
            id: object::new(ctx),
            activetime: activetime,
            factor: 2
        }
    }
}
