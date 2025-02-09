import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { getUserProfile } from "../utils/getUserObject";
import { CategorizedObjects } from "../utils/assetsHelpers";
import CreateProfile  from "../components/createProfile";
import { TESTNET_FATE3AI_PACKAGE_ID } from "../config/constants";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../config/networkConfig";
import suiClient from "../cli/suiClient";

const REFRESH_INTERVAL = 3000; // 每 3 秒刷新一次

export default function SetRaffleNft() {
    
    const account = useCurrentAccount();
    const PackageId = useNetworkVariable("PackageId");
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
    const [hasProfile, setHasProfile] = useState(false);
    const [ProfileData, setProfileData] = useState<any | null>(null);

    // 添加 getNftStatus 函数
    const getNftStatus = (active_time: string, checkin_time: string): React.ReactNode => {
        if (checkin_time === "0") {
            return "Unused";
        } else if (checkin_time === active_time) {
            return "Expired";
        } else {
            return `Used ${checkin_time}/${active_time} Days`;
        }
    };

    // 添加 useEffect 来监听账户变化并刷新数据
    useEffect(() => {
        if (account?.address) {
            refreshUserProfile();
        }
    }, [account?.address]);

    async function refreshUserProfile() {
        if (account?.address) {
            try {
                const profile = await getUserProfile(account.address);
                setUserObjects(profile);
    
                const raffleNFT = Object.entries(profile.objects || {}).find(([objectType]) =>
                    objectType.includes(`${PackageId}::profile::RaffleNFT`)
                ) as any;
                
                const Profile = Object.entries(profile.objects || {}).find(([objectType]) =>
                    objectType.includes(`${TESTNET_FATE3AI_PACKAGE_ID}::profile::Profile`)
                ) as any;
        
                const profileid = Profile?.[1]?.[0]?.data?.objectId;
                let usedNftId: string | null = null;
    
                // 获取并检查已使用的 NFT
                if (profileid) {
                    const setRaffleNftInfo = await suiClient.getDynamicFields({parentId: profileid});
                    if (setRaffleNftInfo?.data?.length > 0) {
                        const usedNft = setRaffleNftInfo.data.find(
                            field => field.name?.value === "raffle_nft_name"
                        );
                        if (usedNft) {
                            const usedNftvalue = await suiClient.getObject({id: usedNft.objectId, options: {showContent: true}}) as any;
                            usedNftId = usedNftvalue?.data?.content?.fields?.value;
                        }
                    }
                }
                
                if (raffleNFT && raffleNFT[1]) {
                    // 标记已使用的 NFT
                    const nfts = raffleNFT[1].map((nft: any) => ({
                        ...nft,
                        isUsedNft: nft.data.content.fields.id.id === usedNftId
                    }));
                    setProfileData(nfts);
                    setHasProfile(true);
                } else {
                    setProfileData(null);
                    setHasProfile(false);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setUserObjects(null);
                setProfileData(null);
                setHasProfile(false);
            }
        }
    }

    // 添加选中的 NFT ID 状态
    const [selectedNftId, setSelectedNftId] = useState<string | null>(null);

    // 修改 handleSetRaffleNft 函数，接收 NFT ID
    const handleSetRaffleNft = async (raffle_nft_id: string) => {
        if (!account?.address) {
            console.error("No connected account found.");
            return;
        }

        try {
            if (!userObjects) {
                console.error("userObjects not found.");
                return;
            }
    
            const Profile = Object.entries(userObjects.objects || {}).find(([objectType]) =>
                objectType.includes(`${TESTNET_FATE3AI_PACKAGE_ID}::profile::Profile`)
            ) as any;
    
            const profileid = Profile?.[1]?.[0]?.data?.objectId;
            console.log(profileid);
    
            if (!profileid) {
                console.error("Profile ID is not found.");
                return;
            }
    
            const tx = new Transaction();
            tx.setGasBudget(10000000);
            
            tx.moveCall({
                target: `${PackageId}::profile::add_raffle_nft_to_profile`,
                arguments: [
                    tx.object(profileid),
                    tx.object(raffle_nft_id),    
                    tx.pure.string("raffle_nft_name"),
                    tx.pure.address(raffle_nft_id),
                ],
            });

            const result = await signAndExecute({ transaction: tx });
            console.log(result);
            
            // 成功后刷新数据
            await refreshUserProfile();
            setSelectedNftId(null); // 重置选中状态

        } catch(error) {
            console.error("Error using NFT:", error);
        }
    };

    // 修改 handleSetRaffleNft 函数，接收 NFT ID
    const handleUnSetRaffleNft = async (raffle_nft_id: string) => {
        if (!account?.address) {
            console.error("No connected account found.");
            return;
        }

        try {
            if (!userObjects) {
                console.error("userObjects not found.");
                return;
            }
    
            const Profile = Object.entries(userObjects.objects || {}).find(([objectType]) =>
                objectType.includes(`${TESTNET_FATE3AI_PACKAGE_ID}::profile::Profile`)
            ) as any;
    
            const profileid = Profile?.[1]?.[0]?.data?.objectId;
            console.log(profileid);
    
            if (!profileid) {
                console.error("Profile ID is not found.");
                return;
            }
    
            const tx = new Transaction();
            tx.setGasBudget(10000000);
            
            tx.moveCall({
                target: `${PackageId}::profile::del_raffle_nft_to_profile`,
                arguments: [
                    tx.object(profileid),
                    tx.object(raffle_nft_id),    
                    tx.pure.string("raffle_nft_name"),
                ],
            });

            const result = await signAndExecute({ transaction: tx });
            console.log(result);
            
            // 成功后刷新数据
            await refreshUserProfile();
            setSelectedNftId(null); // 重置选中状态
        } catch(error) {
            console.error("Error using NFT:", error);
        }
    };

    // 修改 handleSetRaffleNft 函数，接收 NFT ID
    const handleDelRaffleNft = async (raffle_nft_id: string) => {
        if (!account?.address) {
            console.error("No connected account found.");
            return;
        }

        try {
            const tx = new Transaction();
            tx.setGasBudget(10000000);
            
            tx.moveCall({
                target: `${PackageId}::profile::burn_raffle_nft`,
                arguments: [
                    tx.object(raffle_nft_id),    
                ],
            });

            const result = await signAndExecute({ transaction: tx });
            console.log(result);
            
            // 成功后刷新数据
            await refreshUserProfile();
        } catch(error) {
            console.error("Error using NFT:", error);
        }
    };

    // 修改渲染部分
    return (
        <div className="mt-8 flex flex-col items-center">
            {!account?.address ? (
                <div className="text-center">
                    <h3 className="text-lg text-gray-400">
                        Please connect your wallet to view reward NFTs
                    </h3>
                </div>
            ) : userObjects === null ? (
                <div className="text-center">
                    <h3 className="text-lg text-gray-400">
                        Loading data...
                    </h3>
                </div>
            ) : (
                <div className="w-full max-w-3xl bg-gradient-to-r from-purple-700 to-purple-500 rounded-lg p-6 shadow-md">
                    <h3 className="text-2xl font-semibold text-white mb-6">Reward NFT List</h3>
                    {Array.isArray(ProfileData) && ProfileData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-gray-600">NFT ID</th>
                                        <th className="px-4 py-3 text-left text-gray-600">Valid Period</th>
                                        <th className="px-4 py-3 text-left text-gray-600">Status</th>
                                        <th className="px-4 py-3 text-left text-gray-600">Reward Effect</th>
                                        <th className="px-4 py-3 text-left text-gray-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ProfileData.map((nft: any, index: number) => {
                                        const fields = nft.data.content.fields;
                                        const nftId = fields.id.id;
                                        const isSelected = selectedNftId === nftId;
                                        const isUsable = fields.checkin_time === "0" && !nft.isUsedNft;
    
                                        return (
                                            <tr 
                                                key={index}
                                                className={`border-t ${!isUsable ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                                            >
                                                <td className="px-4 py-3">
                                                    <span className="font-mono text-sm">{nftId.slice(0, 10)}...</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fields.active_time} days
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`font-medium ${
                                                        nft.isUsedNft 
                                                            ? "text-blue-600"
                                                            : fields.checkin_time === "0" 
                                                                ? "text-green-600" 
                                                                : fields.checkin_time === fields.active_time 
                                                                    ? "text-red-600" 
                                                                    : "text-yellow-600"
                                                    }`}>
                                                        {nft.isUsedNft 
                                                            ? "In Use"
                                                            : getNftStatus(fields.active_time, fields.checkin_time)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {fields.factor}x Check-in Reward
                                                </td>
                                                <td className="px-4 py-3">
                                                    {nft.isUsedNft ? (
                                                        <button
                                                            onClick={() => setSelectedNftId(isSelected ? null : nftId)}
                                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                                isSelected 
                                                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            {isSelected ? 'Cancel Selection' : 'Cancel Use'}
                                                        </button>
                                                    ) : fields.checkin_time === fields.active_time ? (
                                                        <button
                                                            onClick={() => setSelectedNftId(isSelected ? null : nftId)}
                                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                                isSelected 
                                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            {isSelected ? 'Cancel Selection' : 'Destroy'}
                                                        </button>
                                                    ) : isUsable && (
                                                        <button
                                                            onClick={() => setSelectedNftId(isSelected ? null : nftId)}
                                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                                isSelected 
                                                                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            {isSelected ? 'Cancel Selection' : 'Select'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-300">No reward NFTs available</p>
                    )}
                    
                    {selectedNftId && (
                        <button
                            onClick={() => {
                                const selectedNft = ProfileData.find((nft: any) => nft.data.content.fields.id.id === selectedNftId);
                                if (selectedNft?.isUsedNft) {
                                    handleUnSetRaffleNft(selectedNftId);
                                } else if (selectedNft?.data.content.fields.checkin_time === selectedNft?.data.content.fields.active_time) {
                                    handleDelRaffleNft(selectedNftId);
                                } else {
                                    handleSetRaffleNft(selectedNftId);
                                }
                            }}
                            className={`mt-6 w-full py-3 px-6 rounded-lg text-white transition-colors ${
                                ProfileData.find((nft: any) => nft.data.content.fields.id.id === selectedNftId)?.isUsedNft
                                    ? 'bg-yellow-600 hover:bg-yellow-700'
                                    : ProfileData.find((nft: any) => nft.data.content.fields.id.id === selectedNftId)?.data.content.fields.checkin_time === 
                                      ProfileData.find((nft: any) => nft.data.content.fields.id.id === selectedNftId)?.data.content.fields.active_time
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                        >
                            {(() => {
                                const selectedNft = ProfileData.find((nft: any) => nft.data.content.fields.id.id === selectedNftId);
                                if (selectedNft?.isUsedNft) {
                                    return 'Cancel Use of Selected NFT';
                                } else if (selectedNft?.data.content.fields.checkin_time === selectedNft?.data.content.fields.active_time) {
                                    return 'Destroy Selected NFT';
                                } else {
                                    return 'Use Selected NFT';
                                }
                            })()}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

