import React, { useEffect, useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { TESTNET_AppTokenCap, TESTNET_RaffleInfo } from "../config/constants";
import { suiClient } from "../cli/suiClient";


const Lottery: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [raffleData, setRaffleData] = useState<any>(null);
    const [lotteryResult, setLotteryResult] = useState<string>("");

    async function refreshLotteryInfo() {
        const raffleInfo = await suiClient.getObject({
            id: TESTNET_RaffleInfo,
            options: {
                showContent: true,
            },
        }) as any;
        setRaffleData(raffleInfo?.data?.content?.fields);
    }

    

    const checkLotteryResult = (randomNumber: number, prizeProb: any) => {
        const grandWeight = parseInt(prizeProb.grand_prize_weight);
        const secondWeight = parseInt(prizeProb.second_prize_weight);
        const thirdWeight = parseInt(prizeProb.third_prize_weight);

        if (randomNumber < grandWeight) {
            return "恭喜获得一等奖！";
        } else if (randomNumber < grandWeight + secondWeight) {
            return "恭喜获得二等奖！";
        } else if (randomNumber < grandWeight + secondWeight + thirdWeight) {
            return "恭喜获得三等奖！";
        } else {
            return `未中奖，退还 ${raffleData?.refund_rate}% 票价`;
        }
    };

    const handleLottery = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }
    
        try {
    
            const tx = new Transaction();
            tx.setGasBudget(10000000);
    
            tx.moveCall({
                target: `${PackageId}::raffle::lottery`,
                arguments: [
                    tx.object("0x6"),
                    tx.pure.vector('u64', [1, 2, 3]),
                    tx.object(TESTNET_RaffleInfo),
                    tx.object(TESTNET_AppTokenCap),
                ],
            });
    
            const result = await signAndExecute({ transaction: tx });
    
            await new Promise((resolve) => setTimeout(resolve, 2000));

            if (result && !isError) {
                const eventsResult = await suiClient.queryEvents({
                    query: { Transaction: result.digest },
                });
                if (eventsResult.data.length > 0) {
                    const firstEvent = eventsResult.data[0]?.parsedJson as { result?: string };
                    const eventResult = parseInt(firstEvent?.result || "0");
                    const lotteryResultText = checkLotteryResult(eventResult, raffleData?.prize_prob?.fields);
                    console.log(eventResult);
                    console.log("抽奖结果:", lotteryResultText);
                    setLotteryResult(lotteryResultText);
                }
            }
        } catch (error) {
            console.error("Error checking in:", error);
        }
    };

    useEffect(() => {
        refreshLotteryInfo();

    }, [currentAccount]);
    
    return (
        <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">{raffleData?.name || '抽奖活动'}</h2>
                <p className="text-gray-600 mb-4">{raffleData?.description}</p>
                
                <div className="grid gap-4 mb-6">
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">票价：</span>
                        <span>{raffleData?.ticket_cost} Token</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">退款比例：</span>
                        <span>{raffleData?.refund_rate}%</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">奖品信息</h3>
                    
                    <div className="grid gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-lg mb-2">一等奖</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>有效期：{raffleData?.prize?.fields?.grand_prize_duration} 天</div>
                                <div>中奖率：{raffleData?.prize_prob?.fields?.grand_prize_weight}%</div>
                                <div>奖品效果：双倍签到奖励</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-lg mb-2">二等奖</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>有效期：{raffleData?.prize?.fields?.second_prize_duration} 天</div>
                                <div>中奖率：{raffleData?.prize_prob?.fields?.second_prize_weight}%</div>
                                <div>奖品效果：双倍签到奖励</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-lg mb-2">三等奖</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>有效期：{raffleData?.prize?.fields?.third_prize_duration} 天</div>
                                <div>中奖率：{raffleData?.prize_prob?.fields?.third_prize_weight}%</div>
                                <div>奖品效果：双倍签到奖励</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleLottery}
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors w-full"
            >
                立即抽奖
            </button>

            {lotteryResult && (
                <div className={`p-4 rounded-lg text-center text-lg font-medium ${
                    lotteryResult.includes('恭喜') 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                }`}>
                    {lotteryResult}
                </div>
            )}
        </div>
    );
};

export default Lottery;