import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../config/networkConfig";
import { CategorizedObjects } from "../utils/assetsHelpers";
import { TESTNET_PriceRecord, TESTNET_TokenPolicy } from "../config/constants";
import { getUserProfile } from "../utils/getUserObject";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";


const BuyItem: React.FC<{ onSuccess: () => void, onError: (error: any) => void }> = ({ onSuccess, onError }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);

    const handleBuyItem = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            onError("No connected account found.");
            return;
        }
    
        try {
            const profile = await getUserProfile(currentAccount?.address);
            setUserObjects(profile);
    
            const allTokens = Object.entries(profile.objects || {}).filter(([objectType]) =>
                objectType.includes(`0x2::token::Token<${PackageId}::fate::FATE>`)
            ) as any;
            console.log("All Tokens:", allTokens);

            if (!allTokens || !allTokens[0] || !allTokens[0][1] || allTokens[0][1].length === 0) {
                toast.error("Token NotFound");
                return;
            }

            const tx = new Transaction();
            tx.setGasBudget(10000000);

            // 如果有多个 token，先合并
            if (allTokens[0][1].length > 1) {
                // 找出余额最大的 token 作为主 token
                const primaryToken = allTokens[0][1].reduce((max: any, current: any) => {
                    const maxBalance = parseInt(max.data.content.fields.balance);
                    const currentBalance = parseInt(current.data.content.fields.balance);
                    return maxBalance >= currentBalance ? max : current;
                }, allTokens[0][1][0]);

                const primaryTokenId = primaryToken.data.objectId;
                const mergeTokens = allTokens[0][1]
                    .filter((token: any) => token.data.objectId !== primaryTokenId)
                    .map((token: any) => token.data.objectId);
                
                console.log("Primary Token:", primaryTokenId);
                console.log("Merge Tokens:", mergeTokens);

                // 合并所有 token
                for (const tokenId of mergeTokens) {
                    tx.moveCall({
                        target: `0x2::token::join`,
                        typeArguments: [`${PackageId}::fate::FATE`],
                        arguments: [
                            tx.object(primaryTokenId),
                            tx.object(tokenId),
                        ],
                    });
                }
                console.log(primaryTokenId);

                tx.moveCall({
                    target: `${PackageId}::fate::buyItem`,
                    arguments: [
                        tx.object(primaryTokenId),
                        tx.object(TESTNET_PriceRecord),
                        tx.pure.string("taro"),
                        tx.object(TESTNET_TokenPolicy),
                    ],
                });
            } else {
                // 只有一个 token 的情况
                const Tokenid = allTokens[0][1][0].data.objectId;
                console.log("Single Token ID:", Tokenid);
                
                tx.moveCall({
                    target: `${PackageId}::fate::buyItem`,
                    arguments: [
                        tx.object(Tokenid),
                        tx.object(TESTNET_PriceRecord),
                        tx.pure.string("taro"),
                        tx.object(TESTNET_TokenPolicy),
                    ],
                });
            }
    
            const result = await signAndExecute({ transaction: tx });
            console.log(result);
    
            if (result && !isError) {
                onSuccess();
            }
            // if (true) { 
            //     // 调试用 正常后可删除
            //     onSuccess();
            // }
            else{
                onError("支付失败");
            }
        } catch (error) {
            console.error("Error buying item:", error);
        }
    };
    
    return (
    
       <div>
         <Button
                onClick={handleBuyItem}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-medium rounded-xl transition-all duration-200">
                Start Divination
            </Button>
       </div>
       
    );
};

export default BuyItem;