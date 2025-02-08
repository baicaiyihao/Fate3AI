import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { getUserProfile } from "../utils/getUserObject";
import { CategorizedObjects } from "../utils/assetsHelpers";
import CreateProfile from "../components/createProfile";
import { TESTNET_FATE3AI_PACKAGE_ID } from "../config/constants";
import suiClient from "../cli/suiClient";
import { useNetworkVariable } from "../config/networkConfig";
import Image from "next/image";
const REFRESH_INTERVAL = 3000;

export default function Getuserinfo() {
    const account = useCurrentAccount();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
    const [hasProfile, setHasProfile] = useState(false);
    const [ProfileData, setProfileData] = useState<any | null>(null);
    const [usedNftData, setUsedNftData] = useState<any | null>(null);

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

                    // 检查是否有使用中的 NFT
                    const profileid = Profile[1]?.[0]?.data?.objectId;
                    if (profileid) {
                        const setRaffleNftInfo = await suiClient.getDynamicFields({ parentId: profileid });
                        if (setRaffleNftInfo?.data?.length > 0) {
                            const usedNft = setRaffleNftInfo.data.find(
                                field => field.name?.value === "raffle_nft_name"
                            );
                            if (usedNft) {
                                const usedNftvalue = await suiClient.getObject({
                                    id: usedNft.objectId,
                                    options: { showContent: true }
                                }) as any;
                                const nftId = usedNftvalue?.data?.content?.fields?.value;

                                // 获取 NFT 详细信息
                                const nftInfo = Object.entries(profile.objects || {}).find(([objectType]) =>
                                    objectType.includes(`${PackageId}::profile::RaffleNFT`)
                                ) as any;

                                if (nftInfo && nftInfo[1]) {
                                    const nft = nftInfo[1].find((n: any) =>
                                        n.data.content.fields.id.id === nftId
                                    );
                                    if (nft) {
                                        setUsedNftData(nft);
                                    }
                                }
                            }
                        }
                    }
                } else {
                    setProfileData(false);
                    setUsedNftData(null);
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
        <div className="mt-8  h-full flex flex-col items-center">
            {userObjects ? (
                hasProfile ? (
                    <div className="w-full h-full max-w-3xl rounded-lg">
                        <h3 className="text-4xl font-semibold  mb-6 flex ml-4">User Info</h3>
                        {Array.isArray(ProfileData) && ProfileData.length > 0 ? (
                            ProfileData.map((nft, index) => {
                                const fields = nft?.data?.content?.fields;
                                return (
                                    <div key={index} className="w-full h-5/6  rounded-lg p-4 flex flex-col justify-center items-center gap-4">
                                        <div className="w-full flex flex-row justify-center items-center gap-4">
                                            <div className="w-1/2 h-20 border-2 border-[#dcdee9] rounded-lg p-4">
                                                <p className="text-lg font-medium text-gray-800">
                                                    <div className="flex flex-row justify-center items-center gap-2">
                                                        <Image src="/logo.png" alt="Points" width={20} height={20} />
                                                        <span className="font-semibold text-purple-600 text-2xl">Points:</span>{" "}
                                                    </div>
                                                    <p className="text-3xl text-black-600 text-center">{fields?.points || "N/A"}</p>
                                                </p>
                                            </div>
                                            <div className="w-1/2 h-20 border-2 border-[#dcdee9] rounded-lg p-4">
                                                <p className="text-lg font-medium text-gray-800">
                                                    <div className="flex flex-row justify-center items-center gap-2">
                                                        <Image src="/logo.png" alt="User ID" width={20} height={20} />
                                                        <span className="font-semibold text-purple-600 text-2xl">User ID:</span>{" "}
                                                    </div>
                                                    <p className="text-3xl text-black-600 text-center">{fields?.handle || "N/A"}</p>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full h-full relative">
                                            <Image 
                                                src="/bg2.jpg" 
                                                alt="NFT Image" 
                                                width={400}
                                                height={500}
                                                className="w-full h-full object-cover border-2 border-[#dcdee9]" 
                                            />
                                            <div className="absolute inset-0 z-10 mt-20 flex flex-col items-center text-4xl text-gray-400 font-bold">
                                                Keep Check In and you can Get Points
                                            </div>
                                        </div>
                                        {usedNftData && (
                                            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                                                <p className="text-lg font-medium text-purple-800">
                                                    <span className="font-semibold">Active NFT:</span>{" "}
                                                    {usedNftData.data.content.fields.factor}倍签到奖励
                                                </p>
                                                <p className="text-sm text-purple-600">
                                                    剩余时间: {
                                                        parseInt(usedNftData.data.content.fields.active_time) -
                                                        parseInt(usedNftData.data.content.fields.checkin_time)
                                                    } 天
                                                </p>
                                            </div>
                                        )}
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
                        Welcome to Fate3AI
                    </h3>
                    <h3 className="text-lg text-gray-400">
                        Please connect your wallet to view your assets
                    </h3>
                </div>
            )}
        </div>
    );
}
