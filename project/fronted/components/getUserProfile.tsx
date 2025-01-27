import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { getUserProfile } from "../utils/getUserObject";
import { CategorizedObjects } from "../utils/assetsHelpers";
import CreateProfile  from "../components/createProfile";
import { TESTNET_FATE3AI_PACKAGE_ID } from "../config/constants";

const REFRESH_INTERVAL = 3000; // 每 3 秒刷新一次

export default function Getuserinfo() {
    const account = useCurrentAccount();
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
    const [hasProfile, setHasProfile] = useState(false);
    const [ProfileData, setProfileData] = useState<any | null>(null);

    async function refreshUserProfile() {
        if (account?.address) {
            try {
                const profile = await getUserProfile(account.address);
                setUserObjects(profile);

                const Profile = Object.entries(profile.objects || {}).find(([objectType]) =>
                    objectType.includes(`${TESTNET_FATE3AI_PACKAGE_ID}::profile::Profile`)
                );

                if (Profile) {
                    setHasProfile(true);
                    setProfileData(Profile[1]);
                } else {
                    setProfileData(false);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        }
    }

    useEffect(() => {
        refreshUserProfile();
        const intervalId = setInterval(refreshUserProfile, REFRESH_INTERVAL);
        return () => clearInterval(intervalId);
    }, [account]);

    return (
        <div className="mt-8 flex flex-col items-center">
            {userObjects ? (
                hasProfile ? (
                    <div className="w-full max-w-3xl bg-gradient-to-r from-purple-700 to-purple-500 rounded-lg p-6 shadow-md">
                        <h3 className="text-2xl font-semibold text-white mb-6">User Info</h3>
                        {Array.isArray(ProfileData) && ProfileData.length > 0 ? (
                            ProfileData.map((nft, index) => {
                                const fields = nft?.data?.content?.fields;
                                return (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg p-4 mb-4 shadow-lg"
                                    >
                                        <p className="text-lg font-medium text-gray-800">
                                            <span className="font-semibold text-gray-600">
                                                Points:
                                            </span>{" "}
                                            {fields?.points || "N/A"}
                                        </p>
                                        <p className="text-lg font-medium text-gray-800">
                                            <span className="font-semibold text-gray-600">
                                                User ID:
                                            </span>{" "}
                                            {fields?.handle || "N/A"}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-300">No valid Profile data found</p>
                        )}
                    </div>
                ) : (
                    <div className="w-full max-w-md text-center">
                        <h3 className="text-2xl font-semibold text-purple-600 mb-4">
                            No Profile Found
                        </h3>
                        <CreateProfile onSuccess={refreshUserProfile} />
                    </div>
                )
            ) : (
                <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                        Welcome to Next.js Sui Dapp Template
                    </h3>
                    <h3 className="text-lg text-gray-400">
                        Please connect your wallet to view your assets
                    </h3>
                </div>
            )}
        </div>
    );
}
