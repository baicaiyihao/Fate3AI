import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/sui/bcs';
// import { useNetworkVariable } from "./networkConfig";

const CONTRACT_ADDRESS =
    " ";

const Sync = `${CONTRACT_ADDRESS}::ape_on_sui::add_to_whitelist`;
const Claim = `${CONTRACT_ADDRESS}::ape_on_sui::claim`;
const adminCap = ' '
const storage = ' '
const treasuryCap = ' '
export function createTransaction(
    method: "sync" | "claim",
    addresses?: string[],
    address?:string
) {
    const tx = new Transaction();
    const args:any[] = [];

    if (method === "sync") {
        // 添加转换成sui数据格式的参数
        args.push(tx.object(adminCap))
        args.push(tx.object(storage))
        args.push(tx.pure("vector<address>", addresses || []))

        tx.moveCall({
            target: Sync,
            arguments: args,
            
        });
    } else if (method === "claim") {
        args.push(tx.object(treasuryCap))
        args.push(bcs.Address.serialize(address!))
        args.push(tx.object(storage))
        tx.moveCall({
            target: Claim,
            arguments: args,
        });
    }



    return tx;
}
