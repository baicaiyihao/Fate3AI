import React, { useState, useEffect } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { CategorizedObjects } from "../utils/assetsHelpers";
import { TESTNET_AppTokenCap, TESTNET_FATE3AI_PACKAGE_ID } from "../config/constants";
import { getUserProfile } from "../utils/getUserObject";
import suiClient from "../cli/suiClient";

const CheckIn: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
    const [profileId, setProfileId] = useState<string | null>(null);
    const [usedNftId, setUsedNftId] = useState<string | null>(null);

    useEffect(() => {
        if (currentAccount?.address) {
            checkUserProfile();
        }
    }, [currentAccount?.address]);

    const checkUserProfile = async () => {
        if (currentAccount?.address) {
            try {
                const profile = await getUserProfile(currentAccount.address);
                setUserObjects(profile);

                const Profile = Object.entries(profile.objects || {}).find(([objectType]) =>
                    objectType.includes(`${TESTNET_FATE3AI_PACKAGE_ID}::profile::Profile`)
                ) as any;
        
                const profileid = Profile?.[1]?.[0]?.data?.objectId;
                setProfileId(profileid);

                if (profileid) {
                    const setRaffleNftInfo = await suiClient.getDynamicFields({parentId: profileid});
                    if (setRaffleNftInfo?.data?.length > 0) {
                        const usedNft = setRaffleNftInfo.data.find(
                            field => field.name?.value === "raffle_nft_name"
                        );
                        if (usedNft) {
                            const usedNftvalue = await suiClient.getObject({
                                id: usedNft.objectId, 
                                options: {showContent: true}
                            }) as any;
                            setUsedNftId(usedNftvalue?.data?.content?.fields?.value);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setUserObjects(null);
                setProfileId(null);
                setUsedNftId(null);
            }
        }
    };

    const handleCheckIn = async () => {
        if (!currentAccount?.address || !profileId) {
            console.error("No connected account or profile found.");
            return;
        }
    
        try {    
            const tx = new Transaction();
            tx.setGasBudget(10000000);
    
            tx.moveCall({
                target: `${PackageId}::fate::signin2earn`,
                arguments: [
                    tx.object(profileId),
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

    const handleNftCheckIn = async () => {
        if (!currentAccount?.address || !profileId || !usedNftId) {
            console.error("No connected account, profile or NFT found.");
            return;
        }
    
        try {    
            const tx = new Transaction();
            tx.setGasBudget(10000000);
    
            tx.moveCall({
                target: `${PackageId}::fate::signin2earn_nft`,
                arguments: [
                    tx.object(profileId),
                    tx.pure.string("raffle_nft_name"),
                    tx.object(usedNftId),    
                    tx.object(TESTNET_AppTokenCap),
                ],
            });
    
            const result = await signAndExecute({ transaction: tx });
            console.log(result);
    
            if (result && !isError) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error checking in with NFT:", error);
        }
    };
    
    return (
        <div className="flex flex-col gap-4">
            <button
                onClick={usedNftId ? handleNftCheckIn : handleCheckIn}
                className="button-text"
            >
                {usedNftId ? "NFT Check In" : "Check In"}
            </button>
        </div>
    );
};

export default CheckIn;