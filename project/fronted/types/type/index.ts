/*    public struct Profile has key{
        id: UID,
        name: String,
        description: String,
    }*/

import { CoinMetadata } from "@mysten/sui/client"

export type MoveProfile = {
    id: { id: string },
    handle: string,
    daily_points: number,
    points: number,
    last_time: number,
}

export type MoveRaffleNFT = {
    id: { id: string },
    active_time: number,
    factor: number,
    checkin_time: number,
}

export type RaffleInfo = {
    id: { id: string },
    name: string,
    description: string,
    ticket_cost: number,
    prize: PrizeValidity,
    prize_prob: PrizeProb,
    refund_rate: number,
}

export type PrizeValidity = {
    id: { id: string },
    grand_prize_duration: number,
    second_prize_duration: number,
    third_prize_duration: number,
}

export type PrizeProb = {
    id: { id: string },
    grand_prize_weight: number,
    second_prize_weight: number,
    third_prize_weight: number,
}

export type RaffleNFT = {
    id: { id: string },
    activetime: number,
    factor: number,
}

export type Taroinfo = {
    taro: number[],
    desc: string,
}

export type AdminCap = {
    id: { id: string },
}

export type AppTokenCap = {
    id: { id: string },
    cap: string, // TreasuryCap<FATE> 在TypeScript中表示为字符串
}

export type Suipool = {
    id: { id: string },
    coin: number, // Balance<SUI> 在TypeScript中表示为数字
}

export type PriceRecord = {
    id: { id: string },
    prices: Record<string, number>, // Table<String, u64> 在TypeScript中表示为键值对
}

export type TokenRecord = {
    id: { id: string },
    prices: Record<string, number>, // Table<String, u64> 在TypeScript中表示为键值对
}

export type BuyEvent = {
    buyer: string, // address 在TypeScript中表示为字符串
    item: string,
    price: number,
}
