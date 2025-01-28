import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { CategorizedObjects } from "../utils/assetsHelpers";
import { TESTNET_AppTokenCap, TESTNET_FATE3AI_PACKAGE_ID } from "../config/constants";
import { getUserProfile } from "../utils/getUserObject";



const CheckIn: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);

    const handleCheckIn = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }
    
        try {
            const profile = await getUserProfile(currentAccount?.address);
            setUserObjects(profile);
    
            const Profile = Object.entries(profile.objects || {}).find(([objectType]) =>
                objectType.includes(`${TESTNET_FATE3AI_PACKAGE_ID}::profile::Profile`)
            ) as any;
    
            const profileid = Profile?.[1]?.[0]?.data?.objectId;
    
            if (!profileid) {
                console.error("Profile ID is not found.");
                return;
            }
    
            console.log("Profile ID:", profileid);
            console.log("App Token Cap:", TESTNET_AppTokenCap);
            console.log("PackageId:", PackageId);
    
            const tx = new Transaction();
            tx.setGasBudget(10000000);
    
            tx.moveCall({
                target: `${PackageId}::fate::signin2earn`,
                arguments: [
                    tx.object(profileid),
                    tx.object(TESTNET_AppTokenCap),
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
                onClick={handleCheckIn}
                className="button-text"
            >
                Check In
            </button>
        </div>
    );
};

export default CheckIn;