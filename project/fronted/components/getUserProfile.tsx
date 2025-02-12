import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { getUserProfile } from "../utils/getUserObject";
import { CategorizedObjects } from "../utils/assetsHelpers";
import CreateProfile from "../components/createProfile";
import { TESTNET_FATE3AI_PACKAGE_ID } from "../config/constants";
import suiClient from "../cli/suiClient";
import { useNetworkVariable } from "../config/networkConfig";
import Image from "next/image";
import { eventBus } from "@/utils/eventBus";
const REFRESH_INTERVAL = 3000;

export default function Getuserinfo() {
    const account = useCurrentAccount();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
    const [hasProfile, setHasProfile] = useState(false);
    const [ProfileData, setProfileData] = useState<any | null>(null);
    const [usedNftData, setUsedNftData] = useState<any | null>(null);
    const [totalBalance, setTotalBalance] = useState<number>(0);

    async function refreshUserProfile() {
        if (account?.address) {
            try {
                const profile = await getUserProfile(account.address);
                setUserObjects(profile);

                const Profile = Object.entries(profile.objects || {}).find(([objectType]) =>
                    objectType.includes(`${TESTNET_FATE3AI_PACKAGE_ID}::profile::Profile`)
                );

                const allTokens = Object.entries(profile.objects || {}).filter(([objectType]) =>
                    objectType.includes(`0x2::token::Token<${PackageId}::fate::FATE>`)
                ) as any;

                // 计算所有 token 的总余额
                const total = allTokens[0]?.[1]?.reduce((sum: number, token: any) => {
                    const balance = parseInt(token.data.content.fields.balance) || 0;
                    return sum + balance;
                }, 0) || 0;
                setTotalBalance(total);

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
        
        // 监听刷新事件
        const handleRefresh = () => refreshUserProfile();
        eventBus.on('refreshProfile', handleRefresh);
        
        const intervalId = setInterval(refreshUserProfile, REFRESH_INTERVAL);
        
        // 清理函数
        return () => {
            eventBus.off('refreshProfile', handleRefresh);
            clearInterval(intervalId);
        };
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
                                            <div className="w-1/3 h-20 border-2 border-[#dcdee9] rounded-lg p-4">
                                                <p className="text-lg font-medium text-gray-800">
                                                    <div className="flex flex-row justify-center items-center gap-2">
                                                        <Image src="/logo.png" alt="User ID" width={20} height={20} />
                                                        <span className="font-semibold text-purple-600 text-2xl">User ID:</span>{" "}
                                                    </div>
                                                    <p className="text-3xl text-black-600 text-center">{fields?.handle || "N/A"}</p>
                                                </p>
                                            </div>
                                            <div className="w-1/3 h-20 border-2 border-[#dcdee9] rounded-lg p-4">
                                                <p className="text-lg font-medium text-gray-800">
                                                    <div className="flex flex-row justify-center items-center gap-2">
                                                        <Image src="/logo.png" alt="Token Balance" width={20} height={20} />
                                                        <span className="font-semibold text-purple-600 text-2xl">FATE:</span>{" "}
                                                    </div>
                                                    <p className="text-3xl text-black-600 text-center">{totalBalance}</p>
                                                </p>
                                            </div>
                                            <div className="w-1/3 h-20 border-2 border-[#dcdee9] rounded-lg p-4">
                                                <p className="text-lg font-medium text-gray-800">
                                                    <div className="flex flex-row justify-center items-center gap-2">
                                                        <Image src="/logo.png" alt="Points" width={20} height={20} />
                                                        <span className="font-semibold text-purple-600 text-2xl">Points:</span>{" "}
                                                    </div>
                                                    <p className="text-3xl text-black-600 text-center">{fields?.points || "N/A"}</p>
                                                </p>
                                            </div>
                                        </div>

                                        {/* 先显示 NFT 信息 */}
                                        {usedNftData && (
                                            <div className="w-full p-3 bg-purple-50 rounded-lg border-2 border-purple-100 mb-1">
                                                <p className="text-lg font-medium text-purple-800 flex justify-between items-center">
                                                    <span>
                                                        <span className="font-semibold">Active NFT: </span>
                                                        {usedNftData.data.content.fields.factor}x Check-in Reward
                                                    </span>
                                                    <span className="text-purple-600">
                                                        time: {
                                                            parseInt(usedNftData.data.content.fields.active_time) -
                                                            parseInt(usedNftData.data.content.fields.checkin_time)
                                                        } days
                                                    </span>
                                                </p>
                                            </div>
                                        )}

                                        {/* 然后是图片区域 */}
                                        <div className="w-full h-[400px] relative">
                                            <Image 
                                                src="/bg2.jpg" 
                                                alt="NFT Image" 
                                                width={400}
                                                height={500}    
                                                className="w-full h-full object-cover border-2 border-[#dcdee9]" 
                                            />
                                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-4xl text-gray-400 font-bold">
                                                Keep check in , you can get FATE token and points!
                                            </div>
                                        </div>
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
                <p className="text-gray-300">Loading...</p>
            )}
        </div>
    );
}
