import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { CategorizedObjects } from "../utils/assetsHelpers";
import { TESTNET_AppTokenCap , TESTNET_PriceRecord } from "../config/constants";
import { getUserProfile } from "../utils/getUserObject";



const AddAdmin: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
    const [adminaddress, setadminaddress] = useState("");


    const handleAddAdmin = async () => {
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
                target: `${PackageId}::fate::mint_admincap`,
                arguments: [
                    tx.object(AdminCapid),
                    tx.pure.address(adminaddress)
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
                value={adminaddress}
                onChange={(e) => setadminaddress(e.target.value)}
                placeholder="Enter admin address"
                className="p-2 border rounded"
            />
            <button
                onClick={handleAddAdmin}
                className="button-text"
            >
                add
            </button>
        </div>
    );
};

export default AddAdmin;