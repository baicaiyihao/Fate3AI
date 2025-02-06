module fate3ai::fate {
    use fate3ai::profile::{Self, Profile, RaffleNFT};
    use fate3ai::pyth::use_pyth_price;
    use pyth::price_info::PriceInfoObject;
    use std::string::String;
    use sui::balance::{Balance, zero};
    use sui::clock::Clock;
    use sui::coin::{Self, TreasuryCap, Coin, into_balance, from_balance};
    use sui::event::emit;
    use sui::sui::SUI;
    use sui::table::{Self, Table};
    use sui::token::{Self, TokenPolicy, Token};
    use sui::url::new_unsafe_from_bytes;

    const DECIMALS: u8 = 0;
    const SYMBOLS: vector<u8> = b"FATE";
    const NAME: vector<u8> = b"FATE";
    const DESCRIPTION: vector<u8> = b"FATE3AI";
    const ICON_URL: vector<u8> = b"https://";

    const EWrongAmount: u64 = 0;

    public struct FATE has drop {}

    public struct AdminCap has key, store {
        id: UID,
    }

    //You can use it to mint token
    public struct AppTokenCap has key {
        id: UID,
        cap: TreasuryCap<FATE>,
    }

    public struct Suipool has key {
        id: UID,
        coin: Balance<SUI>,
    }

    //AI agent price table
    public struct PriceRecord has key {
        id: UID,
        prices: Table<String, u64>,
    }

    //Token price table
    public struct TokenRecord has key {
        id: UID,
        prices: Table<String, u64>,
    }

    //Spend token event
    public struct BuyEvent has copy, drop {
        buyer: address,
        item: String,
        price: u64,
    }

        //Spend token event
    public struct BuyEvent1 has copy, drop {
        buyer: address,
        item: String,
        price1: u64,
        price2: u64,
        price3: u64,
        price4: u64,
    }

    fun init(otw: FATE, ctx: &mut TxContext) {
        let deployer = ctx.sender();
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::public_transfer(admin_cap, deployer);

        let (treasury_cap, metadata) = coin::create_currency<FATE>(
            otw,
            DECIMALS,
            SYMBOLS,
            NAME,
            DESCRIPTION,
            option::some(new_unsafe_from_bytes(ICON_URL)),
            ctx,
        );

        let suipool = Suipool {
            id: object::new(ctx),
            coin: zero<SUI>(),
        };

        let (mut policy, cap) = token::new_policy<FATE>(
            &treasury_cap,
            ctx,
        );

        let token_cap = AppTokenCap {
            id: object::new(ctx),
            cap: treasury_cap,
        };

        let price_record = PriceRecord {
            id: object::new(ctx),
            prices: table::new<String, u64>(ctx),
        };

        let token_record = TokenRecord {
            id: object::new(ctx),
            prices: table::new<String, u64>(ctx),
        };

        //just spend policy
        token::allow(&mut policy, &cap, token::spend_action(), ctx);

        token::share_policy<FATE>(policy);
        transfer::share_object(token_cap);
        transfer::share_object(suipool);
        transfer::share_object(price_record);
        transfer::share_object(token_record);
        transfer::public_transfer(cap, deployer);
        transfer::public_freeze_object(metadata);
    }

    // Everyday checkin, you can get 150 Token<FATE>
    public fun signin2earn(
        profile: &mut Profile,
        token_cap: &mut AppTokenCap,
        ctx: &mut TxContext,
    ) {
        profile::checkin(profile, ctx);
        let app_token = token::mint(&mut token_cap.cap, profile::daily_points(profile), ctx);
        let req = token::transfer<FATE>(app_token, ctx.sender(), ctx);
        token::confirm_with_treasury_cap<FATE>(
            &mut token_cap.cap,
            req,
            ctx,
        );
    }

    // Everyday checkin, you can get 300 Token<FATE>
    public fun signin2earn_nft(
        profile: &mut Profile,
        name: String,
        raffle_nft: &mut RaffleNFT,
        token_cap: &mut AppTokenCap,
        ctx: &mut TxContext,
    ) {
        profile::checkin_withnft(profile, name, raffle_nft, ctx);
        let app_token = token::mint(&mut token_cap.cap, profile::daily_points(profile), ctx);
        let req = token::transfer<FATE>(app_token, ctx.sender(), ctx);
        token::confirm_with_treasury_cap<FATE>(
            &mut token_cap.cap,
            req,
            ctx,
        );
    }

    // You can spend your Token<FATE> to use Ai Agent
    public fun buyItem(
        payment: &mut Token<FATE>,
        price_record: &PriceRecord,
        item: String,
        token_prolicy: &mut TokenPolicy<FATE>,
        ctx: &mut TxContext,
    ) {
        let price = table::borrow(&price_record.prices, item);
        assert!(token::value<FATE>(payment) > *price, EWrongAmount);
        let pay = token::split<FATE>(payment, *price, ctx);
        let req = token::spend(pay, ctx);
        token::confirm_request_mut(token_prolicy, req, ctx);
        emit(BuyEvent {
            buyer: ctx.sender(),
            item,
            price: *price,
        });
    }

    public(package) fun mint_token(
        token_cap: &mut AppTokenCap,
        amount: u64,
        user: address,
        ctx: &mut TxContext,
    ) {
        let app_token = token::mint(&mut token_cap.cap, amount, ctx);
        let req = token::transfer<FATE>(app_token, user, ctx);
        token::confirm_with_treasury_cap<FATE>(
            &mut token_cap.cap,
            req,
            ctx,
        );
    }

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
    ) {
        let sui_price = use_pyth_price(clock, price_info_object);
        let token_price = table::borrow(&token_record.prices, item);
        let paysui_amount = ((payamount * 100000000 * 1000000000) as u256 / (sui_price as u256)) as u64 ;


        assert!(suicoin.value() > paysui_amount, EWrongAmount);

        let paycoin = suicoin.split(paysui_amount, ctx);
        let value = paycoin.value();
        suipool.coin.join(paycoin.into_balance());

        let token_amount = payamount * (*token_price);
        let app_token = token::mint(&mut token_cap.cap, token_amount, ctx);
        let req = token::transfer<FATE>(app_token, ctx.sender(), ctx);
        token::confirm_with_treasury_cap<FATE>(
            &mut token_cap.cap,
            req,
            ctx,
        );
        emit(BuyEvent1 {
            buyer: ctx.sender(),
            item,
            price1: sui_price,
            price2: value,
            price3: paysui_amount,
            price4: token_amount,
        });
    }

    // ------ Admin Functions ---------
    public fun mint_admincap(_: &AdminCap, admin: address, ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(admin_cap, admin);
    }

    // for token::flush
    public fun treasury_borrow_mut(
        _admin: &AdminCap,
        app_token_cap: &mut AppTokenCap,
    ): &mut TreasuryCap<FATE> {
        &mut app_token_cap.cap
    }

    // Admin can set item price
    public fun set_item_price(
        _admin: &AdminCap,
        price_record: &mut PriceRecord,
        item: String,
        price: u64,
    ) {
        if (table::contains<String, u64>(&price_record.prices, item)) {
            let item_price = table::borrow_mut(&mut price_record.prices, item);
            *item_price = price;
        } else {
            table::add<String, u64>(&mut price_record.prices, item, price);
        };
    }

    // Admin can remove item price
    public fun remove_item_price(_admin: &AdminCap, price_record: &mut PriceRecord, item: String) {
        table::remove<String, u64>(&mut price_record.prices, item);
    }

    // Admin can set token price
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

    // Admin can remove token price
    public fun remove_token_price(_admin: &AdminCap, token_record: &mut TokenRecord, item: String) {
        table::remove<String, u64>(&mut token_record.prices, item);
    }

    // Admin can withdraw coin
    public fun withdraw_commision(
        _: &AdminCap,
        suipool: &mut Suipool,
        amount: u64,
        to: address,
        ctx: &mut TxContext,
    ) {
        assert!(suipool.coin.value() > amount, EWrongAmount);
        let coin_balance = suipool.coin.split(amount);
        let coin = from_balance(coin_balance, ctx);
        transfer::public_transfer(coin, to);
    }

    #[test_only]
    public fun init_for_testing_in_tests(ctx: &mut TxContext) {
        let otw = FATE {};
        init(otw, ctx);
    }
}
