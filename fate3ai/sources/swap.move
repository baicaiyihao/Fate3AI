// module fate3ai::swap{

//     use fate3ai::fate::{Self, FATE, AppTokenCap}
//     use sui::clock::Clock;
//     use pyth::price_info;
//     use pyth::price_identifier;
//     use pyth::price;
//     use pyth::pyth;
//     use pyth::price_info::PriceInfoObject;
 
//     const E_INVALID_ID: u64 = 1;

//     public struct Pool has key{
//         id: UID,
        
//     }

//     public fun use_pyth_price(
//         // Other arguments
//         clock: &Clock,
//         price_info_object: &PriceInfoObject,
//     ){
//         let max_age = 60;
//         // Make sure the price is not older than max_age seconds
//         let price_struct = pyth::get_price_no_older_than(price_info_object,clock, max_age);
 
//         // Check the price feed ID
//         let price_info = price_info::get_price_info_from_price_info_object(price_info_object);
//         let price_id = price_identifier::get_bytes(&price_info::get_price_identifier(&price_info));
 
//         // ETH/USD price feed ID
//         // The complete list of feed IDs is available at https://pyth.network/developers/price-feed-ids
//         // Note: Sui uses the Pyth price feed ID without the `0x` prefix.
//         assert!(price_id!=x"50c67b3fd225db8912a424dd4baed60ffdde625ed2feaaf283724f9608fea266", E_INVALID_ID);
 
//         // Extract the price, decimal, and timestamp from the price struct and use them
//         let decimal_i64 = price::get_expo(&price_struct);
//         let price_i64 = price::get_price(&price_struct);
//         let timestamp_sec = price::get_timestamp(&price_struct);
//     }




// }