import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { CategorizedObjects } from "../utils/assetsHelpers";
import { TESTNET_AppTokenCap , TESTNET_PriceRecord } from "../config/constants";
import { getUserProfile } from "../utils/getUserObject";



const SetItemsPrice: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
    const [items, setItems] = useState("");
    const [price, setPrice] = useState("");


    const handleSetItemsPrice = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }
    
        try {
            const profile = await getUserProfile(currentAccount?.address);
            setUserObjects(profile);
    
            const AdminCap = Object.entries(profile.objects || {}).find(([objectType]) =>
                objectType.includes(`${PackageId}::fate::AdminCap`)
            ) as any;
    
            const AdminCapid = AdminCap?.[1]?.[0]?.data?.objectId;
    
            if (!AdminCapid) {
                console.error("Profile ID is not found.");
                return;
            }
    
            console.log("Profile ID:", AdminCapid);
            console.log("App Token Cap:", TESTNET_AppTokenCap);
            console.log("PackageId:", PackageId);
    
            const tx = new Transaction();
            tx.setGasBudget(10000000);
    
            tx.moveCall({
                target: `${PackageId}::fate::set_item_price`,
                arguments: [
                    tx.object(AdminCapid),
                    tx.object(TESTNET_PriceRecord),
                    tx.pure.string(items),
                    tx.pure.u64(price)
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
            <input
                type="text"
                value={items}
                onChange={(e) => setItems(e.target.value)}
                placeholder="Enter items"
                className="p-2 border rounded"
            />
            <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter items price"
                className="p-2 border rounded"
            />
            <button
                onClick={handleSetItemsPrice}
                className="button-text"
            >
                add price
            </button>
        </div>
    );
};

export default SetItemsPrice;