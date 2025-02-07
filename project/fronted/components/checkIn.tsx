import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../config/networkConfig";
import { CategorizedObjects } from "../utils/assetsHelpers";
import { TESTNET_AppTokenCap, TESTNET_FATE3AI_PACKAGE_ID } from "../config/constants";
import { getUserProfile } from "../utils/getUserObject";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const CheckIn: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
    const [loading, setLoading] = useState(false);

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
            console.log(profileid)

            setLoading(true);

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
        } finally {
            setLoading(false);
        }
    };

    if (!currentAccount) {
        return (
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-8 w-32" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-nav">
                    Consecutive Check-in: 1 Day
                </h1>
                <p className="text-3xl text-nav">
                    Points Reward: 100
                </p>
            </div>
            
            <Button
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full max-w-xs bg-nav hover:bg-nav/90 text-white py-3 rounded-xl text-lg font-medium transition-all duration-200 transform hover:-translate-y-1"
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Checking in...
                    </div>
                ) : (
                    "Check In"
                )}
            </Button>

            <div className="mt-8 space-y-4 text-center">
                <h2 className="text-2xl font-bold">Check-in Rules</h2>
                <ul className="space-y-2 text-lg text-gray-700">
                    <li>1. Get points reward for daily check-in</li>
                    <li>2. Get extra rewards for consecutive check-ins</li>
                    <li>3. Can only check in once per day</li>
                    <li>4. Missing a check-in will reset consecutive days</li>
                </ul>
            </div>
        </div>
    );
};

export default CheckIn;