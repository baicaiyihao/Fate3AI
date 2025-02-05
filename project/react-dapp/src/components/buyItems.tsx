import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { CategorizedObjects } from "../utils/assetsHelpers";
import { TESTNET_AppTokenCap, TESTNET_FATE3AI_PACKAGE_ID, TESTNET_PriceRecord, TESTNET_TokenPolicy } from "../config/constants";
import { getUserProfile } from "../utils/getUserObject";



const BuyItem: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);

    const handleBuyItem = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }
    
        try {
            const profile = await getUserProfile(currentAccount?.address);
            setUserObjects(profile);
    
            const Token = Object.entries(profile.objects || {}).find(([objectType]) =>
                objectType.includes(`${PackageId}::fate::FATE`)
            ) as any;
            console.log(Token);
    
            const Tokenid = Token?.[1]?.[0]?.data?.objectId;
    
            if (!Tokenid) {
                console.error("Profile ID is not found.");
                return;
            }
    
            console.log("Token ID:", Tokenid);
            console.log("App Token Cap:", TESTNET_AppTokenCap);
            console.log("PackageId:", PackageId);
    
            const tx = new Transaction();
            tx.setGasBudget(10000000);
    
            tx.moveCall({
                target: `${PackageId}::fate::buyItem`,
                arguments: [
                    tx.object("0xed7297364c911fb94f0ae92f38e9195b4c35c7d22cd9732962e09ec4feb70250"),
                    tx.object(TESTNET_PriceRecord),
                    tx.pure.string("taro"),
                    tx.object(TESTNET_TokenPolicy),
                ],
            });
    
            const result = await signAndExecute({ transaction: tx });
    
            console.log(result);
    
            if (result && !isError) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error checking in:", error);
        }
    };
    
    return (
        <div className="flex flex-col gap-4">
            <button
                onClick={handleBuyItem}
                className="button-text"
            >
                占卜
            </button>
        </div>
    );
};

export default BuyItem;