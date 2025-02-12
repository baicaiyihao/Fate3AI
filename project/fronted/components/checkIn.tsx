import React, { useState,useEffect } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../config/networkConfig";
import { CategorizedObjects } from "../utils/assetsHelpers";
import { TESTNET_AppTokenCap, TESTNET_FATE3AI_PACKAGE_ID } from "../config/constants";
import { getUserProfile } from "../utils/getUserObject";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import suiClient from "../cli/suiClient";
import { eventBus } from "@/utils/eventBus";

const CheckIn: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
    const [loading, setLoading] = useState(false);
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
            await new Promise((resolve) => setTimeout(resolve, 2000));
    
            if (result && !isError) {
                onSuccess();
                eventBus.emit('refreshProfile');
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
            await new Promise((resolve) => setTimeout(resolve, 2000));

            if (result && !isError) {
                onSuccess();
                eventBus.emit('refreshProfile');
            }
        } catch (error) {
            console.error("Error checking in with NFT:", error);
        }
    };


    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-nav">
                    Consecutive Check-in: 1 Day
                </h1>
                <p className="text-3xl text-nav">
                    FATE Token Reward: 150
                </p>
            </div>
            
            <div className="flex flex-col gap-4">
            <Button
                onClick={usedNftId ? handleNftCheckIn : handleCheckIn}
                variant="default" 
                className="w-48 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition duration-300 
                ease-in-out transform hover:scale-105 hover:shadow-xl"
                size="lg"
            >
                {usedNftId ? "NFT Check In" : "Check In"}
            </Button>
        </div>

        <div className="mt-8 space-y-6 text-center w-full max-w-md">
            <h2 className="text-2xl font-bold text-purple-600">Check-in Rules</h2>
            <ul className="space-y-4 text-lg text-gray-600">
                <li className="hover:text-purple-500 transition-colors duration-200">
                    1. Get points reward for daily check-in
                </li>
                <li className="hover:text-purple-500 transition-colors duration-200">
                    2. Get extra rewards for consecutive check-ins
                </li>
                <li className="hover:text-purple-500 transition-colors duration-200">
                    3. Can only check in once per day
                </li>
                <li className="hover:text-purple-500 transition-colors duration-200">
                    4. Missing a check-in will reset consecutive days
                </li>
            </ul>
        </div>
        </div>
    );
};

export default CheckIn;